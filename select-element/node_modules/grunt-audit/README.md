# grunt-audit

> Generates an audit trail for minified builds with build sha1s and git revision numbers

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-audit --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-audit');
```

## The "audit" task

### Overview
In your project's Gruntfile, add a section named `audit` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  audit: {
    options: {
      repos: ['path/to/repos', 'to print commit hash']
    },
    your_target: {
      src: ['build', 'files'],
      dest: 'audit.log'
    },
  },
})
```

### Options

#### options.repos
Type: `String`
Default value: `[]`

A list of git repository paths that will be printed in the audit log under the REPOS section.
```
Repo: Sha1Hash
```

## Contributing
Please follow the guidelines in the `CONTRIBUTING.md` file

## Release History
_(Nothing yet)_
