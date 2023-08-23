import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export const connectToDB = async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set("strictQuery", true);
  /*

  In Mongoose, by default, when you perform queries on a MongoDB collection using Mongoose models, Mongoose allows you to pass in properties that are not defined in the schema. These properties are often referred to as "virtual properties" and are not persisted to the database. However, this behavior can sometimes lead to unintended behavior or bugs, as queries might be based on properties that are not part of the schema.

By enabling "strict query" mode with mongoose.set("strictQuery", true), you instruct Mongoose to reject queries that include properties not defined in the schema. This can help catch potential issues early in your application's development by ensuring that queries adhere to the defined schema.

 It's a useful feature for maintaining data consistency and reducing the likelihood of unexpected behavior due to mismatched query properties.

  */

  if (!process.env.MONGODB_URL) return console.log("Missing MongoDB URL");

  // If the connection is already established, return without creating a new connection.
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  // if we are not connected, then we will try to establish a connection via a try and catch block.
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true; // Set the connection status to true
    console.log("MongoDB connected");
    
  } catch (error) {
    console.log(error);
  }
};