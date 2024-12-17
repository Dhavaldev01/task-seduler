const mongoose = require('mongoose');

const ConncetDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI ,{
            // useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database Connected")
    } catch (error) {
        console.error("MongoDb Connection Error" , error);
        process.exit(1);   
    }
};


module.exports = ConncetDB;