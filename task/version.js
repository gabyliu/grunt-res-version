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
        //grunt default option
        var options = this.options({
				fileNameVersion: '/(.js)$/ig',
				ext: '/(.jpg)$|(.jpeg)$|(.png)|(.css)$|(.js)$/ig' //rule to which files will be caculated
            }),
			startTime = new Date(),
			totalTime,
			totalTemp = 0,//A total of how many files are computed
			srcTable = [],//¾²Ì¬×ÊÔ´Â·¾¶hashtable
			fileReg = eval(options.ext);
		
		
		var tempMethod = {
			//open file and find all links
			findFile: function(dir, fileDir){
				var dataFile = fs.readFileSync(fileDir,"utf-8"),
					resDirArray = dataFile.toString().replace(/[\r\n]/g,'').match(/(src=|href=)\"([^\"]*)\"/g),//Collect all the links
					currentSrcTale = [];
				resDirArray ? resDirArray = resDirArray : resDirArray = [];

				resDirArray.forEach(function(listEle){
					var resDir = listEle.replace(/(src=)|(href=)|(\")/ig,'');

					var isMatch = !!resDir.match(fileReg);

					if(isMatch){//check is match the rule of which files will be caculated
						var resPath = path.resolve(dir, resDir),//
							srcTableEle = {
								title: resDir,//change relative paths to absolute paths
								md5: null//init value, include two variable: md5 and isFileName
							};
						
						mapFileMd5[resPath] ? null : mapFileMd5[resPath] = tempMethod.countMd5(resPath);
						
						srcTableEle.md5 = mapFileMd5[resPath];
						currentSrcTale.push(srcTableEle);
						srcTable.push(srcTableEle);
					}
				});
				
				tempMethod.md5Replace(fileDir, currentSrcTale);
				++totalTemp;
			},
			//caculate md5 and modify files' name
			countMd5: function(filePath){
				var fileValue = {
						isFileName: false,
						md5: null,
					}, 
					fileReg = eval(options.fileNameVersion),
					folder_exists = fs.existsSync(filePath);

				if(folder_exists){//according to the path to determine whether a file exists
					var fileData = fs.readFileSync(filePath, 'utf-8'),
					md5sum = crypto.createHash('md5');
					md5sum.update(fileData);
					fileValue.md5 = md5sum.digest('hex');

					if(fileReg.test(filePath)){//determine whether to rename files
						fileValue.isFileName = true;
						var newPath = filePath.replace(fileReg, '') + '.' + fileValue.md5 + path.extname(filePath);
				        fs.rename(filePath, newPath, function(err) {
				            if (!err) {
				                grunt.log.warn('rename ' + filePath + 'fail');
				            }       
				        })
					}
					return fileValue;
				}else{
					grunt.log.warn('not exist ' + filePath);
				}
				return null;  
			},
			//modified links in html
			md5Replace: function(tempFile, srcTable){
				var tempData = fs.readFileSync(tempFile,"utf-8").toString();
				for(var i = 0; i < srcTable.length; i++){
					if(srcTable[i].md5){
						
						if(srcTable[i].md5.isFileName){
							tempData = tempData.replace(srcTable[i].title, path.dirname(srcTable[i].title) + '/' + path.basename(srcTable[i].title).replace(eval(options.fileNameVersion), '') + '.' + srcTable[i].md5.md5 + path.extname(srcTable[i].title));
						}else{
							tempData = tempData.replace(srcTable[i].title, srcTable[i].title + '?m=' + srcTable[i].md5.md5);
						}
					
					}
					
				}
				grunt.file.write(tempFile, tempData);
			}
		};

		//enter function
		function trave(dirL){
			var dList = dirL;
			if(dirL.length == 0){
				return;
			}else{
				var htmlReg = /(.html)$/i;
				dList.forEach(function(dirListEle){
					grunt.file.recurse(dirListEle, function(abspath, rootdir, subdir, filename){

						htmlReg.test(abspath) ? tempMethod.findFile(rootdir + subdir, abspath) : null;//Only check the links in the HTML
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
