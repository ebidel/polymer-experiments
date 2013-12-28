/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

'use strict';

module.exports = function(grunt) {
  var crypto = require('crypto');
  var path = require('path');
  var fs = require('fs');

  grunt.registerMultiTask('audit', 'Generate audit trail with sha1 hashes', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: grunt.util.linefeed,
      repos: []
    });

    function fileHash(filepath) {
      var blob = fs.readFileSync(filepath);
      var sha1sum = crypto.createHash('sha1');
      sha1sum.update(blob);
      var hex = sha1sum.digest('hex');
      return filepath + ': ' + hex;
    }

    function findRev(repoPath, callback) {
      grunt.util.spawn({
        cmd: 'git',
        args: ['--git-dir', path.resolve(repoPath, '.git'), 'rev-parse', 'HEAD']
      }, function(error, result, code) {
        if (error) {
          callback(error);
        } else {
          // assume repo directory name is repo "name"
          callback(null, path.basename(path.resolve(repoPath)) + ': ' + result);
        }
      });
    }

    function moduleVersions(callback) {
      grunt.util.spawn({
        cmd: 'npm',
        args: ['list', '--depth=0']
      }, function(error, result, code) {
        var tree = result.stdout;
        var treeArray = tree.split(options.separator);
        // only show dependencies, not top level
        treeArray.shift();
        // remove leading utf8 line chars, module@version -> module: version
        treeArray = treeArray.map(function(s){ return s.slice(4).replace('@',': '); });
        tree = treeArray.join(options.separator);
        callback(null, tree);
      });
    }

    function out(revs, modules, hashes, dest) {
      // build audit log
      var log = [
        'BUILD LOG',
        '---------',
        'Build Time: ' + grunt.template.today('isoDateTime'),
        '',
        'NODEJS INFORMATION',
        '==================',
        'nodejs: ' + process.version,
        modules,
        '',
        'REPO REVISIONS',
        '==============',
        revs.join(options.separator),
        '',
        'BUILD HASHES',
        '============',
        hashes
      ].join(options.separator);

      if (dest) {
        grunt.file.write(dest, log);
        grunt.log.writeln('Wrote audit log:', dest, 'successfully');
      } else {
        grunt.log.writeln(log);
      }
    }

    var done = this.async();
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(fileHash).join(options.separator);

      grunt.util.async.parallel({
        repos: function(callback) {
          // find commit hash for each repo
          grunt.util.async.map(options.repos || [], findRev, callback);
        },
        versions: function(callback) {
          moduleVersions(callback);
        },
      }, function(err, results) {
        if (!err) {
          out(results.repos, results.versions, src, f.dest);
        }
        done(err);
      });
    });
  });
};
