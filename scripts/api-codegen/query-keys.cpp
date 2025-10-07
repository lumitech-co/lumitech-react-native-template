#include <algorithm>
#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <unordered_set>
#include <vector>
#include <filesystem>

const std::filesystem::path API_DIR = std::filesystem::current_path() / "src/shared/api";
const std::string MODELS_SUBDIR = "models";
const std::unordered_set<std::string> EXCLUDED_FOLDERS = {"models"};

std::string toSnakeCase(const std::string &input)
{
  std::string result;
  for (size_t i = 0; i < input.length(); i++)
  {
    if (std::isupper(input[i]) && i > 0)
    {
      result += "_";
    }
    result += std::toupper(input[i]);
  }
  return result;
}

std::string toPascalCase(const std::string &input)
{
  std::stringstream ss(input);
  std::string word, result;

  while (std::getline(ss, word, '_'))
  {
    word[0] = std::toupper(word[0]);
    result += word;
  }

  return result;
}

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

std::string readFileContent(const std::filesystem::path &filePath)
{
  std::ifstream file(filePath);
  if (!file.is_open())
  {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    return "";
  }
  std::stringstream buffer;
  buffer << file.rdbuf();
  return buffer.str();
}

void extractEndpoints(
    const std::string &fileContent,
    std::vector<std::string> &usedInterfaces,
    std::vector<std::pair<std::string, std::string>> &queryEndpoints,
    std::vector<std::string> &mutationEndpoints)
{

  std::regex createApiPattern(R"(createApi<([a-zA-Z0-9_]+)>\(\))");
  std::smatch createApiMatch;

  if (!std::regex_search(fileContent, createApiMatch, createApiPattern))
  {
    return;
  }

  std::string interfaceName = createApiMatch[1].str();

  std::regex interfacePattern(
      R"(interface\s+)" + interfaceName + R"(\s*\{([^}]+)\})");
  std::smatch interfaceMatch;

  if (!std::regex_search(fileContent, interfaceMatch, interfacePattern))
  {
    return;
  }

  std::string interfaceContent = interfaceMatch[1].str();

  std::regex endpointDefPattern(
      R"(([a-zA-Z0-9_]+):\s*Promisify<([^,]+),\s*([^>]+)>)");

  std::sregex_iterator iter(interfaceContent.begin(), interfaceContent.end(), endpointDefPattern);
  std::sregex_iterator end;

  while (iter != end)
  {
    std::smatch match = *iter;
    std::string endpointName = match[1].str();
    std::string requestType = match[2].str();
    std::string responseType = match[3].str();

    requestType.erase(
        remove_if(requestType.begin(), requestType.end(), ::isspace),
        requestType.end());
    responseType.erase(
        remove_if(responseType.begin(), responseType.end(), ::isspace),
        responseType.end());

    std::regex mutationPattern(endpointName + R"(:\s*builder\.mutation\s*\()");
    bool isMutation = std::regex_search(fileContent, mutationPattern);

    if (!isMutation && !requestType.empty() && requestType != "void" &&
        requestType != "unknown" && requestType != "null" &&
        requestType != "any" && requestType != "boolean" &&
        requestType != "string" && requestType != "true" &&
        requestType != "false" && requestType != "Object" &&
        requestType != "{}" && requestType != "0" && requestType != "1" &&
        requestType != "BigInt" && requestType != "[]")
    {
      if (std::find(usedInterfaces.begin(), usedInterfaces.end(), requestType) == usedInterfaces.end())
      {
        usedInterfaces.push_back(requestType);
      }
    }

    if (isMutation)
    {
      mutationEndpoints.push_back(endpointName);
    }
    else
    {
      queryEndpoints.push_back({endpointName, requestType});
    }

    ++iter;
  }
}

void generateQueryKeys(const std::filesystem::path &serviceFile)
{
  std::filesystem::path serviceDir = serviceFile.parent_path();
  std::filesystem::path queryKeysFile = serviceDir / "QueryKeys.ts";
  std::string servicePrefix = serviceDir.filename().string();
  std::string servicePrefixSnakeCase = toSnakeCase(servicePrefix);
  std::string servicePrefixPascalCase = toPascalCase(servicePrefix);

  std::vector<std::string> usedInterfaces;
  std::vector<std::pair<std::string, std::string>> queryEndpoints;
  std::vector<std::string> mutationEndpoints;

  std::cout << "⏳ Processing service file: " << serviceFile << "\n";

  std::string fileContent = readFileContent(serviceFile);
  extractEndpoints(fileContent, usedInterfaces, queryEndpoints, mutationEndpoints);

  std::ofstream outFile(queryKeysFile);
  if (!outFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create QueryKeys.ts at: " << queryKeysFile << "\n";
    return;
  }

  if (!usedInterfaces.empty())
  {
    outFile << "import { ";
    for (size_t i = 0; i < usedInterfaces.size(); i++)
    {
      if (i > 0)
        outFile << ", ";
      outFile << usedInterfaces[i];
    }
    outFile << " } from './models';\n\n";
  }
  else
  {
    outFile << "// No imports required from models.\n";
  }

  outFile << "const QUERY_KEYS = {\n";
  for (const auto &[endpoint, requestType] : queryEndpoints)
  {
    std::string keyName = toSnakeCase(endpoint) + "_" + servicePrefixSnakeCase + "_SERVICE";
    outFile << "  " << keyName << ": '" << keyName << "',\n";
  }
  for (const auto &endpoint : mutationEndpoints)
  {
    std::string keyName = toSnakeCase(endpoint) + "_" + servicePrefixSnakeCase + "_SERVICE";
    outFile << "  " << keyName << ": '" << keyName << "',\n";
  }
  outFile << "} as const;\n\n";

  outFile << "export const " << servicePrefixSnakeCase << "_QUERY_KEYS = {\n";
  for (const auto &[endpoint, requestType] : queryEndpoints)
  {
    std::string queryKeyName = toCamelCase(endpoint) + servicePrefixPascalCase + "Service";
    std::string keyName = toSnakeCase(endpoint) + "_" + servicePrefixSnakeCase + "_SERVICE";

    if (requestType == "void")
    {
      outFile << "  " << queryKeyName << ": () => [QUERY_KEYS." << keyName
              << "] as const,\n";
    }
    else
    {
      outFile << "  " << queryKeyName << ": (params: " << requestType
              << ") => [QUERY_KEYS." << keyName << ", params] as const,\n";
    }
  }
  for (const auto &endpoint : mutationEndpoints)
  {
    std::string queryKeyName = toCamelCase(endpoint) + servicePrefixPascalCase + "Service";
    std::string keyName = toSnakeCase(endpoint) + "_" + servicePrefixSnakeCase + "_SERVICE";
    outFile << "  " << queryKeyName << ": () => [QUERY_KEYS." << keyName
            << "] as const,\n";
  }
  outFile << "};\n";

  std::cout << "✅ QueryKeys generated at: " << queryKeysFile << "\n";
}

int main()
{
  std::cout << "\n🔍 Initializing QueryKeys generation...\n";
  std::cout << "📂 Searching for services in: " << API_DIR << "\n\n";

  if (!std::filesystem::exists(API_DIR) || !std::filesystem::is_directory(API_DIR))
  {
    std::cerr << "❌ Error: API directory does not exist: " << API_DIR << "\n";
    return 1;
  }

  for (const auto &dirEntry : std::filesystem::recursive_directory_iterator(API_DIR))
  {
    const auto &serviceFile = dirEntry.path();

    if (std::filesystem::is_regular_file(serviceFile) &&
        serviceFile.filename().string().find("Service.ts") != std::string::npos)
    {
      if (EXCLUDED_FOLDERS.find(serviceFile.parent_path().filename().string()) != EXCLUDED_FOLDERS.end())
      {
        std::cout << "⚠️ Skipping folder: " << serviceFile.parent_path() << "\n";
        continue;
      }

      std::cout << "🛠️  Generating QueryKeys for service file: " << serviceFile << "\n";
      generateQueryKeys(serviceFile);
    }
  }

  std::cout << "\n✅ All QueryKeys files generated successfully!\n";
  return 0;
}
