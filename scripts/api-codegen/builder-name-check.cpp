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
  for (const auto &excluded : EXCLUDED_FOLDERS) {
    if (folderPath.filename() == excluded) {
      return true;
    }
  }
  return false;
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

void processServiceFile(const std::filesystem::path &serviceFile) {
  std::cout << "⏳ Checking file: " << serviceFile << "\n";

  std::string fileContent = readFileContent(serviceFile);
  if (fileContent.empty())
    return;

  std::regex pattern(R"(endpoints:\s*\(?([a-zA-Z_][a-zA-Z0-9_]*)\)?\s*=>)");
  std::smatch match;

  if (std::regex_search(fileContent, match, pattern)) {
    std::string paramName = match[1].str();

    if (paramName != "builder") {
      std::cerr << "❌ Error: Incorrect endpoints parameter name '" << paramName
                << "' in file '" << serviceFile.string()
                << "'. Expected: 'builder' or '(builder)'\n";
      ERROR_FOUND = true;
    }
  }
}

int main() {
  std::cout << "\n🔍 Initializing builder parameter check...\n";
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
        std::string fileName = path.filename().string();
        if (fileName.find("Service.ts") != std::string::npos) {
          processServiceFile(path);
        }
      }
    }
  } catch (const std::exception &e) {
    std::cerr << "❌ Exception: " << e.what() << "\n";
    return 1;
  }

  if (ERROR_FOUND) {
    std::cerr << "\n❌ Errors found during the builder parameter check.\n";
    std::cerr << "🚨 Please fix them before proceeding.\n";
    return 1;
  }

  std::cout << "\n🎉 No errors found. Your code follows naming conventions!\n";
  std::cout << "✅ Builder parameter check successfully completed.\n";

  return 0;
}
