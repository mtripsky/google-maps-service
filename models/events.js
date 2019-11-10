const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create EventSchema
const EventSchema = new Schema({
  dateTime: {
      type: Date,
      required: [true, "Time field is required"]
  },
  source: {
      type: String,
      reuquired: [true, "Source field is required"]
  },
  content: {
    type: String,
    required: [true, "Content field is required"]
  }
})

const Event = mongoose.model('event', EventSchema);

module.exports = Event;
