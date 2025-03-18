#include <fstream>
#include <iostream>
#include <map>
#include <regex>
#include <sstream>
#include <string>
#include <unordered_set>
#include <filesystem>

const std::filesystem::path API_DIR = "./src/shared/api";
const std::string QUERY_KEYS_FILE = "src/shared/api/models/QueryKeys.ts";
const std::unordered_set<std::string> EXCLUDED_FOLDERS = {"models"};
const std::string LOCK_FILE = "./codegen.lock";

void initializeLockFile() {
  std::ifstream infile(LOCK_FILE);
  if (!infile.good()) {
    std::ofstream outfile(LOCK_FILE);
    outfile << "{}";
  }
}

std::map<std::string, std::string> readLockFile() {
  std::ifstream infile(LOCK_FILE);
  std::map<std::string, std::string> lockData;

  if (!infile.is_open()) {
    return lockData;
  }

  std::string line;

  while (std::getline(infile, line)) {
    std::istringstream iss(line);
    std::string key, value;
    if (std::getline(iss, key, ':') && std::getline(iss, value)) {
      lockData[key] = value;
    }
  }
  return lockData;
}

void updateLockFile(const std::string &file, const std::string &hash) {
  std::map<std::string, std::string> lockData = readLockFile();
  lockData[file] = hash;

  std::ofstream outfile(LOCK_FILE);
  for (const auto &[key, value] : lockData) {
    outfile << key << ":" << value << "\n";
  }
}

std::string toSnakeCase(const std::string &input) {
  std::string result;
  for (char c : input) {
    if (std::isupper(c) && !result.empty()) {
      result += "_";
    }
    result += std::toupper(c);
  }
  return result;
}

std::string generateHash(const std::filesystem::path &filePath) {
  std::ifstream file(filePath, std::ios::binary);
  if (!file.is_open()) {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    return "";
  }

  std::ostringstream fileContentStream;
  fileContentStream << file.rdbuf();
  std::string fileContent = fileContentStream.str();

  std::hash<std::string> hasher;
  size_t hashValue = hasher(fileContent);

  return std::to_string(hashValue);
}

bool isExcludedFolder(const std::string &folderName,
                      const std::unordered_set<std::string> &excludedFolders) {
  return excludedFolders.find(folderName) != excludedFolders.end();
}

bool processServiceFile(const std::filesystem::path &filePath) {
  std::string currentHash = generateHash(filePath);
  std::map<std::string, std::string> lockData = readLockFile();

  auto it = lockData.find(filePath.string());
  if (it != lockData.end() && it->second == currentHash) {
    std::cout << "⏭️  No changes detected for: " << filePath
              << ". Skipping...\n";
    return false;
  } else {
    std::cout << "🔄 Changes detected in: " << filePath
              << ". Regenerating...\n";
    return true;
  }
}

void removeIfEmpty(const std::filesystem::path &dirPath) {
  if (std::filesystem::exists(dirPath) &&
      std::filesystem::is_directory(dirPath)) {
    if (std::filesystem::is_empty(dirPath)) {
      std::filesystem::remove(dirPath);
    }
  }
}

void cleanupHooks() {
  std::cout << "🧹 Cleaning up existing queries and mutations folders...\n";

  for (const auto &entry :
       std::filesystem::recursive_directory_iterator(API_DIR)) {
    if (entry.is_regular_file() &&
        entry.path().string().find("Service.ts") != std::string::npos) {
      std::filesystem::path serviceFile = entry.path();
      std::filesystem::path serviceDir = serviceFile.parent_path();
      std::filesystem::path queriesDir = serviceDir / "queries";
      std::filesystem::path mutationsDir = serviceDir / "mutations";

      std::string currentHash =
          std::to_string(std::filesystem::file_size(serviceFile));
      std::ifstream lockFile(LOCK_FILE);
      std::string storedHash;
      bool found = false;
      std::string line;
      while (std::getline(lockFile, line)) {
        if (line.find(serviceFile.string()) != std::string::npos) {
          storedHash = line.substr(line.find(":") + 1);
          found = true;
          break;
        }
      }
      lockFile.close();

      if (found && storedHash == currentHash) {
        std::cout << "⏭️  No changes detected for: " << serviceFile
                  << ". Skipping cleanup.\n";
        continue;
      }

      std::vector<std::string> currentMethods;
      std::ifstream serviceStream(serviceFile);
      std::stringstream buffer;
      buffer << serviceStream.rdbuf();
      std::string fileContent = buffer.str();
      serviceStream.close();

      std::regex methodRegex(
          R"(builder\.(get|getAsPrefetch|getAsMutation|post|postAsQuery|delete|put|patch|paginate|paginateAsPrefetch))");
      std::sregex_iterator iter(fileContent.begin(), fileContent.end(),
                                methodRegex);
      std::sregex_iterator end;
      while (iter != end) {
        currentMethods.push_back(iter->str());
        ++iter;
      }

      if (std::filesystem::exists(queriesDir)) {
        for (const auto &hookFile :
             std::filesystem::directory_iterator(queriesDir)) {
          std::string hookName = hookFile.path().filename().stem().string();
          if (hookName.find("use") == 0) {
            hookName = hookName.substr(3);
          }
          if (std::find(currentMethods.begin(), currentMethods.end(),
                        hookName) == currentMethods.end()) {
            std::cout << "🗑️  Removing outdated query hook: " << hookFile.path()
                      << "\n";
            std::filesystem::remove(hookFile.path());
          }
        }
        removeIfEmpty(queriesDir);
      }

      if (std::filesystem::exists(mutationsDir)) {
        for (const auto &hookFile :
             std::filesystem::directory_iterator(mutationsDir)) {
          std::string hookName = hookFile.path().filename().stem().string();
          if (hookName.find("use") == 0) {
            hookName = hookName.substr(3);
          }
          if (std::find(currentMethods.begin(), currentMethods.end(),
                        hookName) == currentMethods.end()) {
            std::cout << "🗑️  Removing outdated mutation hook: "
                      << hookFile.path() << "\n";
            std::filesystem::remove(hookFile.path());
          }
        }
        removeIfEmpty(mutationsDir);
      }
    }
  }
}

void deleteQueryKeysFile() {
  if (std::filesystem::exists(QUERY_KEYS_FILE)) {
    std::cout << "🗑️  Deleting existing " << QUERY_KEYS_FILE << "...\n";
    std::filesystem::remove(QUERY_KEYS_FILE);
  }
}

std::string toCamelCase(const std::string &input) {
  std::stringstream ss(input);
  std::string word, result;
  bool first = true;

  while (std::getline(ss, word, '_')) {
    if (first) {
      result += std::tolower(word[0]);
      result += word.substr(1);
      first = false;
    } else {
      word[0] = std::toupper(word[0]);
      result += word;
    }
  }

  return result;
}

std::string toCapitalize(const std::string &input) {
  if (input.empty())
    return input;
  std::string result = input;
  result[0] = std::toupper(result[0]);
  return result;
}

std::string extractServicePrefix(const std::string &serviceName) {
  std::string prefix = serviceName;

  if (prefix.find("Service") != std::string::npos) {
    prefix = prefix.substr(0, prefix.find("Service"));
  }
  return toCamelCase(prefix);
}

void updateIndexFile(const std::filesystem::path &serviceDir) {
  std::filesystem::path indexFile = serviceDir / "index.ts";

  if (!std::filesystem::exists(indexFile)) {
    std::ofstream createFile(indexFile);
    createFile.close();
  }

  std::ofstream outFile(indexFile, std::ios::trunc);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to open " << indexFile << " for writing.\n";
    return;
  }

  outFile << "export * from './models';\n";

  std::filesystem::path queriesDir = serviceDir / "queries";
  if (std::filesystem::exists(queriesDir) &&
      std::filesystem::is_directory(queriesDir)) {
    bool hasTsFiles = false;
    for (const auto &entry : std::filesystem::directory_iterator(queriesDir)) {
      if (entry.path().extension() == ".ts") {
        hasTsFiles = true;
        break;
      }
    }
    if (hasTsFiles) {
      outFile << "export * from './queries';\n";
      outFile << "export * from './QueryKeys';\n";
    }
  }

  std::filesystem::path mutationsDir = serviceDir / "mutations";
  if (std::filesystem::exists(mutationsDir) &&
      std::filesystem::is_directory(mutationsDir)) {
    bool hasTsFiles = false;
    for (const auto &entry :
         std::filesystem::directory_iterator(mutationsDir)) {
      if (entry.path().extension() == ".ts") {
        hasTsFiles = true;
        break;
      }
    }
    if (hasTsFiles) {
      outFile << "export * from './mutations';\n";
    }
  }

  outFile.close();
  std::cout << "✅ Updated index.ts at: " << indexFile << "\n";
}

bool isSpecialType(std::string type) {
    type = std::regex_replace(type, std::regex(R"(\[\]$)"), "");

    static const std::regex specialTypePattern(
        R"(^(void|unknown|any|boolean|string|true|false|Object|\{\}|\[\]|0|1|BigInt)$)");

    return std::regex_match(type, specialTypePattern);
}

std::string normalizeType(const std::string& type) {
    return std::regex_replace(type, std::regex(R"(\[\]$)"), "");
}

void generateQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook) {

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to create query file: " << queryFile << "\n";
    return;
  }

  outFile << "import { getQueryClient } from '../../queryClient';\n"
          << "import {\n"
          << "  QueryError,\n"
          << "  QueryKeyType,\n"
          << "  UseQueryWithOptionsParams,\n"
          << "  QueryFetchParams,\n"
          << "  queryKeys,\n"
          << "} from '../../models';\n"
          << "import { useQueryWithOptions } from '../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType)) {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType)) {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest) {
    outFile << "\ninterface HookParams<TData> extends " << requestType << " {\n"
            << "  options?: UseQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "interface QueryFnParams {\n"
            << "  params: " << requestType << ";\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({ params }: QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params);\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "const getQueryKey = (params: " << requestType
            << ") => queryKeys." << queryKeyName << "(params);\n\n";

    outFile << "export const " << endpointName << "Query" << servicePrefixHook
            << " = <\n"
            << "  TData = " << responseType << ",\n"
            << "  TError = QueryError,\n"
            << ">({\n"
            << "  params,\n"
            << "  fetchOptions,\n"
            << "}: QueryFetchParams<\n"
            << "  " << responseType << ",\n"
            << "  TError,\n"
            << "  TData,\n"
            << "  " << requestType << "\n"
            << ">) => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.fetchQuery<\n"
            << "    " << responseType << ",\n"
            << "    TError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >({\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    queryFn: () => " << endpointName << "QueryFn" << serviceName
            << "({ params }),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "Query" << servicePrefixHook
            << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "  ...params\n"
            << "}: HookParams<TData>) => {\n"
            << "  return useQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: () => " << endpointName << "QueryFn" << serviceName
            << "({ params }),\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  } else {
    outFile << "\ninterface HookParams<TData> {\n"
            << "  options?: UseQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async () => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "();\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "const getQueryKey = () => queryKeys." << queryKeyName
            << "();\n\n";

    outFile << "export const " << endpointName << "Query" << servicePrefixHook
            << " = <\n"
            << "  TData = " << responseType << ",\n"
            << "  TError = QueryError,\n"
            << ">({ fetchOptions }: QueryFetchParams<\n"
            << "  " << responseType << ",\n"
            << "  TError,\n"
            << "  TData,\n"
            << "  " << requestType << "\n"
            << ">) => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.fetchQuery<\n"
            << "    " << responseType << ",\n"
            << "    TError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >({\n"
            << "    queryKey: getQueryKey(),\n"
            << "    queryFn: () => " << endpointName << "QueryFn" << serviceName
            << "(),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "Query" << servicePrefixHook
            << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "}: HookParams<TData>) => {\n"
            << "  return useQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: " << endpointName << "QueryFn" << serviceName
            << ",\n"
            << "    queryKey: getQueryKey(),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  }

  outFile.close();
  std::cout << "✅ Query hook generated: " << queryFile << "\n";
}

void generatePrefetchQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook) {

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to create prefetch query file: " << queryFile
              << "\n";
    return;
  }

  outFile << "import { getQueryClient } from '../../queryClient';\n"
          << "import {\n"
          << "  QueryError,\n"
          << "  QueryKeyType,\n"
          << "  UsePrefetchQueryWithOptionsParams,\n"
          << "  QueryFetchParams,\n"
          << "  queryKeys,\n"
          << "} from '../../models';\n"
          << "import { usePrefetchQueryWithOptions } from '../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType)) {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType)) {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest) {
    outFile << "\ninterface HookParams<TData> extends " << requestType << " {\n"
            << "  options?: UsePrefetchQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "interface QueryFnParams {\n"
            << "  params: " << requestType << ";\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({ params }: QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params);\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "const getQueryKey = (params: " << requestType
            << ") => queryKeys." << queryKeyName << "(params);\n\n";

    outFile << "export const " << endpointName << "PrefetchQuery"
            << servicePrefixHook << " = <\n"
            << "  TData = " << responseType << ",\n"
            << "  TError = QueryError,\n"
            << ">({\n"
            << "  params,\n"
            << "  fetchOptions,\n"
            << "}: QueryFetchParams<\n"
            << "  " << responseType << ",\n"
            << "  TError,\n"
            << "  TData,\n"
            << "  " << requestType << "\n"
            << ">) => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.prefetchQuery<\n"
            << "    " << responseType << ",\n"
            << "    TError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >({\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    queryFn: () => " << endpointName << "QueryFn" << serviceName
            << "({ params }),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "PrefetchQuery"
            << servicePrefixHook << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "  ...params\n"
            << "}: HookParams<TData>) => {\n"
            << "  return usePrefetchQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: () => " << endpointName << "QueryFn" << serviceName
            << "({ params }),\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  } else {
    outFile << "\ninterface HookParams<TData> {\n"
            << "  options?: UsePrefetchQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async () => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "();\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "const getQueryKey = () => queryKeys." << queryKeyName
            << "();\n\n";

    outFile << "export const " << endpointName << "PrefetchQuery"
            << servicePrefixHook << " = <\n"
            << "  TData = " << responseType << ",\n"
            << "  TError = QueryError,\n"
            << ">({ fetchOptions }: QueryFetchParams<\n"
            << "  " << responseType << ",\n"
            << "  TError,\n"
            << "  TData,\n"
            << "  " << requestType << "\n"
            << ">) => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.prefetchQuery<\n"
            << "    " << responseType << ",\n"
            << "    TError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >({\n"
            << "    queryKey: getQueryKey(),\n"
            << "    queryFn: () => " << endpointName << "QueryFn" << serviceName
            << "(),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "PrefetchQuery"
            << servicePrefixHook << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "}: HookParams<TData>) => {\n"
            << "  return usePrefetchQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: " << endpointName << "QueryFn" << serviceName
            << ",\n"
            << "    queryKey: getQueryKey(),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  }

  outFile.close();
  std::cout << "✅ Prefetch query hook generated: " << queryFile << "\n";
}

void generateInfiniteQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook) {

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to create infinite query file: " << queryFile
              << "\n";
    return;
  }

  outFile << "import { getQueryClient } from '../../queryClient';\n"
          << "import { InfiniteData } from '@tanstack/react-query';\n"
          << "import {\n"
          << "  InfiniteQueryFetchParams,\n"
          << "  QueryError,\n"
          << "  QueryKeyType,\n"
          << "  UseInfiniteQueryWithOptionsParams,\n"
          << "  queryKeys,\n"
          << "} from '../../models';\n"
          << "import { useInfiniteQueryWithOptions } from '../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType)) {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType)) {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  outFile << "\ntype PageParam = string | number | unknown;\n\n";

  outFile << "interface InfiniteHookParams<TData, TPageParam = PageParam> "
             "extends "
          << requestType << " {\n"
          << "  initialPageParam: TPageParam;\n"
          << "  getNextPageParam: UseInfiniteQueryWithOptionsParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    TData,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['getNextPageParam'];\n"
          << "  options?: UseInfiniteQueryWithOptionsParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    TData,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['options'];\n"
          << "}\n\n";

  outFile << "interface InfiniteFetchParams<TData, TPageParam = PageParam> "
             "extends "
          << requestType << " {\n"
          << "  initialPageParam: TPageParam;\n"
          << "  getNextPageParam: InfiniteQueryFetchParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    " << requestType << ",\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['getNextPageParam'];\n"
          << "  options?: InfiniteQueryFetchParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    " << requestType << ",\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['fetchOptions'];\n"
          << "}\n\n";

  outFile << "interface QueryFnParams<TPageParam> {\n"
          << "  params: " << requestType << ";\n"
          << "  pageParam: TPageParam;\n"
          << "}\n\n";

  outFile << "export const " << endpointName << "QueryFn" << serviceName
          << " = async <TPageParam extends PageParam>({\n"
          << "  params,\n"
          << "  pageParam,\n"
          << "}: QueryFnParams<TPageParam>) => {\n"
          << "  const response = await " << serviceName << "." << endpointName
          << "({ ...params, pageParam });\n"
          << "  return response?.data;\n"
          << "};\n\n";

  outFile << "const getQueryKey = (params: " << requestType << ") => queryKeys."
          << queryKeyName << "(params);\n\n";

  outFile << "export const " << endpointName << "InfiniteQuery"
          << servicePrefixHook << " = <\n"
          << "  TData = " << responseType << ",\n"
          << "  TPageParam = PageParam,\n"
          << ">({\n"
          << "  initialPageParam,\n"
          << "  getNextPageParam,\n"
          << "  options,\n"
          << "  ...params\n"
          << "}: InfiniteFetchParams<TData, TPageParam>) => {\n"
          << "  const queryClient = getQueryClient();\n\n"
          << "  return queryClient.fetchInfiniteQuery<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >({\n"
          << "    queryFn: ({ pageParam }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    ...options,\n"
          << "  });\n"
          << "};\n\n";

  outFile << "export const " << hookName << "InfiniteQuery" << servicePrefixHook
          << " = <\n"
          << "  TData = " << responseType << ",\n"
          << "  TPageParam = PageParam,\n"
          << ">({\n"
          << "  options,\n"
          << "  initialPageParam,\n"
          << "  getNextPageParam,\n"
          << "  ...params\n"
          << "}: InfiniteHookParams<TData, TPageParam>) => {\n"
          << "  return useInfiniteQueryWithOptions<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    TData,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >({\n"
          << "    queryFn: ({ pageParam }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    options,\n"
          << "  });\n"
          << "};\n";

  outFile.close();
  std::cout << "✅ Infinite query hook generated: " << queryFile << "\n";
}

void generatePrefetchInfiniteQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook) {

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to create prefetch infinite query file: "
              << queryFile << "\n";
    return;
  }

  outFile << "import { getQueryClient } from '../../queryClient';\n"
          << "import {\n"
          << "  FetchInfiniteQueryOptions,\n"
          << "  GetNextPageParamFunction,\n"
          << "  InfiniteData,\n"
          << "} from '@tanstack/react-query';\n"
          << "import { QueryError, QueryKeyType, queryKeys } from "
             "'../../models';\n"
          << "import { usePrefetchInfiniteQueryWithOptions } from "
             "'../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType)) {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType)) {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  outFile << "\ntype PageParam = string | number | unknown;\n\n";

  outFile << "interface InfiniteHookParams<TData, TPageParam = PageParam> "
             "extends "
          << requestType << " {\n"
          << "  initialPageParam: TPageParam;\n"
          << "  getNextPageParam: GetNextPageParamFunction<TPageParam, "
          << responseType << ">;\n"
          << "  options?: Omit<\n"
          << "    FetchInfiniteQueryOptions<\n"
          << "      " << responseType << ",\n"
          << "      QueryError,\n"
          << "      InfiniteData<TData, TPageParam>,\n"
          << "      QueryKeyType,\n"
          << "      TPageParam\n"
          << "    >,\n"
          << "    'queryFn' | 'queryKey' | 'initialPageParam' | "
             "'getNextPageParam'\n"
          << "  >;\n"
          << "}\n\n";

  outFile << "interface InfiniteFetchParams<TData, TPageParam = PageParam> "
             "extends "
          << requestType << " {\n"
          << "  initialPageParam: TPageParam;\n"
          << "  getNextPageParam: InfiniteQueryFetchParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    " << requestType << ",\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['getNextPageParam'];\n"
          << "  options?: InfiniteQueryFetchParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    " << requestType << ",\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['fetchOptions'];\n"
          << "}\n\n";

  outFile << "interface QueryFnParams<TPageParam> {\n"
          << "  params: " << requestType << ";\n"
          << "  pageParam: TPageParam;\n"
          << "}\n\n";

  outFile << "export const " << endpointName << "QueryFn" << serviceName
          << " = async <TPageParam extends PageParam>({\n"
          << "  params,\n"
          << "  pageParam,\n"
          << "}: QueryFnParams<TPageParam>) => {\n"
          << "  const response = await " << serviceName << "." << endpointName
          << "({ ...params, pageParam });\n"
          << "  return response?.data;\n"
          << "};\n\n";

  outFile << "const getQueryKey = (params: " << requestType << ") => queryKeys."
          << queryKeyName << "(params);\n\n";

  outFile << "export const " << endpointName << "PrefetchInfiniteQuery"
          << servicePrefixHook << " = <\n"
          << "  TData = " << responseType << ",\n"
          << "  TPageParam = PageParam,\n"
          << ">({\n"
          << "  initialPageParam,\n"
          << "  getNextPageParam,\n"
          << "  options,\n"
          << "  ...params\n"
          << "}: InfiniteFetchParams<TData, TPageParam>) => {\n"
          << "  const queryClient = getQueryClient();\n\n"
          << "  return queryClient.prefetchInfiniteQuery<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >({\n"
          << "    queryFn: ({ pageParam }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    ...options,\n"
          << "  });\n"
          << "};\n\n";

  outFile << "export const " << hookName << "PrefetchInfiniteQuery"
          << servicePrefixHook << " = <\n"
          << "  TData = " << responseType << ",\n"
          << "  TPageParam = PageParam,\n"
          << ">({\n"
          << "  options,\n"
          << "  initialPageParam,\n"
          << "  getNextPageParam,\n"
          << "  ...params\n"
          << "}: InfiniteHookParams<TData, TPageParam>) => {\n"
          << "  return usePrefetchInfiniteQueryWithOptions<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    TData,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >({\n"
          << "    queryFn: ({ pageParam }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    options,\n"
          << "  });\n"
          << "};\n";

  outFile.close();
  std::cout << "✅ Prefetch infinite query hook generated: " << queryFile
            << "\n";
}

void generateMutationHook(const std::filesystem::path &hooksDir,
                          const std::string &hookName,
                          const std::string &responseType,
                          const std::string &requestType,
                          const std::string &serviceName,
                          const std::string &endpointName,
                          const std::string &servicePrefix, bool isVoidRequest,
                          const std::string &servicePrefixHook) {

  std::filesystem::path mutationFile =
      hooksDir / "mutations" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(mutationFile);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to create mutation hook file: "
              << mutationFile << "\n";
    return;
  }

  std::string inlineResponseType =
      isSpecialType(responseType) ? responseType : responseType;
  std::string inlineRequestType =
      isSpecialType(requestType) ? requestType : requestType;

  outFile << "import { useMutation } from '@tanstack/react-query';\n"
          << "import { QueryError } from '../../models';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType)) {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType)) {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest) {
    outFile << "\nexport const " << endpointName << "MutationFn" << serviceName
            << " = async (params: " << inlineRequestType << ") => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params);\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "export const " << hookName << "Mutation" << servicePrefixHook
            << " = () => {\n"
            << "  return useMutation<" << inlineResponseType << ", QueryError, "
            << inlineRequestType << ">({\n"
            << "    mutationFn: " << endpointName << "MutationFn" << serviceName
            << ",\n"
            << "  });\n"
            << "};\n";
  } else {
    outFile << "\nexport const " << endpointName << "MutationFn" << serviceName
            << " = async () => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "();\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "export const " << hookName << "Mutation" << servicePrefixHook
            << " = () => {\n"
            << "  return useMutation<" << inlineResponseType
            << ", QueryError, void>({\n"
            << "    mutationFn: " << endpointName << "MutationFn" << serviceName
            << ",\n"
            << "  });\n"
            << "};\n";
  }

  std::filesystem::path indexFile = hooksDir / "mutations" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open()) {
    std::cerr << "❌ Error: Unable to update mutations index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  indexOutFile.close();

  std::cout << "✅ Mutation hook generated: " << mutationFile << "\n";
}

std::string capitalizeFirstLetter(const std::string &str) {
  if (str.empty())
    return str;
  std::string capitalized = str;
  capitalized[0] = toupper(capitalized[0]);
  return capitalized;
}

std::string readFile(const std::filesystem::path &filePath) {
  std::ifstream file(filePath);
  if (!file.is_open()) {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    return "";
  }

  std::ostringstream content;
  content << file.rdbuf();
  return content.str();
}

void createQueriesIndexFile(const std::filesystem::path &queriesDir) {
  std::filesystem::path indexFile = queriesDir / "index.ts";

  std::ofstream outFile(indexFile, std::ios::trunc);
  if (!outFile.is_open()) {
    std::cerr << "❌ Error: Unable to open " << indexFile << " for writing.\n";
    return;
  }

  outFile << "// Auto-generated index file for queries\n";

  for (const auto &entry : std::filesystem::directory_iterator(queriesDir)) {
    if (entry.path().extension() == ".ts" &&
        entry.path().filename() != "index.ts") {
      std::string moduleName = entry.path().stem().string();
      outFile << "export * from './" << moduleName << "';\n";
    }
  }

  outFile.close();
  std::cout << "✅ Created queries/index.ts at: " << indexFile << "\n";
}

void generateHooks(const std::string &serviceName,
                   const std::filesystem::path &serviceFile,
                   const std::filesystem::path &hooksDir) {

  std::filesystem::create_directories(hooksDir / "queries");
  std::filesystem::create_directories(hooksDir / "mutations");

  std::string fileContent = readFile(serviceFile);
  if (fileContent.empty()) {
    return;
  }

  std::regex methodPattern(
      R"(([a-zA-Z0-9_]+):\s*builder\.(get|getAsPrefetch|getAsMutation|post|postAsQuery|delete|put|patch|paginate|paginateAsPrefetch)<\s*([^,]+),\s*([^>]+)>)");

  bool hasQueries = false;
  bool hasMutations = false;

  std::sregex_iterator it(fileContent.begin(), fileContent.end(),
                          methodPattern);
  std::sregex_iterator end;

  for (; it != end; ++it) {
    std::smatch match = *it;

    std::string endpointName = match[1].str();
    std::string method = match[2].str();
    std::string responseType = match[3].str();
    std::string requestType = match[4].str();

    std::cout << "🔍 Processing method: " << method << "\n";
    std::cout << "📌 Extracted Endpoint: " << endpointName << "\n";
    std::cout << "📌 Response Type: " << responseType << "\n";
    std::cout << "📌 Request Type: " << requestType << "\n";

    std::string hookName = "use" + capitalizeFirstLetter(endpointName);
    std::string servicePrefix = extractServicePrefix(serviceName);
    std::string servicePrefixHook = serviceName;
    std::string queryKeyName =
        toSnakeCase(endpointName) + "_" + toSnakeCase(serviceName);

    bool isVoidRequest = requestType == "void";
    bool isVoidResponse = responseType == "void";

    std::cout << "🔗 Processing QUERY KEY: " << queryKeyName << "\n";

    if (method == "get" || method == "postAsQuery") {
      hasQueries = true;
      generateQueryHook(hooksDir, hookName, responseType, requestType,
                        queryKeyName, serviceName, endpointName, servicePrefix,
                        isVoidRequest, servicePrefixHook);
    } else if (method == "getAsPrefetch") {
      hasQueries = true;
      generatePrefetchQueryHook(hooksDir, hookName, responseType, requestType,
                                queryKeyName, serviceName, endpointName,
                                servicePrefix, isVoidRequest,
                                servicePrefixHook);
    } else if (method == "paginate" || method == "paginateAsPrefetch") {
      hasQueries = true;
      generateInfiniteQueryHook(hooksDir, hookName, responseType, requestType,
                                queryKeyName, serviceName, endpointName,
                                servicePrefix, isVoidRequest,
                                servicePrefixHook);
    } else if (std::regex_match(
                   method,
                   std::regex(R"(post|getAsMutation|delete|put|patch)"))) {
      hasMutations = true;
      generateMutationHook(hooksDir, hookName, responseType, requestType,
                           serviceName, endpointName, servicePrefix,
                           isVoidRequest, servicePrefixHook);
    }
  }

  if (!hasQueries) {
    std::filesystem::remove_all(hooksDir / "queries");
    std::cout << "❌ No queries generated for " << serviceName
              << ". Removed queries folder.\n";
  } else {
    createQueriesIndexFile(hooksDir / "queries");
  }

  if (!hasMutations) {
    std::filesystem::remove_all(hooksDir / "mutations");
    std::cout << "❌ No mutations generated for " << serviceName
              << ". Removed mutations folder.\n";
  } else {
    createQueriesIndexFile(hooksDir / "mutations");
  }
}

int main() {
  const std::filesystem::path apiDir = "./src/shared/api";
  const std::unordered_set<std::string> excludedFolders = {"models"};

  initializeLockFile();
  std::map<std::string, std::string> lockData = readLockFile();

  std::cout << "\n🔍 Initializing API hooks generation...\n"
            << "📂 Searching for services in: " << apiDir << "\n";

  for (const auto &entry :
       std::filesystem::recursive_directory_iterator(apiDir)) {
    if (entry.is_regular_file() && entry.path().extension() == ".ts" &&
        entry.path().filename().string().find("Service") != std::string::npos) {

      std::string serviceFilePath = entry.path().string();
      std::string serviceName = entry.path().stem().string();
      std::filesystem::path serviceDir = entry.path().parent_path();
      std::string folderName = serviceDir.filename().string();

      if (isExcludedFolder(folderName, excludedFolders)) {
        std::cout << "⚠️  Skipping excluded folder: " << serviceDir << "\n";
        continue;
      }

      std::string currentHash = generateHash(entry.path());

      auto it = lockData.find(serviceFilePath);
      if (it != lockData.end() && it->second == currentHash) {
        std::cout << "⏭️  No changes detected for: " << serviceName
                  << ". Skipping...\n";
        continue;
      }

      std::cout << "🛠️  Generating hooks for: " << serviceName << "\n";
      generateHooks(serviceName, entry.path(), serviceDir);

      std::cout << "🔄 Updating lock file for " << serviceName << "\n";
      updateLockFile(serviceFilePath, currentHash);
    }
  }

  std::cout << "\n✅ All hooks generated successfully!\n";
  return 0;
}
