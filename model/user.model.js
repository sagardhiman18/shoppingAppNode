const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required",
        trim: true,
    },
    phone: {
        type: Number,
        required: "Phone number is required",
        trim: true
    },
    email: {
        type: String,
        required: "Email number is required",
        trim: true
    },
    password: {
        type: String,
        required: "Password number is required",
        trim: true
    },
    resetKey: {
        type: String,
        trim: true,
      },
    tokenExpireTime: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("user", UserSchema);