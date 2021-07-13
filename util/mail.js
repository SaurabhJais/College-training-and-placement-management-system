let nm = require("nodemailer")



function sendMail(to, subject = "", mailData) {
    let transport = nm.createTransport({
        service: "gmail",
        auth: {
            user: "jsaurabh1122@gmail.com",
            pass: "inkfuamzlxdsjwyk"
        },
    })

    let mailOption = {
        from: "jsaurabh1122@gmail.com",
        to: to,
        subject: subject,
        html: mailData
    }

    return transport.sendMail(mailOption)
}


function verification_Mail_Template(to, pin, name = "User") {
    let subject = "Pin Verification"
    let mailData = `
    Hello ${name}, <br><br>

    You registered an account on ECC training and Placement portal, 
    before being able to use your account you need to verify that 
    this is your email address is yours.

    <br>
    Your Six digit pin is: 
    <span style="font-size: 30px; vertical-align: center"><b>${pin}</b></span>
    
    <br><br>Kind Regards, ECC`;
    return sendMail(to, subject, mailData)
}



function job_approval_mail_template(to, name = "") {
    let subject = "Job Approval";
    let mailData = `
    <!DOCTYPE html>
<html>
<body style="margin:0;padding:0;">
    <div style="background:#fff">
        <div style="max-width:100%;margin:0px auto;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%; background-color:#fff;">
                <tbody>
                    <tr>
                        <td>
                            <div style="max-width:100%;box-sizing:border-box; background:#161616">
                                <div style="width:100%;max-width:575px;min-width:300px;margin:auto;text-align:center;padding:15px">
                                    <img src="https://img-premium.flaticon.com/png/512/3751/premium/3751903.png?token=exp=1625356778~hmac=db4267f0138e89a67e9bcd26e1a366f7" style="height: 110px;">
                                </div>
                                <div style="width:100%;max-width:575px;min-width:300px;background:#fff;margin:auto;box-sizing:border-box;border-radius:4px;border-bottom-left-radius:0;border-bottom-right-radius:0;padding:50px 30px 10px;">
                                    <h1 style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:18px;font-weight:bold;margin-top:0;text-align:left">
                                       Ewing christian college<br>Allahabad INDIA
                                    </h1>
                                    <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                                       Your job has been successfully approved by the college administration. Now students can apply for your opening.
                                    </p>                                   
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="width:100%;max-width:575px;min-width:300px;margin-left:auto;margin-right:auto; box-sizing:border-box;border-radius:4px;border-top-left-radius:0;border-top-right-radius:0;padding:10px 30px 50px; box-shadow: 5px 5px 5px #dadada;">                          

                                <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                                    Thanks, ECC
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>       
        
        <div style="max-width:100%;margin:0px auto;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                <tbody>
                    <tr>
                        <td>
                            <div style="width:100%;max-width:575px;min-width:300px;margin:auto;box-sizing:border-box;padding-top:20px;padding-bottom:20px;padding-left:15px;padding-right:15px;">
                                <p style="text-align:center; font-family:verdana;">
                                    <a href="#" style="text-align:center;font-size:13px;line-height:1.5;color:#999999; text-decoration: none; color: cornflowerblue;     display: flex; align-items: center; justify-content: center;">
                                        © 2021 T&P department of ECC</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
    `;

    return sendMail(to, subject, mailData)
}


module.exports = {
    sendPinToMail: verification_Mail_Template,
    sendJobApproval: job_approval_mail_template
}