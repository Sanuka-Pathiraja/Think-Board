import mongoose from "mongoose";

//create a schema 
//you would create a model based off that schema

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type: String,
        required:true,
    },
},
    {timestamps:true}
);

const note = mongoose.model("Note",noteSchema);

export default note;
