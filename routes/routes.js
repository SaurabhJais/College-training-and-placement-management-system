let express = require("express")
let router = express();
let jwt = require("jsonwebtoken")
let hrRoutes = require("./hrRoutes")
let authRoutes = require("./normalRoutes")
let adminRoutes = require("./adminRoutes")
let notifModal = require("../model/notification.modal")
let path = require("path")


router.get("/", (req, res) => {
    if (req.cookies["token"]) {
        let tokenData = jwt.verify(req.cookies["token"], "This is secret");
         if (tokenData.role == "student") {
            res.render("student/student-dashboard.ejs", { name: tokenData.firstName });
        } else if (tokenData.role == "hr") {
            res.redirect("/hr");
        } else if (tokenData.role == "admin") {
            res.redirect("/admin")
        } else {
            res.redirect("/404-error")
        }
    } else {
        res.render("homepage.ejs");
    }
}) 



router.get("/get-notifications", (req, res) => {

    notifModal.retrive_notif().then((result) => {
        let data = result[0];
        res.json(data);
    }).catch((err) => {
        res.send(err);
    })
})



router.get("/asset/:filename", (req, res) => {
    let filename = req.params.filename;
    console.log(path.join(__dirname, "util", filename))
    res.sendFile(path.join(__dirname, "../util/notification-uploads", filename))
})


router.use("/admin", adminRoutes)
router.use("/hr/", hrRoutes);
router.use("/", authRoutes);


module.exports = router;