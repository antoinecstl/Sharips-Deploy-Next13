import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  onboarded: {
    type: Boolean,
    default: false,
  },
  communitie: {
      type: String,
      required: true,
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
