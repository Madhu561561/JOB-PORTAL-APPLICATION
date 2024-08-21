import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        //creating schema  name:jobSchema
        company: {
            //now create objects
            type: String,
            required: [true, "Company name is required"],
        },
        position: {
            type: String,
            required: [true, "Job position is required"],
            maxlength: 100,
        },
        status: {
            type: String,
            enum: ["pending", "reject", "interview"], //enum is array
            default: "pending",
        },
        workType: {
            type: String,
            enum: ["full-time", "part-time", "internship", "contaract"],
            default: "full-time",
        },
        workLocation: {
            type: String,
            default: "Mumbai",
            required: [true, "work location is required"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId, // GET objectId from mongoose
            ref: "User", //referance name // Table name i,e. "User" is required .// this table name is same as what is exported in user model
        },
    },
    { timestamps: true } // it is also a object ,// whenever job is created, time and date is shown there
);

export default mongoose.model("Job", jobSchema); //  mongoose.model(model name, referance type)
