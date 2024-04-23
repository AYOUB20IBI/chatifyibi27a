const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    reference: { type: String, required: true ,unique: true },
    username: String,
    email: { type: String, unique: true },
    name: String,
    online: { type: Boolean, default: false },
    password: String,
    image: String,
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
