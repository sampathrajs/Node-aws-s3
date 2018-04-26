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
                accessKeyId:json.accesskey,
                secretAccessKey: json.secretkey
              });

              
              if(req.body.copy==1){
                var bucketName = req.body.source;
                var oldPrefix = req.body.file+'/';
                var newPrefix = req.body.file+'/';
               
                var s3 = new AWS.S3({params: {Bucket: bucketName}, region: json.region});
                
                var done = function(err, data) {
                  if (err) console.log(err);
                  else  res.send({"status":"success"});
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
              }else{
                var s3 = new AWS.S3(); 
                var params={
                    CopySource :req.body.source+'/'+req.body.file,
                    Key : req.body.file,
                    Bucket : req.body.destination   
                }                 
                try{
                    
                    s3.copyObject(params,(err,result)=>{
                        if(!err){
                            res.send({"status":"success"});
                        }
                    });
                }catch(err){
                    res.status(500).send({"status":"error","Error":err});
                }
 
              }
        
           
        }
    }    
    route.post('/',designationRoute.fetch);
    return route;
}