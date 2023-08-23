import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,

  // This means that one user can have multiple references to specific threads stored in the databases. 
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});



/*
Why are we writing the below line this way ??

--> For the first time, the mongoose models is not going to exist so it's going to fall back in creating a mongoose model user based on the user schema. But every second time we call, it's already going to have the mongoose model in the database. 
*/
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
