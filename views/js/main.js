let userObject;

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}




function decodeJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
        return null;
    }
}





// This function displays notifications to the homepage


(function () {
    if (location.pathname === "/") {
        let notifWrapper = document.getElementById("notifWrapper");

        fetch("/get-notifications").then(res => res.json()).then((data) => {
            data.forEach((item) => {
                let notifContainer = document.createElement("div");
                let topic = document.createElement("p");
                let info = document.createElement("p");
                let downloadBtn = document.createElement("a")

                notifContainer.className = "notifContainer"
                topic.className = "topic"
                info.className = "info"
                downloadBtn.className = "downloadBtn"

                topic.innerText = item['title']
                info.innerHTML = item['description'] + "<br><br>"
                downloadBtn.innerHTML = "Download"

                downloadBtn.href = "asset/" + item["filename"]
                downloadBtn.target = "_blank"
                if (item["filename"] === "") {
                    downloadBtn.style.display = "none"
                }

                notifContainer.append(topic);
                notifContainer.append(info);
                info.append(downloadBtn);
                notifWrapper.insertAdjacentElement("afterbegin", notifContainer)
            })
        })
    }


    setTimeout(() => {
        let notifContainer = document.querySelectorAll(".notifContainer")
        let topic = document.querySelectorAll(".topic")
        let info = document.querySelectorAll(".info")


        notifContainer.forEach((item) => {
            item.insertAdjacentHTML("afterbegin", "<i id='arrow-icon' class='fas fa-sort-down'></i>")
        })

        topic.forEach((item) => {
            item.addEventListener("click", (e) => {
                if (!e.srcElement.previousElementSibling.style.transform || e.srcElement.previousElementSibling.style.transform == "rotate(0deg)") {
                    e.srcElement.previousElementSibling.style.transform = "rotate(180deg) translateY(-50%)"
                } else {
                    e.srcElement.previousElementSibling.style.transform = "rotate(0deg)"
                }
                if (e.srcElement.nextElementSibling.style.display == "block") {
                    e.srcElement.nextElementSibling.style.display = "none"
                } else {
                    e.srcElement.nextElementSibling.style.display = "block"

                }
            })
        })
    }, 1000);
})()








function resendMailConfirmationCode() {

    console.log("resend called")
    fetch("/resend-mail-confirmation-pin", {
        method: "POST",
        body: { cookie: document.cookie }
    }).then((res) => res.json())
        .then((e) => console.log(e));
}



function approveJob() {
    // First convert the current url into URL object
    let jobId = new URL(location.href)

    fetch("/admin/approve-job" + jobId.search).then((res) => res.json()
    ).then((e) => {
        if (e.isApproved) {
            let approveBtnDiv = document.getElementById("approveBtnDiv");
            alert("You succesfully approved the job")
            approveBtnDiv.style.display = "none"
            window.open("/", "_self")
        } else {
            alert("some error occured")
        }
    })
}





