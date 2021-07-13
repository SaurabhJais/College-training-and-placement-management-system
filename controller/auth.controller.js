let modal = require("../model/auth.modal")
let mail = require("../util/mail")
let pin = require("../util/randomPin")
let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")





exports.adminLogin = (req, res) => {
    let enteredUsername = req.body["username"]
    let enteredPassword = req.body["password"]
    let realUsername = process.env.ADMIN_USERNAME
    let realPassword = process.env.ADMIN_PASSWORD

    if (enteredUsername !== realUsername) {
        res.send("UserName or Password not matched")
    } else if (bcrypt.compareSync(enteredPassword, realPassword)) {
        res.cookie("token", jwt.sign({role: "admin"}, "This is secret"));
        res.redirect("/admin")
    } else {
        res.send("UserName or Password not matched")
    }
};





exports.confirmPin = (req, res) => {

    // Extract the data from the token
    let tokenData = jwt.verify(req.cookies['token'], "This is secret");
    let userEnteredPin = req.body["enteredPin"]

    console.log(tokenData)

    // Retrive the pin sent to verify the email
    modal.retrive_mail_verification_pin(tokenData.userId, tokenData.role).then((e) => {

        // If the pin matches to the user entered pin
        if (e === userEnteredPin) {

            tokenData["isEmailVerified"] = "true"
            res.cookie("token", jwt.sign(tokenData, "This is secret"), { maxAge: 1000000, sameSite: true })

            // Set pin to 0 and isEmailVerified to true
            modal.unset_pin_and_isEmailVerified(tokenData.userId, tokenData.role).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.send(err);
            })
        } else {
            res.send("Pin not matched");
        }
    }).catch((err) => {
        res.send(err)
    })
}




exports.login = (req, res) => {
    let role = req.params.role;
    let email = req.body.email;
    let password = req.body.password;

    modal.retrive_details_using_email(email, role).then((pass) => {
        // Extract the details into an object
        let obj = pass[0][0];

        // Convert the given object into a normal object
        obj = JSON.parse(JSON.stringify(obj))


        // check if there is some values in obj
        if (obj) {

            let passwordInDb = obj['password']

            // Compare the psssword in db and password entered by the user
            let result = bcrypt.compareSync(password, passwordInDb)

            // If password matches
            if (result) {
                // delete password from the obj so that you can send the object as jwt token
                delete obj['password'];

                let token = jwt.sign(new Object(obj), "This is secret");
                res.cookie("token", token, { maxAge: 100000000, sameSite: true, });

                // If email is not verified then update the mail confirmation code in
                // Database and then redirect the user to the /confirm-pin page

                if (obj["isEmailVerified"] !== "true") {

                    let newPin = pin.pin(6);
                    mail.sendPinToMail("mailthesaurabh@gmail.com", newPin);

                    modal.update_mail_confirmation_pin(obj.userId, obj.role, newPin).then(() => {
                        res.redirect("/confirm-pin")
                    }).catch((err) => {
                        res.send(err);
                    })
                } else {
                    res.redirect("/");
                }
            } else {
                res.send("email or password not matched")
            }
        } else {
            res.send("email or password not matched")
        }
    })
}


exports.signup = (req, res) => {
    let data = req.body;
    let sixDigitPin = pin.pin(6);
    let userId = pin.pin(16);
    let role = req.params.role;

    // Add role to the data so that it can we added to database
    data.role = role;
    data.isEmailVerified = false;
    data.mailConfirmationPin = sixDigitPin
    data.userId = userId;


    // Delete unwanted fields from the data
    delete data["checkbox"]
    delete data["confirmPassword"]

    data.password = bcrypt.hashSync(data.password, 4);


    modal.createUser(req.body).then(() => {

        res.cookie('token', jwt.sign({
            firstName: data.firstName,
            email: data.email,
            userId: userId,
            isEmailVerified: false,
            isLoggedIn: false,
            role: role
        }, "This is secret"), { maxAge: 1000000, sameSite: true })

        mail.sendPinToMail("mailthesaurabh@gmail.com", sixDigitPin)

    }).then(() => {

        res.redirect("/confirm-pin")
    }).catch((err) => {

        res.send(err)
    })

}


exports.resendMailPin = (req, res) => {
    let tokenData = jwt.verify(req.cookies["token"], "This is secret");
    let userId = tokenData.userId;
    let role = tokenData.role;
    let newPin = pin.pin(6);

    mail.sendPinToMail("mailthesaurabh@gmail.com", newPin);
    modal.update_mail_confirmation_pin(userId, role, newPin).then(() => {
        res.json({ "isSend": true });
    }).catch((err) => {
        res.send(err)
    });
}


exports.forgotPassword = (req, res) => {
    let role = req.query['u']
    let email = req.body["email"]
    modal.check_if_user_present(email, role).then((result) => {
        let obj = result[0][0]

        // Check if there is some data about the user
        if (obj) {
            let newPin = pin.pin(6);

            mail.sendPinToMail("mailthesaurabh@gmail.com", newPin);

            modal.update_mail_confirmation_pin(result[0][0]['userId'], role, newPin).then(() => {
                res.cookie('token', jwt.sign({
                    email: email,
                    userId: result[0][0]['userId'],
                    isEmailVerified: false,
                    role: role,
                    isForgotPassword: true
                }, "This is secret"));
                res.render("auth/pinConfirmationBox.ejs", { email: email })

            }).catch((err) => {
                res.send(err)
            })
        } else {
            res.send("There is no user present with email : " + email)
        }
    }).catch((err) => {
        res.send(err);
    })
}





exports.verifyForgotPassword = (req, res) => {
    let enteredPin = req.body["enteredPin"];
    let tokenData = jwt.verify(req.cookies['token'], "This is secret");


    modal.retrive_mail_verification_pin(tokenData["userId"], tokenData['role']).then((pinInDb) => {
        if (pinInDb === enteredPin) {
            tokenData.isEmailVerified = true;

            let token = jwt.sign(tokenData, "This is secret");
            res.cookie('token', token);
            res.redirect("/reset-password")
        } else {
            res.send("Pin not matched");
        }
    }).catch((err) => {
        res.send(err);
    })

}




exports.resetPassword = (req, res) => {

    let tokenData = jwt.verify(req.cookies['token'], "This is secret");



    if (req.body['password'] !== req.body['confirmPassword']) {
        res.send("Password not matched")
    }

    console.log(tokenData)
    if (!tokenData.isEmailVerified) {
        res.send("You are not authorized to do this operation")
    } else {
        let hashedPassword = bcrypt.hashSync(req.body['password'], 5);

        modal.update_user_password(tokenData.email, tokenData.userId, tokenData.role, hashedPassword).then(() => {
            res.cookie("token", "")
            res.send("Your password has been reset successfully! <br><br><br><br> Go to login page to login again.......");
        }).catch((err) => {
            res.send(err)
        })
    }
}