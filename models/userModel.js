import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

//schema
//inside schema we make objects
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is require"],
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is Require"],
            unique: true,
            validate: validator.isEmail,
        },
        password: {
            type: String,
            required: [true, "Password is Require"],
            minlength: [6, "Password should be minimum of 6 character"],
            select: true, // to display the hided password
        },
        location: {
            type: String,
            default: "India",
        },
    },
    { timestamps: true } // it will provide data with time whenever new user is created;
);

//middleware
userSchema.pre("save", async function () {
    //if function executes then only data will be save to database,& here callback function not works .normal fun works
    if (!this.isModified) return; //check password if it not modifies return else save the data
    const salt = await bcrypt.genSalt(10); //salt create ,..salt value>10 can take more loading time so set 10 is ok
    this.password = await bcrypt.hash(this.password, salt); //targeting passwors field with the help of "this"
}); //hash function of bcrypt is use to hash the password

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
    // comaperpassword is any funtion name and make async bcz coming request is asynchronous  and get password from user
    const isMatch = await bcrypt.compare(userPassword, this.password); //use compare function , this.password =>password in database
    return isMatch;
};

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {
    // custom method is created with help of userschema,
    //mongoose provide methods,and createJWT is any variable name
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
        //JWT.sign help to create token,
        // _id (created by defalult in the model)pass into the payload->"this" is used as this function is out of scopeof model
        //add secret key that's why we use .env package
        // to get with the help of process
        expiresIn: "1d", //expires in 1 day and token store in local storage so that after re login it doesnt vanish
    });
};
export default mongoose.model("User", userSchema);
