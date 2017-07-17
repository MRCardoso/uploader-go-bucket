function Helper(options = {})
{
    console.log('options', options, this instanceof Helper);
    this.log = function(messge = 'seted default'){
        console.log(`default ${message}`)
    }
}

exports.Helper = Helper;