let multer = require("multer")
let path = require("path")


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, 'notification-uploads'))
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})


let maxSize = 1 * 1024 * 1024;



module.exports =  multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var fileTypes = /jpg|png|pdf|docx/;
        var mimeType = fileTypes.test(file.mimetype);
        var extName = fileTypes.test(path.extname(file.originalname).toLowerCase())

        if(mimeType && extName){
            return cb(null, true)
        }

        return cb("Error: File upload only supports the following filetypes - " + fileTypes)
    },
    limits: { fileSize: maxSize }
})