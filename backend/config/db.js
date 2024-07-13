import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";
// const dotenv = require('dotenv');

// dotenv.config();

// const connectDB = async () =>
// {
//     try
//     {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB Connected');
//     } catch (error)
//     {
//         console.error(error.message);
//         process.exit(1);
//     }
// };

const connectDB = async () =>
{
    try
    {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error)
    {
        console.log("MONGODB  connection Failed", error);
        process.exit(1);
    }
}

export default connectDB;

// module.exports = connectDB;

