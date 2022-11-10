const mongoose = require("mongoose");

// required: 무조건 필요한지
const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    // required: true,
  },
  interviewers: {
    type: String,
    // required: true,
  },
  interviewees: {
    type: String,
    // required: true,
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("rooms", roomSchema);
