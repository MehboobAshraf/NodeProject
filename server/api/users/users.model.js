import mongoose from 'mongoose';
import {registerEvents} from './users.events';
var crypto = require('crypto');
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: String
});

registerEvents(userSchema);
export default mongoose.model('Users', userSchema);
