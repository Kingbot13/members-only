const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    membership: Boolean
});

module.exports = mongoose.model('User', UserSchema);