#include <cstdlib>
#include <fstream>
#include <iostream>
#include <unordered_set>
#include <filesystem>

const std::filesystem::path API_DIR =
    std::filesystem::current_path() / "src/shared/api";
const std::filesystem::path INDEX_FILE = API_DIR / "index.ts";
const std::unordered_set<std::string> EXCLUDED_FOLDERS = {"models", "hooks"};

void updateAPIIndexFile()
{
  std::cout << "\n🔍 Updating API index file..." << std::endl;
  std::cout << "📂 Target file: " << INDEX_FILE << "\n"
            << std::endl;

  std::ofstream tempFile("temp_index.ts");
  if (!tempFile.is_open())
  {
    std::cerr << "❌ Error: Unable to create temporary file.\n";
    return;
  }

  tempFile << "// This file is auto-generated. Do not modify manually.\n\n";

  std::cout << "⏳ Scanning API subdirectories...\n"
            << std::endl;

  for (const auto &entry : std::filesystem::directory_iterator(API_DIR))
  {
    if (entry.is_directory())
    {
      std::string moduleName = entry.path().filename().string();
      if (EXCLUDED_FOLDERS.find(moduleName) != EXCLUDED_FOLDERS.end())
      {
        continue;
      }

      tempFile << "export * from './" << moduleName << "';\n";
      std::cout << "✅ Added module: " << moduleName << std::endl;
    }
  }

  tempFile << "\nexport * from './queryClient';\n";
  tempFile << "export * from './models';\n";
  tempFile << "export { useMutationEvents, useQueryEvents } from './hooks';\n";

  tempFile.close();
  std::filesystem::rename("temp_index.ts", INDEX_FILE);

  std::cout << "\n✅ " << INDEX_FILE << " has been updated successfully!\n"
            << std::endl;

  std::cout << "🎉 API index file update completed!\n"
            << std::endl;
}

int main()
{
  updateAPIIndexFile();
  return 0;
}
