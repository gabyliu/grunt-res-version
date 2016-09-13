/*
 * grunt-version-file
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tim GabyLiu, contributors
 * Licensed under the MIT license.
 */
module.exports = function (grunt){
    'use strict';
    var fs = require('fs'),
        path = require('path'),
        crypto = require('crypto'),
        fileList = new Array(),
        mapFileMd5 = {};
		
    grunt.registerMultiTask('version', 'Static resource path to add the version number', function(opt){
        //grunt 缺省 option
        var options = this.options({
                ext: '/(.jpg)$|(.jpeg)$|(.png)|(.css)$|(.js)$/ig' //如果gruntfile那里有配置值，会覆盖这里的
            }),
			startTime = new Date(),
			totalTime,
			totalTemp = 0,//统计总共修改了多少个模板
			srcTable = [];//静态资源路径hashtable
			
		//遍历所有模板
		var tempMethod = {
			//查找模板里静态资源路径，计算静态资源md5
			findFile: function(dir, fileDir){
				var fileReg = eval(options.ext);
				var dataFile = fs.readFileSync(fileDir,"utf-8"),
					resDirArray = dataFile.toString().replace(/[\r\n]/g,'').match(/(src=|href=)\"([^\"]*)\"/g);//获取模板里面所有静态资源路径
				resDirArray ? resDirArray = resDirArray : resDirArray = [];

				resDirArray.forEach(function(listEle){
					var resDir = listEle.replace(/(src=)|(href=)|(\")/ig,'');
					if(fileReg.test(resDir)){//要计算的文件
						var resPath = path.resolve(dir, resDir),//绝对路径
							srcTableEle = {
								title: resDir,//模板里面的路径
								md5: null//一旦digest被调用，hash对象就会被清空，不能被重用
							};
						
						mapFileMd5[resPath] ? null : mapFileMd5[resPath] = tempMethod.countMd5(resPath);
						
						srcTableEle.md5 = mapFileMd5[resPath];
						srcTable.push(srcTableEle);
						
					}

				});
				tempMethod.md5Replace(fileDir, srcTable);
				++totalTemp;
			},
			//计算静态资源md5
			countMd5: function(filePath){
				var folder_exists = fs.existsSync(filePath);
				if(folder_exists){
					var fileData = fs.readFileSync(filePath, 'utf-8'),
					md5sum = crypto.createHash('md5');
					md5sum.update(fileData);
					var md5 = md5sum.digest('hex');
					return md5;
				}
				return '';  
			},
			//替换模板里面静态资源路径，后面加?m=md5
			md5Replace: function(tempFile, srcTable){
				var tempData = fs.readFileSync(tempFile,"utf-8").toString();
				for(var i = 0; i < srcTable.length; i++){
					tempData = tempData.replace(srcTable[i].title, srcTable[i].title + '?m=' + srcTable[i].md5);
				}
				grunt.file.write(tempFile, tempData);
			}
		};
		function trave(dirL){
			var dList = dirL;
			if(dirL.length == 0){
				return;
			}else{
				var htmlReg = /(.html)$/i;
				dList.forEach(function(dirListEle){
					grunt.file.recurse(dirListEle, function(abspath, rootdir, subdir, filename){

						htmlReg.test(abspath) ? tempMethod.findFile(rootdir + subdir, abspath) : null;//判断是否是html，是的话拿去计算路径
					});
					dList.shift();
				})

			}
			trave(dList);
		}
		trave(this.data.filesSrc);
		console.log('Calculate the md5 ' + srcTable.length + (srcTable.length === 1 ? ' file' : ' files') + ', modified ' + totalTemp + (totalTemp === 1 ? ' file' : ' files'));
		console.log('TotalTime: ' + (new Date() - startTime) + 'ms');
	});
};
