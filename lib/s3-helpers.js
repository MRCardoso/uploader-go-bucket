/*
| ---------------------------------------------------------------------------------------
| Main function to start configurations
| the configuration will be informed in argument, e.g.:
| { bucket: '<NAME_BUCKET>'}
| ---------------------------------------------------------------------------------------
*/
function s3Helper(options = {bucket:''})
{
    if( !(this instanceof s3Helper) ) return new s3Helper(options);
    
    this._options = options;

    this.uploadObject = uploadObject;

    return this;
}

exports.s3Helper = s3Helper;

/**
| --------------------------------------------------------------------------------
| Upload an Object from bucket s3, in the default bucket
| --------------------------------------------------------------------------------
* @param file the object of uploaded file
* @param pathName the name of the key to sent from s3
* @param newPathName the path of the local file to upload from bucket
* @return Promise object
*/

function uploadObject(file, pathName, newPathName, everDelete = true)
{
    let bucketName = this._options.bucket;
    return new Promise((resolve, reject) => {
        let fs = require('fs');
        let AWS = require('aws-sdk');
        let s3obj = new AWS.S3({
            params: {
                Bucket: bucketName,
                ContentType: file.type,
                Key: pathName
            }
        });
        s3obj
            .upload({ Body: fs.createReadStream(newPathName) })
            .on('httpUploadProgress', evt => {
                console.log(evt);
            })
            .send((err, data)=> 
            {
                if( everDelete ){
                    fs.unlink(file.path);
                }
                
                if(err) {
                    reject(err);
                }
                resolve(data);
            });
    });
}