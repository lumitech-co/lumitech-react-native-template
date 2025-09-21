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

void validateCreateApiUsage(const std::filesystem::path &filePath,
                            const std::string &fileContent) {
  // Pattern to match createApi<SomeInterface>()
  std::regex createApiPattern(
      R"(createApi<([a-zA-Z0-9_]+)>\(\)\()");

  std::smatch match;
  if (!std::regex_search(fileContent, match, createApiPattern)) {
    std::cout << "⚠️ No createApi usage found in file: " << filePath << "\n";
    return;
  }

  std::string interfaceName = match[1].str();
  
  // Check if the interface is defined in the same file
  std::regex interfacePattern(
      R"(interface\s+)" + interfaceName + R"(\s*\{)");
  
  if (!std::regex_search(fileContent, interfacePattern)) {
    std::cerr << "❌ Error: Interface '" << interfaceName << "' used in createApi<" 
              << interfaceName << "> is not defined in file '" << filePath << "'.\n";
    std::cerr << "💡 Hint: Make sure to define the interface that describes all endpoints.\n";
    ERROR_FOUND = true;
    return;
  }

  std::cout << "✅ Found valid createApi<" << interfaceName << "> with interface definition.\n";
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
          validateCreateApiUsage(path, fileContent);
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

  std::cout << "\n🎉 No errors found. All createApi interfaces are properly defined!\n";
  std::cout << "✅ Interface validation completed.\n";

  return 0;
}
