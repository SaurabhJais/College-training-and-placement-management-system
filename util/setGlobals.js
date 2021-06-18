let jwt = require("jsonwebtoken");


let setGlobals = (req, res, next) => {
    if (req.cookies["token"]) {
        let tokenData = jwt.decode(req.cookies["token"], "This is a jwt secret");
        global.isUserVerified = tokenData["isAuthorized"]
        global.role = tokenData["role"]
        global.isLoggedIn = tokenData["isLoggedIn"]
    } else {
        global.isUserVerified = "No"
        global.role = null
        global.isLoggedIn = "No"
    }
    next();
}


module.exports = setGlobals;
