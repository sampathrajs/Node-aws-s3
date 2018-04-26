module.exports = function(express){
    var route = express.Router();
    const AWS = require('aws-sdk');
    const fs = require('fs');
    const path = require('path');    
    
  
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
                         if(value!=''){
                            Folders.push(value);
                         }                     
                       
                    }
                    All.folders=Folders;
                    var buckets = data.Contents;
                    var KeysValues=[];
                    for (var i = 0; i < data.Contents.length; i += 1) {
                         var bucket = buckets[i];
                         var value=bucket.Key;
                         if(value!=''){
                            KeysValues.push(value);
                         }                     
                       
                    }
                    All.files=KeysValues;
                    if(All){
                          res.send({"status":"success","Data":All});
                    }else{
                        res.send({"status":"failed","Error":err});
                    }                   
            
        }); 
             
    
            }catch(err){
                res.status(404).send({"status":"error"});
            }
        }
    }    
    route.post('/',designationRoute.fetch);
    return route;
}

