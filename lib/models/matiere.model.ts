import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const matiereSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => uuidv4(),
  },
  niveau: {
    type: String,
    required: true,
  },
  codematiere: {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
});

const Matiere = mongoose.models.Matiere || mongoose.model("Matiere", matiereSchema);

export default Matiere;
