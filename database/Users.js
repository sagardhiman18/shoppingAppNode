const getDB = require("./db").getDB;

class Users {
    register(user) {
        const db = getDB();

        return db.collection("users").insertOne(user);
    }

    login(user) {
        const db = getDB();

        return db.collection("users").find({}).toArray();
    }
}

module.exports = Users;