import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const threadSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => uuidv4(),
  },
  document: {
    type: String,
    required: true,
  },
  niveau: {
    type: String,
    required: true,
  },
  matiere: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  communitie: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: String, 
    required: true,
  }],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
