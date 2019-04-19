/**
 * Users model events
 */

import {EventEmitter} from 'events';
var UsersEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UsersEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Users) {
  for(var e in events) {
    let event = events[e];
    Users.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    UsersEvents.emit(event + ':' + doc._id, doc);
    UsersEvents.emit(event, doc);
  };
}

export {registerEvents};
export default UsersEvents;
