let express = require("express")
let router = express.Router()


router.get("/", (req, res) => {
    res.render("homepage")
})

router.get("/student-login", (req, res)=>{
    res.render("studentlogin.ejs")
})

router.get("/hr-login", (req, res)=>{
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







router.post("/", (req, res) => {
    console.log(req.body)
    res.redirect("/")
})



module.exports = router;