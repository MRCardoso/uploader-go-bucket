function Helper(options = {})
{
    if( !(this instanceof Helper) ) return new Helper(options);
    console.log('options', options);
    this.log = function(messge = 'seted default'){
        console.log(`default ${message}`)
    }
}

exports.Helper = Helper;