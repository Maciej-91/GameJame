import mongoose from "mongoose";
const DATABASE: string = String(process.env.DATABASE);

mongoose.connect(DATABASE)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));