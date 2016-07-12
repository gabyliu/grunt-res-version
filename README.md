# grunt-res-version
This plugin for update static resource version and the path of static resources in template.
## Getting Started
This plugin requires Grunt ~0.4.0

If you haven't used [Grunt](http://www.gruntjs.net/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:
> npm install grunt-res-version --save-dev
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
> grunt.loadNpmTasks('grunt-res-version');

## res_verson task

### Options
null

### Usage Examples
` res_version: {
   main: {
     files: [
       {
         src: ['template/zh_CN/htmledition/'],
         dest: 'template/zh_CN/htmledition/'
       }
     ]
   }
}`
