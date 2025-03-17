module Fastlane
    module Helper
      class UtilHelper
        # Redirects standard output and standard error to a file
        def self.redirect_stdout_to_file(filename)
          original_stdout = $stdout.clone
          original_stderr = $stderr.clone
          $stderr.reopen(File.new(filename, 'w'))
          $stdout.reopen(File.new(filename, 'w'))
          yield
        ensure
          $stdout.reopen(original_stdout)
          $stderr.reopen(original_stderr)
        end

        # Captures and returns Fastlane output as a string
        def self.capture_fastlane_output
          require 'tempfile'
          temp_file = Tempfile.new('fastlane_output')
          redirect_stdout_to_file(temp_file.path) do
            yield
          end
          temp_file.rewind
          temp_file.read
        ensure
          temp_file.close
          temp_file.unlink
        end
      end
    end
  end
