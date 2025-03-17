#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <unordered_set>
#include <vector>
#include <filesystem>

const std::filesystem::path API_DIR =
    std::filesystem::current_path() / "src/shared/api";
const std::filesystem::path OUTPUT_FILE = API_DIR / "models/QueryKeys.ts";
const std::unordered_set<std::string> EXCLUDED_FOLDERS = {"models"};

std::string toSnakeCaseUpper(const std::string &input) {
  std::ostringstream result;
  for (size_t i = 0; i < input.size(); ++i) {
    if (std::isupper(input[i]) && i > 0) {
      result << "_";
    }
    result << (char)std::toupper(input[i]);
  }
  return result.str();
}

void generateQueryKeysFile() {
  std::cout << "\n🔍 Initializing QueryKeys generation..." << std::endl;
  std::cout << "📂 Writing to: " << OUTPUT_FILE << "\n" << std::endl;

  std::ofstream outputFile(OUTPUT_FILE);
  if (!outputFile.is_open()) {
    std::cerr << "❌ Error: Unable to create QueryKeys file: " << OUTPUT_FILE
              << std::endl;
    return;
  }

  outputFile << "\n";
  std::vector<std::string> allQueryKeysExports;

  for (const auto &entry : std::filesystem::directory_iterator(API_DIR)) {
    if (!entry.is_directory()) {
      continue;
    }

    std::filesystem::path serviceDir = entry.path();
    if (EXCLUDED_FOLDERS.find(serviceDir.filename().string()) !=
        EXCLUDED_FOLDERS.end()) {
      std::cout << "⚠️  Skipping directory: " << serviceDir << "\n" << std::endl;
      continue;
    }

    std::filesystem::path queryKeysFile = serviceDir / "QueryKeys.ts";
    if (!std::filesystem::exists(queryKeysFile)) {
      continue;
    }

    std::string serviceName = serviceDir.filename().string();
    std::string serviceConstName = toSnakeCaseUpper(serviceName);
    std::string importPath = "../" + serviceName;

    std::cout << "⏳ Processing QueryKeys for service: " << serviceName
              << std::endl;

    outputFile << "import { " << serviceConstName << "_QUERY_KEYS } from '"
               << importPath << "/QueryKeys';\n";
    allQueryKeysExports.push_back("..." + serviceConstName + "_QUERY_KEYS");
  }

  outputFile << "\nexport const queryKeys = {\n";
  for (const auto &exportEntry : allQueryKeysExports) {
    outputFile << "  " << exportEntry << ",\n";
  }
  outputFile << "};\n\n";

  outputFile << "export type QueryKeyType = ReturnType<\n"
             << "  (typeof queryKeys)[keyof typeof queryKeys]\n"
             << ">;\n\n";

  outputFile.close();
  std::cout << "✅ Merged QueryKeys successfully written to: " << OUTPUT_FILE
            << "\n"
            << std::endl;
}

int main() {
  generateQueryKeysFile();
  return 0;
}
