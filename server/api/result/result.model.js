import mongoose from 'mongoose';
import {registerEvents} from './result.events';

var ResultSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ResultSchema);
export default mongoose.model('Result', ResultSchema);
