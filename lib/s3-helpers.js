/*
| ----------------------------------------------------------------------
| Requires
| ----------------------------------------------------------------------
*/
let fs = require('fs');
let AWS = require('aws-sdk');
let s3 = new aws.S3();
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

    this.uploadObject = _uploadObject;

    this.deleteObject = _deleteObject;

    this.listObject = _listObject;

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

function _uploadObject(file, pathName, newPathName, everDelete = true)
{
    $this = this;

    return new Promise((resolve, reject) => {
        new AWS.S3({
            params: {
                Bucket: $this._options.bucket,
                ContentType: file.type,
                Key: pathName
            }
        })
        .upload({
            Body: fs.createReadStream(newPathName) 
        })
        .on('httpUploadProgress', evt => {
            console.log(evt);
        })
        .send((err, data)=> 
        {
            if( everDelete ){
                fs.unlink(file.path);
            }

            if(err) {
                console.log("reject promise uploadS3".red);
                console.log(err);
                console.log("reject promise uploadS3".red);
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}

/**
| --------------------------------------------------------------------------------
| Delete an Object from bucket s3, in the default bucket
| --------------------------------------------------------------------------------
* @param Keys array of object with the keys path which will be deleted
* @return Promise object
*/
function _deleteObject(Keys)
{
    $this = this;

    return new Promise( (resolve, reject) => {
        if( Keys.length == 0)
            resolve();

        s3.deleteObjects({
            Bucket: $this._options.bucket,
            Delete: {Objects: Keys}
        }, (err, data) => {
            if (err){
                console.log("reject promise deleteS3".red);
                console.log(err);
                console.log("reject promise deleteS3".red);
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
};

/**
| ----------------------------------------------------------------------------------
| List the Objects from bucket s3 by key informed in argument, in the default bucket
| ----------------------------------------------------------------------------------
* @param Key the path of object in Bucket
* @return Promise object
*/
function _listObject(Key)
{
    $this = this;

    return new Promise( (resolve,reject) => {
        s3.listObjects({
            Bucket: $this._options.bucket,
            Marker: Key, 
            Prefix: Key
        }, (err, data) => {
            if( err) {
                console.log("reject promise listS3".red);
                console.log(err);
                console.log("reject promise listS3".red);
                reject(err);
            }
            if( data != null ){
                resolve(data.Contents);
            }
            else{
                reject({errors:[{message: "Não encontrado Bucket!"}]});
            }
        });
    });
};