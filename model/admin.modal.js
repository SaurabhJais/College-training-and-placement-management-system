let db = require("../util/db")


exports.getAllPendingJobs = (howMuch) => {
    let query = "SELECT jobId, jobTitle, payScale, companyName, jobLocation, status, lastDateToApply FROM jobs WHERE status = 'pending'";

    // Concatenate limit if provided
    query += howMuch ? `LIMIT ${howMuch}` : "";

    return db.execute(query);
}




exports.approveJob = (jobId) => {
    let query = "UPDATE jobs SET status = 'approved' WHERE jobId = " + jobId;
    return db.execute(query);
}


exports.retriveFullJobDetails = (jobId) => {
    return db.execute("SELECT * FROM jobs WHERE jobId = " + jobId)
}


exports.retrive_partial_details_of_all_jobs = () => {
    return db.execute("SELECT jobId, jobTitle,  companyName,  status, lastDateToApply FROM JOBS")
}

exports.retrive_email_of_hr = (jobId) => {
    return db.execute("SELECT contactEmail FROM jobs WHERE jobId = " + jobId)
}
