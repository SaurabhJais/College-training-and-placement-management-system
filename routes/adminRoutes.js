let router = require("express").Router()
let mdlwr = require("../middleware/auth.middleware")
let adminModal = require("../model/admin.modal")
let mail = require("../util/mail")
let upload = require("../util/multer")
let notifModal = require("../model/notification.modal")

router.get("/", mdlwr.if_he_is_admin, (req, res) => {
    res.render("admin/adminDashBoard.ejs");
})



router.get("/release-notification", (req, res) => {
    res.render("admin/releaseNotif.ejs")
})




router.post("/release-notification", mdlwr.if_he_is_admin, upload.single("attachment"), (req, res) => {
    let data = req.body
    let filename = req.file.filename
    
    if(filename){
        data["filename"] = filename;
    }else{
        data["filename"] = ""
    }

    let currentDateTime = new Date().toLocaleString();

    data["postTime"] = currentDateTime;
    notifModal.save_notif_to_db(data).then((result) => {
        res.render("common/success.ejs", { heading: "Success", description: `Your notification <b><i>"${req.body['title']}"</b></i>  has been successfully released` })
    }).catch((err) => {
        res.send(err)
    });
})




router.get("/approve-pending-jobs", mdlwr.if_he_is_admin, (req, res) => {
    adminModal.getAllPendingJobs().then((result) => {
        let pendingJobs = result[0];
        res.render("admin/approvePendingJobs.ejs", { jobs: pendingJobs })
    })
})





router.get("/view-job-as-admin", mdlwr.if_he_is_admin, (req, res) => {
    let jobId = req.query['jobId'];
    adminModal.retriveFullJobDetails(jobId).then((result) => {
        res.render("admin/viewJob.ejs", { details: result[0][0] })
    })
})



router.get('/approve-job', mdlwr.if_he_is_admin, (req, res) => {
    let jobId = req.query["jobId"]
    adminModal.approveJob(jobId).then(() => {
        adminModal.retrive_email_of_hr(jobId).then((result) => {
            let mail_of_hr = result[0][0]["contactEmail"];
            mail.sendJobApproval(mail_of_hr);
            res.json({ isApproved: true })
        });
    }).catch((err) => {
        res.json(err)
    })
})




router.get("/view-all-jobs", mdlwr.if_he_is_admin, (req, res) => {
    adminModal.retrive_partial_details_of_all_jobs().then((result) => {
        res.render("admin/viewAllJobs.ejs", { jobs: result[0] })
    }).catch((err) => {
        res.send(err)
    })
})



module.exports = router;