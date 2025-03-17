#include <fstream>
#include <iostream>
#include <regex>
#include <vector>
#include <filesystem>
#include <unordered_map>

const std::filesystem::path BASE_DIR =
    std::filesystem::current_path() / "src/shared/api";
const std::string MODELS_FILE_NAME = "models.ts";
bool DUPLICATE_WARNING = false;

std::vector<std::string> extractNames(const std::filesystem::path &filePath) {
  std::vector<std::string> names;
  std::ifstream file(filePath);
  if (!file.is_open()) {
    std::cerr << "❌ Error: Unable to open file: " << filePath << "\n";
    return names;
  }

  std::regex pattern(R"(^export\s+(interface|type)\s+([a-zA-Z0-9_]+))");
  std::string line;
  std::smatch match;

  while (std::getline(file, line)) {
    if (std::regex_search(line, match, pattern)) {
      names.push_back(match[2].str());
    }
  }
  return names;
}

void checkDuplicates(
    const std::unordered_map<std::string, std::vector<std::filesystem::path>>
        &nameOccurrences) {
  std::cout << "🔎 Checking for duplicate interfaces/types...\n";

  bool foundDuplicate = false;
  for (const auto &[name, files] : nameOccurrences) {
    if (files.size() > 1) {
      foundDuplicate = true;
      DUPLICATE_WARNING = true;
      std::cerr << "\n❌ Duplicate interface/type found: '" << name << "'\n";
      std::cerr << "⚠️ Instances found in:\n";
      for (const auto &file : files) {
        std::cerr << "  - " << file << "\n";
      }
    }
  }

  if (!foundDuplicate) {
    std::cout << "✅ No duplicates found.\n";
  }
}

int main() {
  std::cout << "\n🔍 Starting duplicate interface/type check...\n";
  std::cout << "📂 Scanning for '" << MODELS_FILE_NAME
            << "' files in: " << BASE_DIR << "\n\n";

  if (!std::filesystem::exists(BASE_DIR) ||
      !std::filesystem::is_directory(BASE_DIR)) {
    std::cerr << "❌ Error: Directory does not exist: " << BASE_DIR << "\n";
    return 1;
  }

  std::unordered_map<std::string, std::vector<std::filesystem::path>>
      nameOccurrences;

  for (const auto &dirEntry :
       std::filesystem::recursive_directory_iterator(BASE_DIR)) {
    const auto &path = dirEntry.path();
    if (std::filesystem::is_regular_file(path) &&
        path.filename() == MODELS_FILE_NAME) {
      std::cout << "⏳ Processing: " << path << "\n";

      std::vector<std::string> extractedNames = extractNames(path);
      for (const std::string &name : extractedNames) {
        nameOccurrences[name].push_back(path);
      }
    }
  }

  checkDuplicates(nameOccurrences);

  if (DUPLICATE_WARNING) {
    std::cerr
        << "\n❌ Code generation halted due to duplicate interfaces/types.\n";
    std::cerr << "🚨 Please resolve the duplicates listed above and re-run the "
                 "script.\n";
    return 1;
  } else {
    std::cout
        << "\n🎉 No duplicates found. Proceeding with code generation...\n";
    return 0;
  }
}
