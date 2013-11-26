### Minifying JS.

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `require 'uglifier'`
5. `cobrowser = Uglifier.compile( Dir.glob(["dependencies/*.js", "lib/*.js"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
6. `cobrowser = cobrowser.gsub("assets/css/style.css", "https://www.daljs.org/cobrowser.min.css")`
7. `File.open("cobrowser.min.js", 'w') { |file| file.write(cobrowser) }`
8. `File.open("../netbuild/public/cobrowser.min.js", 'w') { |file| file.write(cobrowser) }`

9. `require 'sass'`
10. `css = Sass::Engine.new(Dir.glob(["assets/css/*.css"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), :syntax => :scss, :style => :compressed).render`
11. `File.open("cobrowser.min.css", 'w') { |file| file.write(css) }`
12. Copy cobrowser.min.js and cobrowser.min.css to NetBuild.co.

### Start Faye
`rackup faye.ru -s thin -E production`