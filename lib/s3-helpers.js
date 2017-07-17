function Helper(options = {})
{
    // if( !(this instanceof Helper) ) return new Helper(options);
    console.log('options', options);
    this.log = function(message = 'seted default'){
        console.log(`default ${message}`)
    };

    return this;
}

exports.Helper = Helper;