module.exports = function(express){
    var route = express.Router();
    const AWS = require('aws-sdk');
    const fs = require('fs');
    const path = require('path');    
    var async = require('async');
    
  
    var designationRoute = {        
        fetch:(req,res)=>{
           
            var json=JSON.parse(req.body.credientals);            
            AWS.config.update({
                accessKeyId: json.accesskey,
                secretAccessKey: json.secretkey
              });
            var s3 = new AWS.S3();             
            try{           
                s3.listObjectsV2(  {
                    Bucket: req.body.source,
                    MaxKeys: 20,
                    Delimiter: '/',
                    Prefix:''
                  }, function (err, data) {
                    var buckets = data.CommonPrefixes;
                    var Folders=[];
                    var All={};
                    for (var i = 0; i < data.CommonPrefixes.length; i += 1) {
                         var bucket = buckets[i];
                         var value=bucket.Prefix;
                         {
                            var bucketName = req.body.source;
                            var oldPrefix = value;
                            var newPrefix = value;
                           
                            var s3 = new AWS.S3({params: {Bucket: bucketName}, region: json.region});
                            
                            var done = function(err, data) {
                              if (err) console.log(err);
                              else{} 
                              // res.send({"status":"success"});
                            };
                            
                            s3.listObjects({Prefix: oldPrefix}, function(err, data) {
                              if (data.Contents.length) {
                                async.each(data.Contents, function(file, cb) {
                                  var params = {
                                    CopySource: bucketName + '/' + file.Key,
                                    Key: file.Key.replace(oldPrefix, newPrefix),
                                    Bucket : req.body.destination
                                  };
                                  s3.copyObject(params, function(copyErr, copyData){
                                    if (copyErr) {
                                      // console.log(err);
                                    }
                                    else {
                                      // console.log('Copied: ', params.Key);
                                      cb();
                                    }
                                  });
                                }, done);
                              }
                            });
                          }
                    }
                   // All.folders=Folders;
                    var buckets = data.Contents;
                    var KeysValues=[];
                    for (var i = 0; i < data.Contents.length; i += 1) {
                         var bucket = buckets[i];
                         var value=bucket.Key;
                         {
                            var s3 = new AWS.S3(); 
                            var params={
                                CopySource :req.body.source+'/'+value,
                                Key : value,
                                Bucket : req.body.destination
                            }                 
                            try{
                                
                                s3.copyObject(params,(err,result)=>{
                                    if(!err){
                                        //res.send({"status":"success"});
                                    }
                                });
                            }catch(err){
                                //res.status(500).send({"status":"error","Error":err});
                            }
             
                          }                     
                       
                    }

                    res.send({"status":"success"});
                 //   All.files=KeysValues;
                    // if(All){
                    //       res.send({"status":"success","Data":All});
                    // }else{
                    //     res.send({"status":"failed","Error":err});
                    // }                   
            
        }); 
             
    
            }catch(err){
                res.status(404).send({"status":"error"});
            }
        }
    }    
    route.post('/',designationRoute.fetch);
    return route;
}

