# Node Module uploader-go-bucket

## Installation
```
$ npm install uploader-go-bucket
```

## Require modules
```javascript
let uploader = require('uploader-go-bucket'),
    s3Helper = uploader.s3Helper({ bucket: 'YOUR_BUCKET_NAME' });
```

## Simple Example

**Note:** if you use windows, install the program 'gitBash' that emulate the command line, is you use mac ou linux "YOU IS HAPPY"

Download this project by .zip, then unzip, and run in command line, in this steps:

#### Go to the directory wirh unziped files
```
$ cd uploader-go-bucket-master
```
#### Run npm
```
$ npm install
```
#### Go to the 'public' directory, and run node server
```
$ cd public/ && node server
```


# Available Methods


## uploader
* **params:** The configuration of own formidable module
   	* **uploadDir:** (required) The path local when the file gona be stored
* **req:** The 'request' of express module, to set in parse of formidable

```javascript
uploader
.uploader({uploadDir: './public/upload/'}, req)
.then(file=>{
    console.log(file); // the uploaded file
    // sent to your s3 bucket
}, err => {
    console.log(err);
});
```

## s3Helper
The instance with the configuration of the bucket

* **options:** (default {bucket:''}) The options of configuration for bucket, only the bucket name in the moment

### s3Helper Methods
* **uploadObject:** The method to uplaod file local from s3 Bucket
* **deleteObject:** The method to delete and list of objects fro Bucket
* **listObject:**  Get a list of objects from s3 Bucket
* **getObject:** Get a specific object by your Key from s3 Bucket


## uploadObject
* **file:** The object of uploaded file
* **pathName:** The name of the key to sent from s3
* **newPathName:** The path of the local file to upload from bucket
* **everDelete:** (default true) option to delete local file when is sent to bucket

```javascript
// with help in the example above
s3Helper
.uploadObject(file, `myFirstTest/${file.name}`, file.path)
.then(data=>{
    // put here your business rule
},err=>{
    console.log(err);
});
```

## deleteObject

Delete an Object from bucket s3, in the default bucket

* **Keys:** Array of object with the keys path which will be deleted

```javascript
s3Helper
.deleteObject([
    {Key: 'PARH_KEY_BUCKET'}
])
.then(data =>
{
    // put here your business rule
    console.log(data);
}, err => {
    console.log(err);
})
```
## listObject

List the Objects from bucket s3 by key informed in argument, in the default bucket

* **Key:** the path of object in Bucket

```javascript
s3Helper
.listObject('myFirstTest/')
.then( data => {
   // put here your business rule
   console.log(data);
}, err => {
    console.log(err);
});
```

## getObject

Get an Object from bucket s3, in the default bucket

* **Keys:** array of object with the keys path which will be deleted

```javascript
s3Helper
.getObject(`myFirstTest/${file.name}`)
.then(item => {
    // put here your business rule
    console.log(item);
}, err => {
    console.log(err);
});
```

## manageObject

Method to manage the images in bucket s3, remove from bucket all imagens that not equal to the image param informed

* **path:** the base path of the object in the bucket
* **image:** The Object with current image data to be keep
* **postImage:** The Object with image data sent in the request post
* **sessionImage:** The Object with image data store in the session

```javascript
s3Helper
.manageObject(
     `myFirstTest/${user._id}`, // the base path
     {
        "size": "(int) size of image", 
        "path": "(string) new name", 
        "name": "(string) original name", 
        "type":"(string)image/png"
     }, the cuttent imagen
     null, // post data
     null // session data
)
.then(promisses => {
    // put here your business rule
    console.log(promisses);
}, errors => {
    console.log(errors);
});
```
