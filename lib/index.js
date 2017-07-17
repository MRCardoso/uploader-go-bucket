let uploader = require('./uploader-form');
let s3Helpers = require('./s3-helpers');

module.exports = Object.assign({}, uploader, s3Helpers);