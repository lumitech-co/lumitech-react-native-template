#include <algorithm>
#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <vector>
#include <filesystem>

const std::filesystem::path API_PATH =
    std::filesystem::current_path() / "src/shared/api";
const std::vector<std::string> EXCLUDED_FOLDERS = {"models"};
bool ERROR_FOUND = false;

bool isExcludedFolder(const std::filesystem::path &folderPath) {
  return std::find(EXCLUDED_FOLDERS.begin(), EXCLUDED_FOLDERS.end(),
                   folderPath.filename()) != EXCLUDED_FOLDERS.end();
}

std::string toLowerCase(const std::string &str) {
  std::string lower = str;
  std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
  return lower;
}

bool validateServiceFileName(const std::filesystem::path &filePath) {
  std::string folderName = filePath.parent_path().filename().string();
  std::string expectedFileName = toLowerCase(folderName) + "service.ts";
  std::string actualFileName = toLowerCase(filePath.filename().string());

  if (actualFileName != expectedFileName) {
    std::cerr << "❌ Error: File '" << filePath
              << "' does not match expected naming convention. Expected: '"
              << expectedFileName << "'\n";
    ERROR_FOUND = true;
    return false;
  }
  return true;
}

std::string readFileContent(const std::filesystem::path &filePath) {
  std::ifstream file(filePath);
  if (!file.is_open()) {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    ERROR_FOUND = true;
    return "";
  }
  std::stringstream buffer;
  buffer << file.rdbuf();
  return buffer.str();
}

void validateEndpoints(const std::filesystem::path &filePath,
                       const std::string &fileContent) {
  std::regex endpointsBlockPattern(
      R"(endpoints:\s*builder\s*=>\s*\(\{[^}]+\}\))");
  std::regex endpointPattern(
      R"(([a-zA-Z0-9_]+):\s*builder\.(get|getAsPrefetch|getAsMutation|post|postAsQuery|delete|put|patch|paginate|paginateAsPrefetch)\s*(<[^>]+>)?\s*\()");

  std::smatch endpointsMatch;
  if (!std::regex_search(fileContent, endpointsMatch, endpointsBlockPattern)) {
    std::cout << "⚠️ No endpoints found in file: " << filePath << "\n";
    return;
  }

  std::sregex_iterator iter(fileContent.begin(), fileContent.end(),
                            endpointPattern);
  std::sregex_iterator end;

  if (iter == end) {
    std::cout << "⚠️ No endpoints found in file: " << filePath << "\n";
    return;
  }

  while (iter != end) {
    std::smatch match = *iter;
    std::string endpointName = match[1].str();
    std::string generics = match[3].str();

    if (generics.empty()) {
      std::cerr << "❌ Error: Endpoint '" << endpointName << "' in file '"
                << filePath << "' is missing generics (no < >).\n";
      ERROR_FOUND = true;
    } else {
      std::regex genericSplitPattern(R"(<([^,>]+),([^,>]+)>)");
      std::smatch genericsMatch;
      if (!std::regex_match(generics, genericsMatch, genericSplitPattern)) {
        std::cerr << "❌ Error: Endpoint '" << endpointName << "' in file '"
                  << filePath
                  << "' has incorrect generics format (missing a comma or "
                     "second generic).\n";
        ERROR_FOUND = true;
      }
    }
    ++iter;
  }
}

int main() {
  std::cout << "\n🔍 Initializing generics check...\n";
  std::cout << "📂 Searching for service files in: " << API_PATH << "\n\n";

  try {
    if (!std::filesystem::exists(API_PATH) ||
        !std::filesystem::is_directory(API_PATH)) {
      std::cerr << "❌ Error: Directory does not exist: " << API_PATH << "\n";
      return 1;
    }

    for (const auto &dirEntry :
         std::filesystem::recursive_directory_iterator(API_PATH)) {
      const auto &path = dirEntry.path();

      if (std::filesystem::is_directory(path) && isExcludedFolder(path)) {
        std::cout << "⚠️  Skipping excluded folder: " << path << "\n";
        continue;
      }

      if (std::filesystem::is_regular_file(path) && path.extension() == ".ts") {
        if (path.filename().string().find("Service.ts") != std::string::npos) {
          if (!validateServiceFileName(path)) {
            continue;
          }

          std::cout << "⏳ Processing file: " << path << "\n";
          std::string fileContent = readFileContent(path);
          validateEndpoints(path, fileContent);
        }
      }
    }
  } catch (const std::exception &e) {
    std::cerr << "❌ Exception: " << e.what() << "\n";
    return 1;
  }

  if (ERROR_FOUND) {
    std::cerr << "\n❌ Errors found during the generics check. Please fix them "
                 "before proceeding.\n";
    return 1;
  }

  std::cout << "\n🎉 No errors found. You passed all necessary generics!\n";
  std::cout << "✅ Generics check completed.\n";

  return 0;
}
