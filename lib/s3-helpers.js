/*
| ----------------------------------------------------------------------
| Requires
| ----------------------------------------------------------------------
*/
let fs = require('fs');
let AWS = require('aws-sdk');
/*
| ---------------------------------------------------------------------------------------
| Main function to start configurations
| the configuration will be informed in argument, e.g.:
| { bucket: '<NAME_BUCKET>'}
| ---------------------------------------------------------------------------------------
*/
function s3Helper(options = {})
{
    if( !(this instanceof s3Helper) ) return new s3Helper(options);
    
    this._options = options;

    this.getS3 = _getS3;

    this.uploadObject = _uploadObject;

    this.deleteObject = _deleteObject;

    this.listObject = _listObject;

    this.getObject = _getObject;

    this.manageObject = _manageObject;
    
    return this;
}

exports.s3Helper = s3Helper;

/**
| --------------------------------------------------------------------------------
| Get the loaded instance of the bucket
| --------------------------------------------------------------------------------
* @param options the custom options of this instance
* @return S3 object
*/
function _getS3(options = {}){
    if(this._options.accessKeyId){
        options.accessKeyId = this._options.accessKeyId;
    }
    if(this._options.secretAccessKey){
        options.secretAccessKey = this._options.secretAccessKey;
    }
    if (!this._options.httpOptions){
        options.httpOptions = {timeout: 0};
    }

    return new AWS.S3(options);
}

/**
| --------------------------------------------------------------------------------
| Upload an Object from bucket s3, in the default bucket
| --------------------------------------------------------------------------------
* @param file the object of uploaded file
* @param pathName the name of the key to sent from s3
* @param newPathName the path of the local file to upload from bucket
* @param everDelete option to delete local file when is sent to bucket
* @return Promise object
*/

function _uploadObject(file, pathName, newPathName, everDelete = true)
{
    $this = this;

    return new Promise((resolve, reject) => {
        $this.getS3({
            params: {
                Bucket: $this._options.Bucket,
                ContentType: file.type,
                Key: pathName
            }
        })
        .upload({Body: fs.createReadStream(newPathName)})
        .on('httpUploadProgress', evt => {
            console.log(evt);
        })
        .send((err, data)=> 
        {
            if( everDelete ){
                fs.unlink(file.path, ule => {
                    if (ule) console.log(`fail deleted ${file.path}`.red, ule);
                });
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
        if( Keys.length == 0 )
            return reject({'message': 'Nenhum Objeto para ser removido!'});

        $this.getS3()
        .deleteObjects({
            Bucket: $this._options.Bucket,
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
        $this.getS3()
        .listObjects({
            Bucket: $this._options.Bucket,
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

/**
| --------------------------------------------------------------------------------
| Get an Object from bucket s3, in the default bucket
| --------------------------------------------------------------------------------
* @param Keys array of object with the keys path which will be deleted
* @return Promise object
*/
function _getObject(Key)
{
    $this = this;

    return new Promise( (resolve, reject) => {
        $this.getS3()
        .getObject({
            Bucket: $this._options.Bucket,
            Key: Key
        }, (err, item) => 
        {
            if (err){
                console.log("reject promise getS3".red);
                console.log(err);
                console.log("reject promise getS3".red);
                reject(err);
            } 
            else {
                resolve(item);
            }
        });
    })
}

/**
 | --------------------------------------------------------------------------------
 | Method to manage the images in bucket s3, remove from bucket the images changed
 | --------------------------------------------------------------------------------
 * @param {String} path the path of the image to keep in the bucket
 * @param {Object|null} image the object with the data of the image
 * @param {String} image.path the new name of the image
 * @param {String} image.size the size of the imagen
 * @param {String} image.name the original name of the image
 * @param {String} image.type the ext of the image
 * @param {Object|null} postImage the image object sent in the post
 * @param {Object|null} sessionImage the image object storage in the session
 * @returns {Promise}
 */
function _manageObject(path, image, postImage, sessionImage)
{
    var $this = this;
    var promises = [];

    if( image != null )
    {
        $this.listObject(path).then(response =>
        {
            var Keys = [];
            response
            .filter(row => !( (new RegExp(image.path, 'i')).test(row.Key)) )
            .map(row=> Keys.push({Key: row.Key}));

            if( Keys.length > 0 ) {
                promises.push($this.deleteObject(Keys));
            }
        }, err => {
            console.log("reject promise _manageObject".red);
            console.log(err);
            console.log("reject promise _manageObject".red);
            Promise.reject([err]);
        });
    }

    if( (postImage == null && sessionImage == null) && image != null){
        promises.push($this.deleteObject([{Key: `${path}/${image.path}`}]));
    }

    return Promise.all(promises).then( values => {
        Promise.resolve(values);
    }, err => {
        Promise.reject(err);
    });
}