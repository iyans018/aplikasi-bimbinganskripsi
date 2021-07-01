const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter an username!'],
        unique: true
    },
    nama: {
        type: String,
        required: [true, 'Tolong masukan nama!']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [6, 'Minimum password length is 6 characters']
    },
    role: String
}, { timestamps: true });

// Static method to login user
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });
    if (user) {
        if (user.password === password) {
            return user;
        }
        throw Error('incorrect password!');
    }
    throw Error('incorrect username!');
}

const User = mongoose.model('User', userSchema);

module.exports = User;