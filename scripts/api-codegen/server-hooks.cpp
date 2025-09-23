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

std::string toCamelCase(const std::string &input)
{
  std::stringstream ss(input);
  std::string word, result;
  bool first = true;

  while (std::getline(ss, word, '_'))
  {
    if (first)
    {
      result += std::tolower(word[0]);
      result += word.substr(1);
      first = false;
    }
    else
    {
      word[0] = std::toupper(word[0]);
      result += word;
    }
  }

  return result;
}

std::string capitalizeFirstLetter(const std::string &input)
{
  if (input.empty())
    return input;
  std::string result = input;
  result[0] = std::toupper(result[0]);
  return result;
}

std::string toSnakeCase(const std::string &input)
{
  std::string result;
  for (size_t i = 0; i < input.length(); i++)
  {
    if (std::isupper(input[i]) && i > 0)
    {
      result += "_";
    }
    result += std::tolower(input[i]);
  }
  return result;
}

std::string toCapitalize(const std::string &input)
{
  return capitalizeFirstLetter(input);
}

std::string extractServicePrefix(const std::string &serviceName)
{
  std::string result = serviceName;
  if (result.size() > 7 && result.substr(result.size() - 7) == "Service")
  {
    result = result.substr(0, result.size() - 7);
  }
  return result;
}

std::string generateHash(const std::filesystem::path &filePath)
{
  std::ifstream file(filePath, std::ios::binary);
  if (!file.is_open())
  {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    return "";
  }

  std::ostringstream fileContentStream;
  fileContentStream << file.rdbuf();
  std::string fileContent = fileContentStream.str();

  std::regex methodPattern(
      R"(([a-zA-Z0-9_]+):\s*builder\.(query|prefetch|mutation|infiniteQuery|prefetchInfiniteQuery|suspenseQuery|suspenseInfiniteQuery|queries)\s*\()");

  std::sregex_iterator it(fileContent.begin(), fileContent.end(), methodPattern);
  std::sregex_iterator end;

  std::string endpointData;
  for (; it != end; ++it)
  {
    endpointData += it->str() + "\n";
  }

  std::hash<std::string> hasher;
  size_t hashValue = hasher(endpointData);

  std::cout << "🛠️  Extracted Endpoints for Hashing: \n"
            << endpointData;
  std::cout << "🔢 Generated Hash: " << hashValue << "\n";

  return std::to_string(hashValue);
}

std::string normalizeType(const std::string &type)
{
  return std::regex_replace(type, std::regex(R"(\[\]$)"), "");
}

std::string readFileContent(const std::filesystem::path &filePath)
{
  std::ifstream file(filePath);
  if (!file.is_open())
  {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    return "";
  }

  std::ostringstream fileContentStream;
  fileContentStream << file.rdbuf();
  return fileContentStream.str();
}

bool isExcludedFolder(const std::string &folderName,
                      const std::unordered_set<std::string> &excludedFolders)
{
  return excludedFolders.find(folderName) != excludedFolders.end();
}

void removeIfEmpty(const std::filesystem::path &dirPath)
{
  if (std::filesystem::exists(dirPath) &&
      std::filesystem::is_directory(dirPath))
  {
    if (std::filesystem::is_empty(dirPath))
    {
      std::filesystem::remove(dirPath);
    }
  }
}

void deleteQueryKeysFile()
{
  if (std::filesystem::exists(QUERY_KEYS_FILE))
  {
    std::cout << "🗑️  Deleting existing " << QUERY_KEYS_FILE << "...\n";
    std::filesystem::remove(QUERY_KEYS_FILE);
  }
}

void updateIndexFile(const std::filesystem::path &serviceDir)
{
  std::filesystem::path indexFile = serviceDir / "index.ts";

  if (!std::filesystem::exists(indexFile))
  {
    std::ofstream createFile(indexFile);
    createFile.close();
  }

  std::ofstream outFile(indexFile, std::ios::trunc);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to open " << indexFile << " for writing.\n";
    return;
  }

  outFile << "export * from './models';\n";

  std::filesystem::path queriesDir = serviceDir / "queries";
  if (std::filesystem::exists(queriesDir) &&
      std::filesystem::is_directory(queriesDir))
  {
    bool hasTsFiles = false;
    for (const auto &entry : std::filesystem::directory_iterator(queriesDir))
    {
      if (entry.path().extension() == ".ts")
      {
        hasTsFiles = true;
        break;
      }
    }
    if (hasTsFiles)
    {
      outFile << "export * from './queries';\n";
    }
  }

  std::filesystem::path mutationsDir = serviceDir / "mutations";
  if (std::filesystem::exists(mutationsDir) &&
      std::filesystem::is_directory(mutationsDir))
  {
    bool hasTsFiles = false;
    for (const auto &entry :
         std::filesystem::directory_iterator(mutationsDir))
    {
      if (entry.path().extension() == ".ts")
      {
        hasTsFiles = true;
        break;
      }
    }
    if (hasTsFiles)
    {
      outFile << "export * from './mutations';\n";
    }
  }

  outFile.close();
  std::cout << "✅ Updated index.ts at: " << indexFile << "\n";
}

bool isSpecialType(std::string type)
{
  type = std::regex_replace(type, std::regex(R"(\[\]$)"), "");

  static const std::regex specialTypePattern(
      R"(^(void|unknown|any|boolean|string|true|false|Object|\{\}|\[\]|0|1|BigInt)$)");

  return std::regex_match(type, specialTypePattern);
}

void generateQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create query file: " << queryFile << "\n";
    return;
  }

  outFile << "import { InvalidateQueryFilters, QueryObserverOptions, QueryObserverResult } from '@tanstack/react-query';\n"
          << "import { useComputed, useObservable } from '@legendapp/state/react';\n"
          << "import { SyncedOptions } from '@legendapp/state/sync';\n"
          << "import { getQueryClient } from '../../queryClient';\n"
          << "import {\n"
          << "  QueryError,\n"
          << "  QueryKeyType,\n"
          << "  UseQueryWithOptionsParams,\n"
          << "  QueryFetchParams,\n"
          << "  queryKeys,\n"
          << "} from '../../models';\n"
          << "import { useQueryWithOptions, syncedQuery } from '../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest)
  {
    outFile << "\ninterface HookParams<TData> extends " << requestType << " {\n"
            << "  options?: UseQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "interface ObservableHookParams<TData, TSelected = TData> {\n"
            << "  params$: " << requestType << ";\n"
            << "  options?: Omit<\n"
            << "    QueryObserverOptions<\n"
            << "      " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    TSelected,\n"
            << "    QueryKeyType\n"
            << "  >,\n"
            << "    'queryFn' | 'queryKey'\n"
            << "  >;\n"
            << "  observableOptions?: Omit<\n"
            << "    SyncedOptions<QueryObserverResult<TData, QueryError>>,\n"
            << "    'get' | 'set' | 'retry'\n"
            << "  >;\n"
            << "}\n\n";

    outFile << "interface QueryFnParams {\n"
            << "  params: " << requestType << ";\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({ params, signal }: QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params, { signal });\n"
            << "  return response;\n"
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ params, signal }),\n"
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ params, signal }),\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";

    outFile << "\n export const invalidate" << toCapitalize(endpointName) << "Query" << servicePrefixHook << " = (\n"
            << "  params: " << requestType << ",\n"
            << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
            << ") => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.invalidateQueries({\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    ...options,\n"
            << "  });\n"
            << "};\n";

    outFile << "\nexport const " << hookName << servicePrefixHook << "Observable" << " = <\n"
            << "  TData = " << responseType << ",\n"
            << "  TSelected = TData,\n"
            << ">({\n"
            << "  params$,\n"
            << "  options,\n"
            << "  observableOptions,\n"
            << "}: ObservableHookParams<TData, TSelected>) => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  const queryKey$ = useComputed(() => getQueryKey(params$));\n"
            << "  return useObservable(\n"
            << "    syncedQuery<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    TSelected,\n"
            << "    QueryKeyType\n"
            << "  >({\n"
            << "    queryClient,\n"
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName << "({ params: params$, signal }),\n"
            << "    queryKey: queryKey$.get(),\n"
            << "    options,\n"
            << "    observableOptions,\n"
            << "  }));\n"
            << "};\n";
  }
  else
  {
    outFile << "\ninterface HookParams<TData> {\n"
            << "  options?: UseQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "interface ObservableHookParams<TData, TSelected = TData> {\n"
            << "  params$: " << requestType << ";\n"
            << "  options?: Omit<\n"
            << "    QueryObserverOptions<\n"
            << "      " << responseType << ",\n"
            << "    QueryError,\n"
            << "    " << responseType << ",\n"
            << "    QueryKeyType\n"
            << "  >,\n"
            << "    'queryFn' | 'queryKey'\n"
            << "  >;\n"
            << "  observableOptions?: Omit<\n"
            << "    SyncedOptions<QueryObserverResult<" << responseType << ", QueryError>>,\n"
            << "    'get' | 'set' | 'retry'\n"
            << "  >;\n"
            << "}\n\n";

    outFile << "interface QueryFnParams {\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({ signal }:QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(undefined, { signal });\n"
            << "  return response;\n"
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ signal }),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "Query" << servicePrefixHook
            << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "}: HookParams<TData>) => {\n"
            << "  return useQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ signal }),\n"
            << "    queryKey: getQueryKey(),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";

    outFile << "\n export const invalidate" << toCapitalize(endpointName) << "Query" << servicePrefixHook << " = (\n"
            << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
            << ") => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.invalidateQueries({\n"
            << "    queryKey: getQueryKey(),\n"
            << "    ...options,\n"
            << "  });\n"
            << "};\n";

    outFile << "\nexport const " << hookName << servicePrefixHook << "Observable" << " = <\n"
            << "  TData = " << responseType << ",\n"
            << "  TSelected = TData,\n"
            << ">({\n"
            << "  params$,\n"
            << "  options,\n"
            << "  observableOptions,\n"
            << "}: ObservableHookParams<TData, TSelected>) => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  const queryKey$ = useComputed(() => getQueryKey(params$));\n"
            << "  return useObservable(\n"
            << "    syncedQuery<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    TSelected,\n"
            << "    QueryKeyType\n"
            << "  >({\n"
            << "    queryClient,\n"
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName << "({ params: params$, signal }),\n"
            << "    queryKey: queryKey$.get(),\n"
            << "    options,\n"
            << "    observableOptions,\n"
            << "  }));\n"
            << "};\n";
  }

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update mutations index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  indexOutFile.close();

  outFile.close();
  std::cout << "✅ Query hook generated: " << queryFile << "\n";
}

void generatePrefetchQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create prefetch query file: " << queryFile
              << "\n";
    return;
  }

  outFile << "import { InvalidateQueryFilters } from '@tanstack/react-query';\n"
          << "import { getQueryClient } from '../../queryClient';\n"
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

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest)
  {
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
            << " = async ({ params, signal }: QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params, { signal });\n"
            << "  return response;\n"
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ params, signal }),\n"
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ params, signal }),\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";

    outFile << "\n export const invalidate" << toCapitalize(endpointName) << "Query" << servicePrefixHook << " = (\n"
            << "  params: " << requestType << ",\n"
            << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
            << ") => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.invalidateQueries({\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    ...options,\n"
            << "  });\n"
            << "};\n";
  }
  else
  {
    outFile << "\ninterface HookParams<TData> {\n"
            << "  options?: UsePrefetchQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "interface QueryFnParams {\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({ signal }:QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(undefined, { signal });\n"
            << "  return response;\n"
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ signal }),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "PrefetchQuery"
            << servicePrefixHook << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "}: HookParams<TData>) => {\n"
            << "  return usePrefetchQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ signal }),\n"
            << "    queryKey: getQueryKey(),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";

    outFile << "\n export const invalidate" << toCapitalize(endpointName) << "Query" << servicePrefixHook << " = (\n"
            << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
            << ") => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.invalidateQueries({\n"
            << "    queryKey: getQueryKey(),\n"
            << "    ...options,\n"
            << "  });\n"
            << "};\n";
  }

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update mutations index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";

  outFile.close();
  std::cout << "✅ Prefetch query hook generated: " << queryFile << "\n";
}

void generateInfiniteQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create infinite query file: " << queryFile
              << "\n";
    return;
  }

  outFile << "import { InvalidateQueryFilters } from '@tanstack/react-query';\n"
          << "import { getQueryClient } from '../../queryClient';\n"
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

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
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
          << "  signal: AbortSignal;\n"
          << "}\n\n";

  outFile << "export const " << endpointName << "QueryFn" << serviceName
          << " = async <TPageParam extends PageParam>({\n"
          << "  params,\n"
          << "  pageParam,\n"
          << "  signal,\n"
          << "}: QueryFnParams<TPageParam>) => {\n"
          << "  const response = await " << serviceName << "." << endpointName
          << "({ ...params, pageParam }, { signal });\n"
          << "  return response;\n"
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
          << "    queryFn: ({ pageParam, signal }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params, signal }),\n"
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
          << "    queryFn: ({ pageParam, signal }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params, signal }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    options,\n"
          << "  });\n"
          << "};\n";

  outFile << "\n export const invalidate" << toCapitalize(endpointName) << "InfiniteQuery" << servicePrefixHook << " = (\n"
          << "  params: " << requestType << ",\n"
          << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
          << ") => {\n"
          << "  const queryClient = getQueryClient();\n\n"
          << "  return queryClient.invalidateQueries({\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    ...options,\n"
          << "  });\n"
          << "};\n";

  outFile << "\nexport const reset" << toCapitalize(endpointName) << "InfiniteQuery" << servicePrefixHook << " = async <TPageParam = PageParam>(\n"
          << "  params: " << requestType << ",\n"
          << "): Promise<void> => {\n"
          << "  const queryClient = getQueryClient();\n"
          << "  const queryKey = getQueryKey(params);\n\n"
          << "  queryClient.setQueryData(\n"
          << "    queryKey,\n"
          << "    (oldData: InfiniteData<" << responseType << "[],\n"
          << "      TPageParam\n"
          << "    >) => {\n"
          << "      if (!oldData) {\n"
          << "        return undefined;\n"
          << "      }\n\n"
          << "      return {\n"
          << "        pages: oldData.pages.slice(0, 1),\n"
          << "        pageParams: oldData.pageParams.slice(0, 1),\n"
          << "      };\n"
          << "    },\n"
          << "  );\n\n"

          << "  await queryClient.invalidateQueries({\n"
          << "    queryKey: getQueryKey(params),\n"
          << "  });\n"
          << "};\n";

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update mutations index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";

  outFile.close();
  std::cout << "✅ Infinite query hook generated: " << queryFile << "\n";
}

void generatePrefetchInfiniteQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{

  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create prefetch infinite query file: "
              << queryFile << "\n";
    return;
  }

  outFile
      << "import { InvalidateQueryFilters } from '@tanstack/react-query';\n"
      << "import { getQueryClient } from '../../queryClient';\n"
      << "import {\n"
      << "  FetchInfiniteQueryOptions,\n"
      << "  GetNextPageParamFunction,\n"
      << "  InfiniteData,\n"
      << "} from '@tanstack/react-query';\n"
      << "import { QueryError, QueryKeyType, PrefetchInfiniteQueryFetchParams, queryKeys } from "
         "'../../models';\n"
      << "import { usePrefetchInfiniteQueryWithOptions } from "
         "'../../hooks';\n"
      << "import { " << serviceName << " } from '../" << serviceName
      << "';\n\n";

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
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
          << "      TData,\n"
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
          << "  getNextPageParam: PrefetchInfiniteQueryFetchParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    InfiniteData<TData, TPageParam>,\n"
          << "    " << requestType << ",\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['getNextPageParam'];\n"
          << "  options?: PrefetchInfiniteQueryFetchParams<\n"
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
          << "  signal: AbortSignal;\n"
          << "}\n\n";

  outFile << "export const " << endpointName << "QueryFn" << serviceName
          << " = async <TPageParam extends PageParam>({\n"
          << "  params,\n"
          << "  pageParam,\n"
          << "  signal,\n"
          << "}: QueryFnParams<TPageParam>) => {\n"
          << "  const response = await " << serviceName << "." << endpointName
          << "({ ...params, pageParam }, { signal });\n"
          << "  return response;\n"
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
          << "    queryFn: ({ pageParam, signal }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params, signal }),\n"
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
          << "    queryFn: ({ pageParam, signal }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params, signal }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    options,\n"
          << "  });\n"
          << "};\n";

  outFile << "\n export const invalidate" << toCapitalize(endpointName) << "InfiniteQuery" << servicePrefixHook << " = (\n"
          << "  params: " << requestType << ",\n"
          << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
          << ") => {\n"
          << "  const queryClient = getQueryClient();\n\n"
          << "  return queryClient.invalidateQueries({\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    ...options,\n"
          << "  });\n"
          << "};\n";

  outFile << "\nexport const reset" << toCapitalize(endpointName) << "InfiniteQuery" << servicePrefixHook << " = async <TPageParam = PageParam>(\n"
          << "  params: " << requestType << ",\n"
          << "): Promise<void> => {\n"
          << "  const queryClient = getQueryClient();\n"
          << "  const queryKey = getQueryKey(params);\n\n"
          << "  queryClient.setQueryData(\n"
          << "    queryKey,\n"
          << "    (oldData: InfiniteData<" << responseType << "[],\n"
          << "      TPageParam\n"
          << "    >) => {\n"
          << "      if (!oldData) {\n"
          << "        return undefined;\n"
          << "      }\n\n"
          << "      return {\n"
          << "        pages: oldData.pages.slice(0, 1),\n"
          << "        pageParams: oldData.pageParams.slice(0, 1),\n"
          << "      };\n"
          << "    },\n"
          << "  );\n\n"

          << "  await queryClient.invalidateQueries({\n"
          << "    queryKey: getQueryKey(params),\n"
          << "  });\n"
          << "};\n";

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update mutations index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  outFile.close();
  std::cout << "✅ Prefetch infinite query hook generated: " << queryFile
            << "\n";
}

void generateMutationHook(const std::filesystem::path &hooksDir,
                          const std::string &hookName,
                          const std::string &responseType,
                          const std::string &requestType,
                          const std::string &queryKeyName,
                          const std::string &serviceName,
                          const std::string &endpointName,
                          const std::string &servicePrefix, bool isVoidRequest,
                          const std::string &servicePrefixHook)
{

  std::filesystem::path mutationFile =
      hooksDir / "mutations" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(mutationFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create mutation hook file: "
              << mutationFile << "\n";
    return;
  }

  std::string inlineResponseType = responseType;
  std::string inlineRequestType = requestType;

  outFile << "import { useMutation } from '@tanstack/react-query';\n"
          << "import { QueryError, queryKeys } from '../../models';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isVoidRequest && requestType != "void" && requestType.find("void") == std::string::npos)
  {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (responseType != "void" && responseType.find("void") == std::string::npos)
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest)
  {
    outFile << "\nexport const " << endpointName << "MutationFn" << serviceName
            << " = async (params: " << inlineRequestType << ") => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params);\n"
            << "  return response;\n"
            << "};\n\n";

    outFile << "const getMutationKey = () => queryKeys." << queryKeyName
            << "();\n\n";

    outFile << "export const " << hookName << "Mutation" << servicePrefixHook
            << " = () => {\n"
            << "  return useMutation<" << inlineResponseType << ", QueryError, "
            << inlineRequestType << ">({\n"
            << "    mutationFn: " << endpointName << "MutationFn" << serviceName
            << ",\n"
            << "    mutationKey: getMutationKey(),\n"
            << "  });\n"
            << "};\n";
  }
  else
  {
    outFile << "\nexport const " << endpointName << "MutationFn" << serviceName
            << " = async () => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "();\n"
            << "  return response?.data;\n"
            << "};\n\n";

    outFile << "const getMutationKey = () => queryKeys." << queryKeyName
            << "();\n\n";

    outFile << "export const " << hookName << "Mutation" << servicePrefixHook
            << " = () => {\n"
            << "  return useMutation<" << inlineResponseType
            << ", QueryError, void>({\n"
            << "    mutationFn: " << endpointName << "MutationFn" << serviceName
            << ",\n"
            << "    mutationKey: getMutationKey(),\n"
            << "  });\n"
            << "};\n";
  }

  std::filesystem::path indexFile = hooksDir / "mutations" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update mutations index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  indexOutFile.close();

  std::cout << "✅ Mutation hook generated: " << mutationFile << "\n";
}

void generateSuspenseQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{
  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create suspense query file: " << queryFile << "\n";
    return;
  }

  outFile << "import { InvalidateQueryFilters } from '@tanstack/react-query';\n"
          << "import { getQueryClient } from '../../queryClient';\n"
          << "import {\n"
          << "  QueryError,\n"
          << "  QueryKeyType,\n"
          << "  UseSuspenseQueryWithOptionsParams,\n"
          << "  QueryFetchParams,\n"
          << "  queryKeys,\n"
          << "} from '../../models';\n"
          << "import { useSuspenseQueryWithOptions } from '../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest)
  {
    outFile << "\ninterface HookParams<TData> extends " << requestType << " {\n"
            << "  options?: UseSuspenseQueryWithOptionsParams<\n"
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
            << " = async ({ params, signal }: QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params, { signal });\n"
            << "  return response;\n"
            << "};\n\n";

    outFile << "const getQueryKey = (params: " << requestType
            << ") => queryKeys." << queryKeyName << "(params);\n\n";

    outFile << "export const " << endpointName << "SuspenseQuery" << servicePrefixHook
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ params, signal }),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "SuspenseQuery" << servicePrefixHook
            << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "  ...params\n"
            << "}: HookParams<TData>) => {\n"
            << "  return useSuspenseQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ params, signal }),\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  }
  else
  {
    outFile << "\ninterface HookParams<TData> {\n"
            << "  options?: UseSuspenseQueryWithOptionsParams<\n"
            << "    " << responseType << ",\n"
            << "    QueryError,\n"
            << "    TData,\n"
            << "    QueryKeyType\n"
            << "  >['options'];\n"
            << "}\n\n";

    outFile << "interface QueryFnParams {\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({ signal }:QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(undefined, { signal });\n"
            << "  return response;\n"
            << "};\n\n";

    outFile << "const getQueryKey = () => queryKeys." << queryKeyName
            << "();\n\n";

    outFile << "export const " << endpointName << "SuspenseQuery" << servicePrefixHook
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
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ signal }),\n"
            << "    ...fetchOptions,\n"
            << "  });\n"
            << "};\n\n";

    outFile << "export const " << hookName << "SuspenseQuery" << servicePrefixHook
            << " = <TData = " << responseType << ">({\n"
            << "  options,\n"
            << "}: HookParams<TData>) => {\n"
            << "  return useSuspenseQueryWithOptions<" << responseType
            << ", QueryError, TData, QueryKeyType>({\n"
            << "    queryFn: ({ signal }) => " << endpointName << "QueryFn" << serviceName
            << "({ signal }),\n"
            << "    queryKey: getQueryKey(),\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  }

  // Add invalidate function
  if (!isVoidRequest)
  {
    outFile << "\nexport const invalidate" << capitalizeFirstLetter(endpointName)
            << "SuspenseQuery" << servicePrefixHook << " = (\n"
            << "  params: " << requestType << ",\n"
            << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
            << ") => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.invalidateQueries({\n"
            << "    queryKey: getQueryKey(params),\n"
            << "    ...options,\n"
            << "  });\n"
            << "};\n";
  }
  else
  {
    outFile << "\nexport const invalidate" << capitalizeFirstLetter(endpointName)
            << "SuspenseQuery" << servicePrefixHook << " = (\n"
            << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
            << ") => {\n"
            << "  const queryClient = getQueryClient();\n\n"
            << "  return queryClient.invalidateQueries({\n"
            << "    queryKey: getQueryKey(),\n"
            << "    ...options,\n"
            << "  });\n"
            << "};\n";
  }

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update queries index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  indexOutFile.close();

  outFile.close();
  std::cout << "✅ Suspense query hook generated: " << queryFile << "\n";
}

void generateSuspenseInfiniteQueryHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{
  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create suspense infinite query file: " << queryFile
              << "\n";
    return;
  }

  outFile << "import { InfiniteData, InvalidateQueryFilters } from '@tanstack/react-query';\n"
          << "import { getQueryClient } from '../../queryClient';\n"
          << "import {\n"
          << "  InfiniteQueryFetchParams,\n"
          << "  QueryError,\n"
          << "  QueryKeyType,\n"
          << "  UseSuspenseInfiniteQueryWithOptionsParams,\n"
          << "  queryKeys,\n"
          << "} from '../../models';\n"
          << "import { useSuspenseInfiniteQueryWithOptions } from '../../hooks';\n"
          << "import { " << serviceName << " } from '../" << serviceName
          << "';\n\n";

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  outFile << "\ntype PageParam = string | number | unknown;\n\n";

  outFile << "interface InfiniteHookParams<TData, TPageParam = PageParam> "
             "extends "
          << requestType << " {\n"
          << "  initialPageParam: TPageParam;\n"
          << "  getNextPageParam: UseSuspenseInfiniteQueryWithOptionsParams<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    TData,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >['getNextPageParam'];\n"
          << "  options?: UseSuspenseInfiniteQueryWithOptionsParams<\n"
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
          << "  signal: AbortSignal;\n"
          << "}\n\n";

  outFile << "export const " << endpointName << "QueryFn" << serviceName
          << " = async <TPageParam extends PageParam>({\n"
          << "  params,\n"
          << "  pageParam,\n"
          << "  signal,\n"
          << "}: QueryFnParams<TPageParam>) => {\n"
          << "  const response = await " << serviceName << "." << endpointName
          << "({ ...params, pageParam }, { signal });\n"
          << "  return response;\n"
          << "};\n\n";

  outFile << "const getQueryKey = (params: " << requestType << ") => queryKeys."
          << queryKeyName << "(params);\n\n";

  outFile << "export const " << endpointName << "SuspenseInfiniteQuery"
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
          << "    queryFn: ({ pageParam, signal }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params, signal }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    ...options,\n"
          << "  });\n"
          << "};\n\n";

  outFile << "export const " << hookName << "SuspenseInfiniteQuery" << servicePrefixHook
          << " = <\n"
          << "  TData = " << responseType << ",\n"
          << "  TPageParam = PageParam,\n"
          << ">({\n"
          << "  options,\n"
          << "  initialPageParam,\n"
          << "  getNextPageParam,\n"
          << "  ...params\n"
          << "}: InfiniteHookParams<TData, TPageParam>) => {\n"
          << "  return useSuspenseInfiniteQueryWithOptions<\n"
          << "    " << responseType << ",\n"
          << "    QueryError,\n"
          << "    TData,\n"
          << "    QueryKeyType,\n"
          << "    TPageParam\n"
          << "  >({\n"
          << "    queryFn: ({ pageParam, signal }) => " << endpointName << "QueryFn"
          << serviceName << "({ pageParam, params, signal }),\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    initialPageParam,\n"
          << "    getNextPageParam,\n"
          << "    options,\n"
          << "  });\n"
          << "};\n";

  // Add invalidate function
  outFile << "\nexport const invalidate" << capitalizeFirstLetter(endpointName)
          << "SuspenseInfiniteQuery" << servicePrefixHook << " = (\n"
          << "  params: " << requestType << ",\n"
          << "  options?: Omit<InvalidateQueryFilters, 'queryKey'>\n"
          << ") => {\n"
          << "  const queryClient = getQueryClient();\n\n"
          << "  return queryClient.invalidateQueries({\n"
          << "    queryKey: getQueryKey(params),\n"
          << "    ...options,\n"
          << "  });\n"
          << "};\n";

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update queries index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  indexOutFile.close();

  outFile.close();
  std::cout << "✅ Suspense infinite query hook generated: " << queryFile << "\n";
}

void generateQueriesHook(
    const std::filesystem::path &hooksDir, const std::string &hookName,
    const std::string &responseType, const std::string &requestType,
    const std::string &queryKeyName, const std::string &serviceName,
    const std::string &endpointName, const std::string &servicePrefix,
    bool isVoidRequest, const std::string &servicePrefixHook)
{
  std::filesystem::path queryFile =
      hooksDir / "queries" / (hookName + "." + servicePrefix + ".ts");

  std::ofstream outFile(queryFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create queries hook file: " << queryFile
              << "\n";
    return;
  }

  outFile
      << "import {\n"
      << "  QueryKeyType,\n"
      << "  UseQueriesWithOptionsParams,\n"
      << "  queryKeys,\n"
      << "} from '../../models';\n"
      << "import { useQueriesWithOptions } from '../../hooks';\n"
      << "import { " << serviceName << " } from '../" << serviceName
      << "';\n\n";

  if (!isSpecialType(responseType))
  {
    outFile << "import { " << normalizeType(responseType) << " } from '../models';\n";
  }

  if (!isVoidRequest && !isSpecialType(requestType))
  {
    outFile << "import { " << normalizeType(requestType) << " } from '../models';\n";
  }

  if (!isVoidRequest)
  {
    outFile << "\ninterface QueryFnParams {\n"
            << "  params: " << requestType << ";\n"
            << "  meta?: Record<string, unknown> | undefined;\n"
            << "  queryKey?: QueryKeyType;\n"
            << "  signal?: AbortSignal;\n"
            << "}\n\n";

    outFile << "export const " << endpointName << "QueryFn" << serviceName
            << " = async ({\n"
            << "  params,\n"
            << "  signal,\n"
            << "}: QueryFnParams) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(params, { signal });\n\n"
            << "  return response;\n"
            << "};\n\n";

    outFile << "const getQueryKey = (params: " << requestType << ") => queryKeys."
            << endpointName << serviceName << "(params);\n\n";

    outFile << "interface HookParams {\n"
            << "  params: " << requestType << "[];\n"
            << "  options?: UseQueriesWithOptionsParams<Array<{\n"
            << "    queryKey: QueryKeyType;\n"
            << "    queryFn: () => Promise<" << responseType << ">;\n"
            << "  }>>['options'];\n"
            << "}\n\n";

    outFile << "export const " << hookName << "Queries" << servicePrefixHook
            << " = ({\n"
            << "  params,\n"
            << "  options,\n"
            << "}: HookParams) => {\n"
            << "  const queries = params.map((param) => ({\n"
            << "    queryKey: getQueryKey(param),\n"
            << "    queryFn: ({ signal }: { signal?: AbortSignal }) => " << endpointName << "QueryFn" << serviceName << "({ params: param, signal }),\n"
            << "  }));\n\n"
            << "  return useQueriesWithOptions({\n"
            << "    queries,\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  }
  else
  {
    outFile << "\nexport const " << endpointName << "QueryFn" << serviceName
            << " = async ({ signal }: { signal?: AbortSignal }) => {\n"
            << "  const response = await " << serviceName << "." << endpointName
            << "(undefined, { signal });\n\n"
            << "  return response;\n"
            << "};\n\n";

    outFile << "const getQueryKey = () => queryKeys."
            << endpointName << serviceName << "();\n\n";

    outFile << "interface HookParams {\n"
            << "  count: number;\n"
            << "  options?: UseQueriesWithOptionsParams<Array<{\n"
            << "    queryKey: QueryKeyType;\n"
            << "    queryFn: () => Promise<" << responseType << ">;\n"
            << "  }>>['options'];\n"
            << "}\n\n";

    outFile << "export const " << hookName << "Queries" << servicePrefixHook
            << " = ({\n"
            << "  count,\n"
            << "  options,\n"
            << "}: HookParams) => {\n"
            << "  const queries = Array.from({ length: count }, (_, index) => ({\n"
            << "    queryKey: [...getQueryKey(), index],\n"
            << "    queryFn: ({ signal }: { signal?: AbortSignal }) => " << endpointName << "QueryFn" << serviceName << "({ signal }),\n"
            << "  }));\n\n"
            << "  return useQueriesWithOptions({\n"
            << "    queries,\n"
            << "    options,\n"
            << "  });\n"
            << "};\n";
  }

  std::filesystem::path indexFile = hooksDir / "queries" / "index.ts";
  std::ofstream indexOutFile(indexFile, std::ios::app);
  if (!indexOutFile.is_open())
  {
    std::cerr << "❌ Error: Unable to update queries index file: "
              << indexFile << "\n";
    return;
  }

  indexOutFile << "export * from './" << hookName << "." << servicePrefix
               << "';\n";
  indexOutFile.close();

  outFile.close();
  std::cout << "✅ Queries hook generated: " << queryFile << "\n";
}

void removeEmptyFolders(const std::filesystem::path &serviceDir)
{
  std::filesystem::path queriesDir = serviceDir / "queries";
  std::filesystem::path mutationsDir = serviceDir / "mutations";
  std::filesystem::path queryKeysFile = serviceDir / "QueryKeys.ts";

  if (std::filesystem::exists(queriesDir) && std::filesystem::is_empty(queriesDir))
  {
    std::filesystem::remove_all(queriesDir);
    std::cout << "🗑️ Removed empty queries folder.\n";
  }

  if (std::filesystem::exists(mutationsDir) && std::filesystem::is_empty(mutationsDir))
  {
    std::filesystem::remove_all(mutationsDir);
    std::cout << "🗑️ Removed empty mutations folder.\n";
  }

  if (std::filesystem::exists(queryKeysFile))
  {
    std::filesystem::remove(queryKeysFile);
    std::cout << "🗑️ Removed unused QueryKeys.ts.\n";
  }
}

void generateHooks(const std::string &serviceName,
                   const std::filesystem::path &serviceFile,
                   const std::filesystem::path &hooksDir)
{

  std::string fileExtension = "." + toSnakeCase(serviceName) + ".ts";

  std::filesystem::create_directories(hooksDir / "queries");
  std::filesystem::create_directories(hooksDir / "mutations");

  std::string fileContent = readFileContent(serviceFile);
  if (fileContent.empty())
  {
    return;
  }

  // First, find the interface that defines the API
  std::regex createApiPattern(R"(createApi<([a-zA-Z0-9_]+)>\(\))");
  std::smatch createApiMatch;

  if (!std::regex_search(fileContent, createApiMatch, createApiPattern))
  {
    return; // No createApi found
  }

  std::string interfaceName = createApiMatch[1].str();

  // Find the interface definition
  std::regex interfacePattern(
      R"(interface\s+)" + interfaceName + R"(\s*\{([^}]+)\})");
  std::smatch interfaceMatch;

  if (!std::regex_search(fileContent, interfaceMatch, interfacePattern))
  {
    return; // Interface not found
  }

  std::string interfaceContent = interfaceMatch[1].str();

  // Extract endpoint definitions from interface
  std::regex endpointDefPattern(
      R"(([a-zA-Z0-9_]+):\s*Promisify<([^,]+),\s*([^>]+)>)");

  std::sregex_iterator interfaceIter(interfaceContent.begin(), interfaceContent.end(), endpointDefPattern);
  std::sregex_iterator interfaceEnd;

  std::unordered_set<std::string> detectedQueries;
  std::unordered_set<std::string> detectedMutations;

  bool hasQueries = false;
  bool hasMutations = false;

  for (; interfaceIter != interfaceEnd; ++interfaceIter)
  {
    std::smatch match = *interfaceIter;

    std::string endpointName = match[1].str();
    std::string requestType = match[2].str();
    std::string responseType = match[3].str();

    // Clean up whitespace
    requestType.erase(
        remove_if(requestType.begin(), requestType.end(), ::isspace),
        requestType.end());
    responseType.erase(
        remove_if(responseType.begin(), responseType.end(), ::isspace),
        responseType.end());

    std::string hookName = "use" + capitalizeFirstLetter(endpointName);
    std::string servicePrefix = toSnakeCase(extractServicePrefix(serviceName));
    std::string queryKeyName = toCamelCase(endpointName) + toCapitalize(serviceName);

    bool isVoidRequest = requestType == "void";

    // Check what method type this endpoint uses
    std::regex mutationPattern(endpointName + R"(:\s*builder\.mutation\s*\()");
    std::regex queryPattern(endpointName + R"(:\s*builder\.query\s*\()");
    std::regex infiniteQueryPattern(endpointName + R"(:\s*builder\.infiniteQuery\s*\()");
    std::regex prefetchPattern(endpointName + R"(:\s*builder\.prefetch\s*\()");
    std::regex prefetchInfiniteQueryPattern(endpointName + R"(:\s*builder\.prefetchInfiniteQuery\s*\()");
    std::regex suspenseQueryPattern(endpointName + R"(:\s*builder\.suspenseQuery\s*\()");
    std::regex suspenseInfiniteQueryPattern(endpointName + R"(:\s*builder\.suspenseInfiniteQuery\s*\()");
    std::regex queriesPattern(endpointName + R"(:\s*builder\.queries\s*\()");

    bool isMutation = std::regex_search(fileContent, mutationPattern);
    bool isQuery = std::regex_search(fileContent, queryPattern);
    bool isInfiniteQuery = std::regex_search(fileContent, infiniteQueryPattern);
    bool isPrefetch = std::regex_search(fileContent, prefetchPattern);
    bool isPrefetchInfiniteQuery = std::regex_search(fileContent, prefetchInfiniteQueryPattern);
    bool isSuspenseQuery = std::regex_search(fileContent, suspenseQueryPattern);
    bool isSuspenseInfiniteQuery = std::regex_search(fileContent, suspenseInfiniteQueryPattern);
    bool isQueries = std::regex_search(fileContent, queriesPattern);

    if (isMutation)
    {
      hasMutations = true;
      generateMutationHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedMutations.insert(hookName);
    }
    else if (isQuery)
    {
      hasQueries = true;
      generateQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else if (isInfiniteQuery)
    {
      hasQueries = true;
      generateInfiniteQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else if (isPrefetch)
    {
      hasQueries = true;
      generatePrefetchQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else if (isPrefetchInfiniteQuery)
    {
      hasQueries = true;
      generatePrefetchInfiniteQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else if (isSuspenseQuery)
    {
      hasQueries = true;
      generateSuspenseQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else if (isSuspenseInfiniteQuery)
    {
      hasQueries = true;
      generateSuspenseInfiniteQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else if (isQueries)
    {
      hasQueries = true;
      generateQueriesHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
    else
    {
      hasQueries = true;
      generateQueryHook(hooksDir, hookName, responseType, requestType, queryKeyName, serviceName, endpointName, servicePrefix, isVoidRequest, serviceName);
      detectedQueries.insert(hookName);
    }
  }

  if (detectedQueries.empty())
  {
    std::filesystem::remove_all(hooksDir / "queries");
    std::cout << "🗑️ Removed empty queries folder.\n";
  }
  if (detectedMutations.empty())
  {
    std::filesystem::remove_all(hooksDir / "mutations");
    std::cout << "🗑️ Removed empty mutations folder.\n";
  }

  updateIndexFile(hooksDir);
}

void removeGeneratedFiles(const std::filesystem::path &serviceDir)
{
  std::filesystem::path queriesDir = serviceDir / "queries";
  std::filesystem::path mutationsDir = serviceDir / "mutations";

  if (std::filesystem::exists(queriesDir))
  {
    std::filesystem::remove_all(queriesDir);
    std::cout << "🗑️ Removed old queries folder.\n";
  }

  if (std::filesystem::exists(mutationsDir))
  {
    std::filesystem::remove_all(mutationsDir);
    std::cout << "🗑️ Removed old mutations folder.\n";
  }
}

int main()
{
  const std::filesystem::path apiDir = "./src/shared/api";
  const std::unordered_set<std::string> excludedFolders = {"models"};

  std::cout << "\n🔍 Initializing API hooks generation...\n"
            << "📂 Searching for services in: " << apiDir << "\n";

  for (const auto &entry :
       std::filesystem::recursive_directory_iterator(apiDir))
  {
    if (entry.is_regular_file() && entry.path().extension() == ".ts" &&
        entry.path().filename().string().find("Service") != std::string::npos)
    {

      std::filesystem::path serviceDir = entry.path().parent_path();
      std::string serviceName = entry.path().stem().string();
      std::string folderName = serviceDir.filename().string();

      if (isExcludedFolder(folderName, excludedFolders))
      {
        std::cout << "⚠️  Skipping excluded folder: " << serviceDir << "\n";
        continue;
      }

      std::cout << "🗑️ Removing old generated files...\n";
      removeGeneratedFiles(serviceDir);

      std::cout << "🛠️  Generating hooks for: " << serviceName << "\n";
      generateHooks(serviceName, entry.path(), serviceDir);
    }
  }

  std::cout << "\n✅ All hooks generated successfully!\n";
  return 0;
}
