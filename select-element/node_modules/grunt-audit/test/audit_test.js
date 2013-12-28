/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var log;
function readLog() {
  if (!log) {
    log = grunt.file.read('tmp/audit.log').split(grunt.util.linefeed);
  }
  return log;
}

var SHA1 = /^[0-9a-f]{40}$/i;
function validHash(hash) {
  return SHA1.test(hash);
}

var crypto = require('crypto');
var fs = require('fs');
function sha1sum(file) {
  var hash = crypto.createHash('sha1');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex');
}

exports.audit = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  madeFile: function(test) {
    test.expect(1);
    test.ok(grunt.file.exists('tmp/audit.log'), 'audit log should exist');
    test.done();
  },
  timeStamp: function(test) {
    test.expect(2);
    var log = readLog();
    var time = log[2];
    var a = time.split(': ');
    test.equal(a[0], 'Build Time');
    var d = new Date(a[1]);
    test.notEqual(d.toString(), 'Invalid Date', 'Build time should be valid');
    test.done();
  },
  nodeVersion: function(test) {
    test.expect(1);
    var log = readLog();
    var node_line = log[6];
    var a = node_line.split(': ');
    test.equal(a[1], process.version, 'node should be reported');
    test.done();
  },
  gitVersions: function(test) {
    test.expect(3);
    var log = readLog();
    var index = log.indexOf('REPO REVISIONS');
    test.notEqual(index, -1, 'REPO REVISIONS should be a title');
    var repoline = log[index + 2];
    var repo = repoline.split(': ')[1];
    test.ok(repo,'repo should be reported');
    test.ok(validHash(repo), 'repo should be a valid sha1 hash');
    test.done();
  },
  buildHashes: function(test) {
    test.expect(5);
    var log = readLog();
    var index = log.indexOf('BUILD HASHES');
    test.notEqual(index, -1, 'BUILD HASHES should be a title');
    var line = log[index + 2].split(': ');
    test.equal(line[0], 'test/fixtures/testing', 'first file is testing');
    test.equal(line[1], sha1sum(line[0]), 'sha1 hash should be equal');
    line = log[index + 3].split(': ');
    test.equal(line[0], 'test/fixtures/123', 'second file is 123');
    test.equal(line[1], sha1sum(line[0]), 'sha1 hash should be equal');
    test.done();
  }
};
