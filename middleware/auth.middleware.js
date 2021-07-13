const Joi = require("joi");
const jwt = require("jsonwebtoken");




exports.if_he_is_hr = (req, res, next) => {
    let token = req.cookies['token']
    if(token){
      let tokenData = jwt.verify(token, "This is secret");
      if(tokenData.role == "hr"){
          next();
      }else{
          res.send("You are not authorized to continue...")
      }
    }else{
        res.redirect("/")
    }
}




exports.if_he_is_admin = (req, res, next) => {
    let token = req.cookies['token'];
    if(token){
        let tokenData = jwt.verify(token, "This is secret")
        if(tokenData.role == "admin"){
            next();
        }else{
            res.send("You are not authorized to continue....")
        }
    }else{
        res.redirect("/")
    }
}



exports.validateSignup = (req, res, next) => {

    //  Extract the data recieved by the route
    let data = req.body;

    // Create a Joi object and the validate it using validateAsync 
    Joi.object({
        firstName: Joi.string().max(100).min(2).required(),
        lastName: Joi.string().max(100).min(2).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().length(10).required(),
        personalAddress: Joi.string().max(100).min(2).required(),
        city: Joi.string().max(30).min(2).required(),
        state: Joi.string().max(30).min(2).required(),
        pinCode: Joi.string().length(6).required(),
        password: Joi.string().alphanum().min(8).max(50).required(),
        confirmPassword: Joi.ref("password"),
        checkbox: Joi.string().equal("on")
    }).validateAsync(data).then((result) => {

        // If there is any result then call the next function
        if (result) {
            next();
        }
    }).catch((err) => {

        // Extract the error message 
        let errorMessage = err["details"][0]["message"]

        // Check if password are equal or not (Basically 
        // we are making a customized error message if 
        // passwords do not match)

        if (errorMessage == '"confirmPassword" must be [ref:password]') {
            res.send("Passwords are not equal")
        } else {
            res.send(errorMessage)
        }
    })
}

