s3app.localstorage = {};

s3app.localstorage.setCredientals = function(crediental){
    var data = window.localStorage.getItem("credientals");
    if(data){
        //data = JSON.parse(data);
        localStorage.removeItem("credientals");
    }
    // else{
    //     data = [];
    // }

    // data.push(crediental);
    window.localStorage.setItem("credientals",JSON.stringify(crediental));
}
s3app.localstorage.setBuckets=function(buckets){
    var bucket=window.localStorage.getItem("buckets");
    if(bucket){
        localStorage.removeItem("buckets");
    }
    window.localStorage.setItem("buckets",JSON.stringify(buckets));
}
s3app.localstorage.getBuckets=function(){
    var bucket=window.localStorage.getItem("buckets");
    return bucket;
}

s3app.localstorage.getCredientals = function(){
    var data = window.localStorage.getItem("credientals");
    return data;
}