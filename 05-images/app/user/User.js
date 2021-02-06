const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: value => value.includes('@'),
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
    
  },
  token: {
    type: String,
    default: ""
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;