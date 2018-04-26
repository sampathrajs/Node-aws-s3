module.exports = function(express){
    var route = express.Router();
    const AWS = require('aws-sdk');
    const fs = require('fs');
    const path = require('path');    
    
  
    var designationRoute = {        
        fetch:(req,res)=>{
           
            // var json=JSON.parse(req.body.credientals);
            AWS.config.update({
                accessKeyId: req.body.accesskey,
                secretAccessKey: req.body.secretkey
              });
            var s3 = new AWS.S3();             
            try{           
                s3.listBuckets({}, function (err, data) {
                
                    
                    // for (var i = 0; i < buckets.length; i += 1) {
                    //     var bucket = buckets[i];
                    //     console.log(bucket.Name + " created on " + bucket.CreationDate);
                    // }
                    if(!err){
                        res.send({"status":"success","Data":data.Buckets});
                    }else{
                        res.status(500).send({"status":"error","err":err})
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

