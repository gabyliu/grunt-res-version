# grunt-res-version
This plugin for update static resource version and the path of static resources in template.
## Getting Started
This plugin requires Grunt ~0.4.0

If you haven't used [Grunt](http://www.gruntjs.net/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:
> npm install grunt-res-version --save-dev

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

> grunt.loadNpmTasks('grunt-res-version');

## resVersion task
Run this task with the grunt copy command.
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options
Don't need temporarily

### Usage Examples
#### Copying without full path:
```js
resVersion: {
   main: {
     files: [
       {
         src: ['template/'],
         dest: 'template/'
       }
     ]
   }
}
```

Here are some additional examples, given the following development directory tree:
```js
|-src//development directory
|  |-template
|  |-htdocs
|-Gruntfile.js
|-template//dist directory for template 
|-htdocs//dist directory for htdocs
```

run 
```js
grunt resVersion
```
