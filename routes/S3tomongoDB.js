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
                var file = require('fs').createWriteStream(`temp.gz`);
                var stream = s3.getObject({Bucket: req.body.bucket, Key:req.body.file}).createReadStream();
                stream.pipe(file);
                stream.on('finish', function(){
                var exec = require('child_process').exec;  
                var cmd= null;
                
                if(req.body.sourcedb.trim()!="" && req.body.destinationdb.trim()!=""){
                    
                    var sourcedbname=req.body.sourcedb+'.*';
                    var destinationdbname=req.body.destinationdb+'.*';
                    cmd='mongorestore --host '+json.hname+'  --gzip --archive=temp.gz --nsFrom '+sourcedbname+' --nsTo '+destinationdbname+'';
                }else{
                    cmd="mongorestore --host "+json.hname+" --port=27017 --gzip --archive=temp.gz"; 
                }                      

                exec(cmd, function (error, stdout, stderr) {
                fs.unlink("temp.gz",function(){    
                    });
                    if(!error){
                        res.send({"status":"sucsess"});
                    }else{
                        res.status(400).send({"status":"Error"});
                    }
                  
               
        });
    });
    
            }catch(err){
                res.status(404).send({"status":"error"});
            }
        }
    }    
    route.post('/',designationRoute.fetch);
    return route;
}

