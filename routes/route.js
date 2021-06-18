let express = require("express")
let router = express.Router()
let controller = require("../controller/auth")
let model = require("../model/auth")
let mail = require("../util/mail")
const Joi = require("joi")
const RANDOM_PIN = require("../util/randomPin")
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken")


router.get("/", (req, res) => {
    console.log(isUserVerified, role, isLoggedIn)
    res.render("homepage")
})

router.get("/student-login", (req, res) => {
    res.render("studentlogin.ejs")
})

router.get("/hr-login", (req, res) => {
    res.render("hrlogin.ejs")
})

router.get("/login", (req, res) => {
    res.render("login.ejs")
})

router.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

router.get("/student-signup", (req, res) => {
    res.render("studentSignup.ejs")
})

router.get("/hr-signup", (req, res) => {
    res.render("hrSignup.ejs")
})

router.get("/contact-us", (req, res) => {
    res.render("contact.ejs")
})


router.get("/confirm-pin", (req, res) => {
    if (isUserVerified == "Yes") {
        res.redirect("/404-error")
    } else {
        res.render("confirmPin.ejs")
    }
})





router.post("/confirm-pin", (req, res) => {
    let ENTERED_PIN = req.body["enteredPin"];
    let token = req.cookies['token'];
    let tokenData = JWT.decode(token, "This is a jwt secret");

    console.log(tokenData)
    model.retrive_user_by_uID(tokenData.uID).then((result) => {
        console.log(result)
        let PIN_IN_DB = result[0][0]["verificationPin"]
        let ROLE_IN_DB = result[0][0]["role"]

        if (PIN_IN_DB == ENTERED_PIN) {

            model.make_user_authorized(tokenData.uID).then(() => {
                let updated_token = JWT.sign({
                    name: tokenData.name,
                    email: tokenData.email,
                    uID: tokenData.uID, 
                    role: ROLE_IN_DB,
                    isAuthorized: "Yes",
                    isLoggedIn: "Yes"
                }, "This is a jwt secret", { expiresIn: "2 days" })
                res.cookie("token", updated_token, { httpOnly: true });
                res.redirect("/")
            })
        } else {
            res.send("Pin not matched")
        }

    }).catch((err) => {
        console.log(err)
    })
})






router.post("/signup/:role", (req, res) => {
    let data = req.body;
    let role = req.params.role

    let randomPin = RANDOM_PIN.pin(6);
    let uniqueId = `${RANDOM_PIN.pin(15)}`;


    // Check if Password does not match

    // If password does not match then send a resoponse 
    // to fronted that the password does not match

    // If both passwords are same then delete the confirm password field
    
    if (data.password !== data.confirmPassword) {
        res.send("Password does not match")
    } else {
        delete data.confirmPassword;
        delete data.checkbox;
    }

    let joiSchema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().min(10).max(13).required(),
        personalAddress: Joi.string().min(3).max(250),
        companyName: Joi.string().min(3).max(20).required(),
        companyAddress: Joi.string().max(250),
        city: Joi.string().max(30),
        state: Joi.string().max(20),
        pinCode: Joi.string().length(6),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })


    joiSchema.validateAsync(data).then((result) => {

        // hash the password
        data.password = bcrypt.hashSync(data.password, 4);

        // Add some temporary information to the students table
        data.uID = uniqueId;
        data.isAuthorized = "false";
        data.verificationPin = `${randomPin}`;
        data.role = role




        // Insert User data into the database
        model.createUser(data).then(() => {

            mail.sendPinToMail("mailthesaurabh@gmail.com", randomPin, data.firstName)


            // Sign a jwt from User's name, email and password
            let token = JWT.sign(
                { 
                    name: data.firstName, 
                    email: data.email, 
                    uID: uniqueId,
                    isAuthorized: "No", 
                    role: role, 
                    isLoggedIn: "No" 
                },
                "This is jwt secret",
                { expiresIn: "2d" }
            );

            // Send a cookie to the user
            res.cookie("token", token, { httpOnly: true });

            // Redirect to the pin confirmation page
            res.redirect("/confirm-pin")
        }).catch((err) => {
            res.json({ message: err })
        })

    }).catch((err) => {
        res.json({ message: err })
    })


})



module.exports = router;