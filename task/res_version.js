/*
 * grunt-res-version
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tim GabyLiu, contributors
 * Licensed under the MIT license.
 */


module.exports = function (grunt){
    'use strict';
    var fs = require('fs'),
        path = require('path'),
        async = require('async'),
        crypto = require('crypto'),
        fileList = new Array();

    //广度优先
    function trave(dirL){
        var dList = dirL;
        if(dirL.length == 0){
            return;
            //console.log(fileList);
        }else{
            dList.forEach(function(dir) {
                var files = fs.readdirSync(dir);
                //console.log(files);
                files.forEach(function (file) {
                    var states = fs.statSync(dir + '/' + file);
                    if (states.isDirectory()) {
                        dList.push(dir + file);
                    } else {//文件
                        fileList.push(dir + '/' + file);
                        //查找里面静态资源的路径
                        findFile(dir, dir + '/' + file);
                    }
                });
                dList.shift();
            });
            trave(dList);
        }
    }

//查找模板里静态资源路径，计算静态资源md5
    function findFile(dir, file){

        var templateData = fs.readFileSync(file,"utf-8"),
            dirArray = templateData.toString().replace(/[\r\n]/g,'').match(/(src=|href=)\"([^\"]*)\"/g),//模板里面所有静态资源路径
            srcTable = new Array();//静态资源路径，已经md5表
        //console.log(dirArray);

        //难点：知道模板绝对路径，知道模板里面静态资源相对路径，求静态资源绝对路径
        if(dirArray){

            for(var i = 0; i <= dirArray.length; i++){
                if(dirArray[i]){
                    var htdocFile = dirArray[i].replace('src=\"', '').replace('\"', ''),
                        filePath = path.resolve(dir, htdocFile);//静态资源所在目录绝对路径
                    var fileData = fs.readFileSync(filePath, 'utf-8'),
                        md5sum = crypto.createHash('md5');
                    md5sum.update(fileData);
                    var srcTableEle = {
                        title: htdocFile,//模板里面的路径
                        md5: md5sum.digest('hex')//一旦digest被调用，hash对象就会被清空，不能被重用
                    };

                    srcTable.push(srcTableEle);

                }
            }
            //console.log(file);
            //console.log(srcTable);
            md5Replace(file, srcTable);
        }
    }

//替换模板里面静态资源路径，后面加?m=md5
    function md5Replace(tempFile, srcTable){
        //console.log('md5Replace tempFile ' + tempFile);
        //console.log('md5Replace srcTable ' + tempFile);
        var tempData = fs.readFileSync(tempFile,"utf-8").toString();
        //console.log(tempData);
        for(var i = 0; i < srcTable.length; i++){
            tempData = tempData.replace(srcTable[i].title, srcTable[i].title + '?m=' + srcTable[i].md5);
        }
        console.log(tempData);

        grunt.file.write(tempFile, tempData);
    }
    grunt.registerMultiTask('res_version', 'Static resource path to add the version number', function(){
        var options = this.options({
                urlRoot         :   ''
            }),
            dirList = this.filesSrc;
        trave(dirList);
        grunt.log.ok(dirList + ' created.');
    });

};
