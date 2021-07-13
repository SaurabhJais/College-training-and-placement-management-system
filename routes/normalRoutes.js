let express = require("express")
let router = express();
let jwt = require("jsonwebtoken")
let authController = require("../controller/auth.controller")



router.get("/login", (req, res) => {
    res.render("auth/login.ejs")
})

router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs")
})


router.get("/student-login", (req, res) => {
    res.render("auth/studentLogin.ejs")
})


router.get("/student-signup", (req, res) => {
    res.render("auth/studentSignup.ejs")
})

router.get("/hr-login", (req, res) => {
    res.render("auth/hrLogin.ejs")
})


router.get("/hr-signup", (req, res) => {
    res.render("auth/hrSignup.ejs")
})


router.get("/admin-login", (req, res) => {
    res.render("auth/adminLogin.ejs")
})

router.get("/forgot-password", (req, res) => {
    res.render("auth/forgotpassword.ejs")
})


router.get("/confirm-pin", (req, res) => {
    let tokenData = jwt.verify(req.cookies['token'], "This is secret");
    res.render("auth/confirmPin.ejs", { name: tokenData.firstName, email: tokenData.email })
})


router.get("/reset-password", (req, res) => {
    res.render("auth/resetPassword.ejs")
})


router.all("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
})




router.post("/admin-login", authController.adminLogin)
router.post("/confirm-pin", authController.confirmPin)
router.post("/login/:role", authController.login)
router.post("/signup/:role", authController.signup)
router.post("/resend-mail-confirmation-pin", authController.resendMailPin)
router.post("/forgot-password/", authController.forgotPassword)
router.post("/verify-forgot-password", )
router.post("/reset-password", authController.resetPassword)


module.exports = router;