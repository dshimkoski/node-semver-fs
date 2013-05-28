
var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
    semver = require('semver');

module.exports = exports = semver;

var defaults = {
  basePath: '',
  recognizePath: ['index.js', 'main.js', '{name}.js']
};

exports.resolveFiles = function(map, o) {

  var basePath = o.basePath || defaults.basePath;
  var recognizePath = o.recognizePath || defaults.recognizePath;

  if (!exists(basePath)) return false;

  var files = [];

  Object.keys(map).forEach(function(k) {

    var dir = basePath + k + '/', versions = {};

    if (!recognizePath || !exists(dir) || !fill(versions, dir, {
        exec: function(entry) {
          var m = /^(\d+\.\d+\.\d+)$/.exec(entry);
          if (m) {
            var v = m[1];
            for (var i = 0, len = recognizePath.length; i < len; i++) {
                var path = v + '/' + recognizePath[i].replace('{name}', k);
                if (exists(dir + '/' + path)) return [path, v];
            }
            return false;
          }
          return m;
        }
      })) {

      fill(versions, basePath, new RegExp('^'+k+'-.*(\\d+\\.\\d+\\.\\d+).*$'));

    }

    var keys = Object.keys(versions);

    if (!keys.length) return false;

    max = semver.maxSatisfying(keys, map[k]);

    files.push(versions[max][0]);

  });

  return files;

};

function fill(versions, dir, matcher) {

  var filled = 0;

  fs.readdirSync(dir).forEach(function(entry) {
    var m = matcher.exec(entry);
    if (m) {
      var v = m[1];
      if (!versions[v]) versions[v] = [];
      versions[v].push(dir + m[0]);
      ++filled;
    }
  });

  return filled;

}