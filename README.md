# npm module uploader-go-bucket

## Installation
```
$ npm install uploader-go-bucket
```

## Simple Example
```javascript
let uploader = require('uploader-go-bucket');

uploader
.uploader({uploadDir: './public/upload/'}, req)
.then(file=>{
    console.log(file); // the uploaded file
    // sent to your s3 bucket
}, err => {
    console.log(err);
});
```

## uploader
* **params:** The configuration of own formidable module
   	* **uploadDir:** (required) The path local when the file gona be stored
* **req:** The 'request' of express module, to set in parse of formidable


## s3Helper
The instance with the configuration of the bucket

* **options:** (default {bucket:''}) The options of configuration for bucket, in the moment only set is bucket name

### s3Helper Methods
* **uploadObject:** The method to uplaod file local from s3 Bucket
* **deleteObject:** The method to delete and list of objects fro Bucket
* **listObject:**  Get a list of objects from s3 Bucket
* **getObject:** Get a specific object by your Key from s3 Bucket


## uploadObject
* **file:** The object of uploaded file
* **pathName:** The name of the key to sent from s3
* **newPathName:** The path of the local file to upload from bucket

```javascript
// with help in the example above
let uploader = require('uploader-go-bucket'),
    s3Helper = uploader.s3Helper({ bucket: 'YOUR_BUCKET_NAME' });

s3Helper
.uploadObject(file, `myFirstTest/${file.name}`, file.path)
.then(data=>{
    // put here your business rule
},err=>{
    console.log(err);
});
```

## deleteObject
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
