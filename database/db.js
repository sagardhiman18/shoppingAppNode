const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://admin:admin@cluster0.4zdia.mongodb.net/shoppingApp?retryWrites=true&w=majority"
    )
        .then((result) => {
            callback(result);
            _db = result.db();
            console.log("connection established");
        })
        .catch((error) => {
            console.log(error);
        })
};

const getDB = () => {
    if(_db) {
        return _db;
    }
    throw "No Database established";
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;