import mongoose from "mongoose";
import colors from "colors";

const connectDB = async function () {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(
            `Connected To Database ${mongoose.connection.host}`.bgMagenta.white  
        );   //connected to mongoose database
    } catch (error) {
        console.log(`MongoDB Error ${error}`.bgRed.white);
    }
};

export default connectDB;
