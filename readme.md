### Minifying JS.

```
gem install uglifier
cd cobrowser
irb
require 'uglifier'
cobrowser = Uglifier.compile( Dir.glob(["dependencies/*.js", "lib/*.js"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none, mangle: true).gsub(/\n/, " ")
File.open("cobrowser.min.js", 'w') { |file| file.write(cobrowser) }
File.open("../netbuild/public/cobrowser.min.js", 'w') { |file| file.write(cobrowser) }
require 'sass'
css = Sass::Engine.new(Dir.glob(["assets/css/*.css"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("/* end */"), :syntax => :scss, :style => :compressed).render
File.open("cobrowser.min.css", 'w') { |file| file.write(css) }
File.open("../netbuild/public/cobrowser.min.css", 'w') { |file| file.write(css) }
```

### Start Faye
`rackup faye.ru -s thin -E production`