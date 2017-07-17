# npm module uploader-go-bucket

## Installation
```
$ npm install uploader-go-bucket
```

## Simple Example
```javascript
let uploader = require('uploader-go-bucket'),
    s3Helper = uploader.s3Helper({ bucket: 'YOUR_BUCKET_NAME' });

uploader
.uploader({uploadDir: './public/upload/'}, req)
.then(file=>{
	console.log(file); // the uploaded file
	// sent to your s3 bucket
	/**
	s3Helper
	.uploadObject(file, `myTest/${file.name}`, file.path)
	.then(data=>{
		// put here your business rule
	},err=>{
		console.log(err);
	});
	*/
}, err => {
	console.log(err);
});
```
