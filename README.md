# node-semver-fs
 
    npm install semver-fs
 
Because when times are hard, sometimes it pays to resolve filenames using semver ranges.
 
For instance, in a grunt file:
 
    concat: {
      js: {
        src: require('semver-fs').resolveFiles({foo: 'x'}, {basePath: '../lib/'}),
        dest: '<%= pkg.name %>.js'
      }
    },
 
Assume the following directory structure:
 
    - grunt_project_A
     |- Gruntfile.js
    - lib
     |- foo
     | |- 0.1.0
     | | |- main.js
     | |- 0.2.0
     | | |- main.js
     |- bar-1.1.0.js
     |- foo-0.2.1.js
 
The `foo` directory will be searched first. If there are matches, the max compatible version will be selected. If there are none, the search will continue in the `basePath` using the following regular expression:
 
    ^{name}-.*(\d+\.\d+\.\d+).*$  // {name} is 'foo' in this instance
 
The `foo` version directories may contain `index.js` or `foo.js` files instead of `main.js`. The recognized paths can be modified using the `recognizePath` option, e.g., `recognizePath: ['package/{name}.js']` to pick up foo/0.1.0/package/foo.js, etc.
