import mongoose from "mongoose";
async function connectDB(){
    await  mongoose.connect(process.env.MONGO_URI)
    console.log("DataBase is connected")
    // const schema = mongoose.Schema({

    // })
    // const Model = mongoose.model('Data',schema,'Data')
    // const result = await Model.find()
}
export default connectDB