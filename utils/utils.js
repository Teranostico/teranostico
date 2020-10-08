const sendJSONresponse = function (res, status, content) {
    //Reminder: those methods are used all over the code, modification may cause unseen bad behavours

    res.status(status);
    res.json(content);
};


const isAdmin = function (req, res, next) {
    //console.log(req.user)
    if (req.user.level === "admin")
        next();
    else sendJSONresponse(res, 400, { msg: "you must have admin level to access this resource" })
};



module.exports = { sendJSONresponse, isAdmin };
