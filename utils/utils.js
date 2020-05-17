const sendJSONresponse = function (res, status, content) {
    //Reminder: those methods are used all over the code, modification may cause unseen bad behavours
    res.status(status);
    res.json(content);
};

module.exports = { sendJSONresponse };
