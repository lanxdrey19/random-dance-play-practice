import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: (tags) => tags.length > 0,
      message: "At least one tag is required",
    },
  },
  offset: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Song = mongoose.models.Song || mongoose.model("Song", songSchema);

export default Song;
