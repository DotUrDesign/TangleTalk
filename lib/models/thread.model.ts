import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },


  // This is the name of the property that you're defining in your MongoDB documents. The property is called "author".
  author: {
    type: mongoose.Schema.Types.ObjectId, // This specifies the type of the property. In this case, it's an "ObjectId", which is a unique identifier used in MongoDB to uniquely identify documents.

    ref: "User",  // This tells Mongoose that the "author" property is related to another collection named "User". It establishes a connection between the "author" property in this schema and documents in the "User" collection.

    required: true, // This indicates that the "author" property must be provided when creating a new document based on this schema. It's mandatory and cannot be left empty.

  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Thread", // This means that one thread can have multiple threads as children and what we are doing here is recursion. 
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;

/*
Thread Original ==> parent of thread comment 1 and 2
    -> Thread comment 1
    -> Thread comment 2  ==> parent of thread comment 3
        -> Thread comment 3

    
    So, its a multi-level commenting functionality...
*/