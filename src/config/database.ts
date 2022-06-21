import mongoose from "mongoose";
  
async function Connect() {
    const url: any = process.env.DATABASE;

    try {
        await mongoose.connect(url);
    } catch (error) {

        console.log("Could not connect to database");

        process.exit(1);
    }
}

export default Connect;