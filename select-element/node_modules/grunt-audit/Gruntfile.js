/*
 * grunt-audit
 * https://github.com/azakus/grunt-audit
 *
 * Copyright (c) 2013 Daniel Freedman
 * Licensed under the BSD license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    audit: {
      default: {
        options: {
          repos: ['.']
        },
        files: {
          'tmp/audit.log': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
      // this one prints to stdout for convenience, untested
      stdout: {
        src: ['test/fixtures/testing', 'test/fixtures/123'],
        options: {
          repos: ['.']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'audit:default', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
