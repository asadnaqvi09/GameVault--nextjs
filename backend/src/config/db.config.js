import mongoose from 'mongoose';

const connectDB = async () => {
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbURI = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.vfxqpnz.mongodb.net/`;
    
    try {
        // Removed the second argument containing the deprecated options
        const conn = await mongoose.connect(dbURI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;