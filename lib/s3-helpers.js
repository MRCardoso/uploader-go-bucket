function s3Helper(options = {})
{
    if( !(this instanceof Helper) ) return new Helper(options);
    
    /**
    | --------------------------------------------------------------------------------
    | Upload an Object from bucket s3, in the default bucket
    | --------------------------------------------------------------------------------
    * @param file the object of uploaded file
    * @param pathName the name of the key to sent from s3
    * @param newPathName the path of the local file to upload from bucket
    * @return Promise object
    */
    this.uploadObject = uploadObject;

    return this;
}

exports.s3Helper = s3Helper;

function uploadObject(file, pathName, newPathName)
{
    console.log('ok');
    return 'ok;';
    // return new Promise((resolve, reject) => {
    //     let fs = require('fs');
    //     let AWS = require('aws-sdk');
    //     let s3obj = new AWS.S3({
    //         params: {
    //             Bucket: credentials.s3_bucket,
    //             ContentType: file.type,
    //             Key: pathName
    //         }
    //     });
    //     s3obj
    //         .upload({ Body: fs.createReadStream(newPathName) })
    //         .on('httpUploadProgress', evt => {
    //             console.log(evt);
    //         })
    //         .send((err, data)=> {
    //             fs.unlink(file.path);
    //             if(err) {
    //                 reject(err);
    //             }
    //             resolve(data);
    //         });
    // });
}