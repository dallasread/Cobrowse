Minifying JS.

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `require 'uglifier'`
5. `cobrowser = Uglifier.compile( Dir.glob(["dependencies/*.js", "lib/*.js"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
6. `File.open("cobrowser.min.js", 'w') { |file| file.write(cobrowser) }`
7. `Update CDN if necessary.`