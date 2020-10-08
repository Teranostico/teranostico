const mongoose = require("mongoose");
const host = process.env.DB_HOST || "127.0.0.1";
// const dbURL = `mongodb://${host}/teranostico-app`;
const dbURL = 'mongodb+srv://jorge:vk388nii@cluster0.tirpz.mongodb.net/jorge?retryWrites=true&w=majority';

const readLine = require("readline");

const connect = () => {
    //connect to mongo
    setTimeout(
        () =>
            mongoose.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }),
        1000
    );
};

//Monitors for a successful connection through Mongoose
/**Here we have a set of events that we can listen to:
 *https://mongoosejs.com/docs/connections.html#connection-events
 */
//-------------------------------------------------------------
mongoose.connection.on("connected", () => {
    console.log(`Mongoose connected to ${dbURL}`);
});

//error
mongoose.connection.on("error", (err) => {
    console.log("error: " + err);
    return connect();
});

//Disconnected
mongoose.connection.on("disconnected", () => {
    console.log("disconnected");
});
//-------------------------------------------------------------

if (process.platform === "win32") {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.on("SIGINT", () => {
        process.emit("SIGINT");
    });
}

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};
//for nodemon in case so
process.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => {
        process.kill(process.pid, "SIGUSR2");
    });
});
process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => {
        process.exit(0);
    });
});

//Heroku uses SIGTERM to listen for
process.on("SIGTERM", () => {
    gracefulShutdown("Heroku app shutdown", () => {
        process.exit(0);
    });
});

connect();

//----------------------------
//This is required to create the model schemas
require("./User");
require("./Doctor");
require("./Patient");
require("./FormPatient");
require("./FinalReport");
//---------------------------