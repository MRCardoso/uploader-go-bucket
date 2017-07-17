
/**
| ----------------------------------------------------------------------
| Upload file sent by front-end and store locally the fale,
| according the 'uploadDir' key in params argument
| ----------------------------------------------------------------------
| @param params Object with the params pass to formidable module
* @param req
* @return Promise
*/
exports.uploader = function(params = {}, req)
{
	console.log("Start promise".blue);
    return new Promise((resolve, reject) => {
        params = Object.assign({}, {
			encoding: 'utf-8',
			keepExtensions: true
		}, params);
        
        let fs = require('fs');
        let formidable = require('formidable');
        let form = new formidable.IncomingForm(params);

        if (!fs.existsSync(params.uploadDir)){
			console.log("create path to store file uploaded".blue);
            fs.mkdirSync(params.uploadDir);
        }
        
        form.on('file', function(name, file)
        {
			console.log("finish promise".green);
            resolve(file);
        })
        .parse(req, function(err, fields, files)
        {
            if(err)
            {
				console.log("reject promise".red);
                reject(err);
            }
        });
    });
};