/*
 * Helpers for various tasks
 * 
 */

 // Dependencies
 const crypto = require('crypto');
 const config = require('../../config')
 const path = require('path')
 const fs = require('fs')

 // Container
 const helpers = {};


// Parse a JSON string to an obhect in all cases, without throwing
helpers.parseJsonToObject =function(str){
    try{
        const obj = JSON.parse(str)
        return obj;
    }catch(e){
        return {};
    }
}

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback)=>{
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if(fileName){
        const publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir+ fileName, (err,data)=>{
            if(!err && data){
                callback(false, data);
            }else{
                callback('No file could be found')
            }
        })
    }else{
        callback('A valid filename was not specified');
    }
}

module.exports = helpers;