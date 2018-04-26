module.exports = function(express){
    var route = express.Router();
    const MBackup = require('s3-mongo-backup');
   
    
    var designationRoute = {        
        fetch:(req,res)=>{
            var json=JSON.parse(req.body.credientals);           
            var backupConfig = {
                mongodb: {
                    "database": req.body.dbname,
                    "host": json.hname,
                    "username": json.uname,
                    "password": json.password,
                    "port": json.port                
                },
                s3: {
                    accessKey: json.accesskey,            
                    secretKey: json.secretkey,            
                    region: json.region ,                                     
                    bucketName: req.body.bucket
                },
                keepLocalBackups: false,                    
                noOfLocalBackups: 5,                        
                timezoneOffset: 300                        
            }
            try{
                MBackup(backupConfig)
                .then(
                            onResolve => {
                                            // When everything was successful                                           
                                            res.status(200).send({"status":"sucess","responce":onResolve});
                                         },
                            onReject => {
                                            // When Anything goes wrong!                                           
                                            res.status(500).send({"status":"error","responce":onReject});
                                        });
            }catch(err){
                res.status(404).send({"status":"error"});
            }
        }
    }    
    route.post('/',designationRoute.fetch);
    return route;
}