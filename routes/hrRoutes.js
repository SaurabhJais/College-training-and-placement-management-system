let router = require("express").Router()
let mdlwr = require("../middleware/auth.middleware")
let hrModal = require("../model/hr.modal")
let pin = require("../util/randomPin")
let jwt = require("jsonwebtoken")




router.get("/", (req, res) => {
    if (req.cookies['token']) {
        let tokenData = jwt.verify(req.cookies['token'], "This is secret")
        console.log(tokenData)

        hrModal.retrivePartialJobDetails(tokenData.userId).then((result) => {
            let jobs = result[0];
            res.render("hr/hr-dashboard.ejs", { tokenData, jobs })

        }).catch((err) => {
            res.send(err)
        })
    } else {
        res.send("Token does not found")
    }
})



router.get("/add-job", mdlwr.if_he_is_hr, (req, res) => {
    res.render("hr/addJob.ejs")
})



router.post("/add-job", mdlwr.if_he_is_hr, (req, res) => {
    let data = req.body


    data.userId = jwt.verify(req.cookies['token'], "This is secret")['userId']
    data.jobId = pin.pin(10);
    data.status = "pending";

    hrModal.addJob(data).then((result) => {
        res.render("common/success.ejs", {
            heading: "Your Job has been added successfully",
            description: `This is a dummy description This 
            is a dummy description This is a dummy 
            description This is a dummy description This
            is a dummy description This is a dummy description
            This is a dummy description This is a dummy description `
        })
    }).catch((err) => {
        res.send(err);
    })

})



router.get("/view-job", (req, res) => {
    let jobId = req.query['jobId']
    console.log(jobId)
    hrModal.retriveFullJobDetails(jobId).then((result) => {
        let details = result[0][0]
        console.log(details)
        res.render("hr/showJobDetails.ejs", { details: details })
    })

})



module.exports = router