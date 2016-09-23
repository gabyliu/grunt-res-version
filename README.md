# grunt-res-version
这个插件用于计算静态资源的md5，并替换模板里静态资源的路径。

This plugin for update static resource version and the path of static resources in template.

![example](http://mmbiz.qpic.cn/mmemoticon/MxlUWr5LG0xLdJpJ4f1HzEa4rIc7cVJPgJ6DgbQiaVfqS8iarTaqXEoHbEEGg9aWG2/0)

这是构建后的结果。

This is the result of the template has been modified.
 
## Getting Started
This plugin requires Grunt ~0.4.0

If you haven't used [Grunt](http://www.gruntjs.net/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:
> npm install grunt-res-version --save-dev

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

> grunt.loadNpmTasks('grunt-res-version');

## version task
Run this task with the grunt copy command.
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


## Setting items
这个插件只有一个必填项，两个选填项。

This plugin is only one mandatory, two optional.


### filesSrc
Type: `Array`

模板目录。这里源目录和目标目录是一样的。

The directories of template.It is important to note the source directory and the target directory is the same.

### Options
#### ext
Type: `String`

Default: `'/(.jpg)$|(.jpeg)$|(.png)|(.css)$|(.js)$/ig'`

这是一个字符串形式的正则表达式。用来筛选要被计算md5的文件。

This option is a string of regular expressions used to filter needs to be calculated md5 file.

#### fileNameVersion
Type: `String`

Default: `'/(.js)$/ig'`

这是一个字符串形式的正则表达式。用来筛选需要在文件名中加md5的文件。

This option is a string of regular expressions used to filter files which needs to be added md5 in file name.

**Example**
```javascript
fileNameVersion: '/(.css)$/ig'
```
![example](http://mmbiz.qpic.cn/mmemoticon/ajNVdqHZLLBwiblWwKUMqG9iaUwdhOE7W7pcqoKOTUR9KE6NwVbCh0iamlGUia7SUZATKdSIO2JHWibf78DiacHK8Mibg/0)

### Usage Examples
#### Copying without full path:
```javascript
version: {
    main: {
        options: {
    		ext: '/(.jpg)$|(.jpeg)$|(.png)|(.css)$|(.js)$/ig'
		},
		filesSrc: ['template/']
	}
}
```


Here are some additional examples, given the following development directory tree:
```javascript
|-src//source directory
|  |-template
|  |-htdocs
|-Gruntfile.js
|-template//target directory for template
|-htdocs//target directory for htdocs
```


