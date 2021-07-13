let db = require("../util/db")


let jobSchema = `
  jobId varchar(255),
  userId varchar(255) NOT NULL,
  jobTitle varchar(255),
  payScale varchar(255),
  companyName varchar(255),
  bondYears varchar(255),
  companyLocation varchar(255),
  jobLocation varchar(255),
  trainingPeriod varchar(255),
  companyType varchar(255),
  lastDateToApply varchar(255),
  contactEmail varchar(255),
  companySector varchar(255),
  numberOfEmployees varchar(255),
  eligibleDepartments varchar(255),
  description varchar(255),
  status varchar(255),
  FOREIGN KEY (userId) REFERENCES hr(userId)
`




exports.addJob = (jobData) => {
  return db.execute("CREATE TABLE IF NOT EXISTS jobs ( " + jobSchema + " );").then(() =>
    db.execute("INSERT into jobs ( "
      + Object.keys(jobData)
      + " ) VALUES ( "
      + Object.values(jobData).map((e) => `'${e}'`).join()
      + " )")
  )
}




exports.retrivePartialJobDetails = (userId) => {
  return db.execute("CREATE TABLE IF NOT EXISTS jobs ( " + jobSchema + " );").then(() =>
    db.execute("SELECT jobId, jobTitle, payScale, companyName, jobLocation, status, lastDateToApply FROM jobs where userId = " + `${userId}`)
  )
}

exports.retriveFullJobDetails = (jobId) => {
  return db.execute("SELECT * FROM jobs WHERE jobId = " + jobId)
}


