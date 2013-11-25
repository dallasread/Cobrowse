Minifying JS.

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `require 'uglifier'`
5. `cobrowse = Uglifier.compile( Dir.glob(["lib/dependencies/*", "lib/*"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
6. `File.open("cobrowse.min.js", 'w') { |file| file.write(cobrowse) }`
7. `Update CDN if necessary.`