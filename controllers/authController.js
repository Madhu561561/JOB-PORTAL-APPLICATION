import userModel from "../models/userModel.js";

export const registerController = async function (req, res, next) {
    //to write business logic
    // try {
    const { name, email, password, lastName } = req.body; //fetching user's name,email,password from req and destructure them
    //validate
    if (!name) {
        /*return res
                .status(400)
                .send({ success: false, message: "please provide name" });*/
        next("Name is required");
    }
    if (!email) {
        next("email is required");
    }
    if (!password) {
        next("password is required and greater tha 6 charcter");
    }
    const existingUser = await userModel.findOne({ email }); //findone is a function and using data from userMdel
    if (existingUser) {
        next("Email Already Register Please Login");
    }
    //if all the  above function validate then we create variable user
    const user = await userModel.create({ name, email, password, lastName }); //create=>function to create document

    //token
    const token = user.createJWT(); //calling
    res.status(201).send({
        success: true,
        message: "User Created Successfully",
        // to hide the password as password is visible in the form of token in postman output or response to secure the paasword
        user: {
            //nested object
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
        },
        token,
    });
};
export const loginController = async function (req, res, next) {
    //no need of try catch block now, directly write logic
    const { email, password } = req.body; //get email and password from req.body
    //validation
    if (!email || !password) {
        next("Please Provide All Fields");
    }
    //find user by email
    const user = await userModel.findOne({ email }).select("+password"); //select("+password")-> + to hide the password from resonse in postman
    if (!user) {
        //if such user is not there then  it is invalid usename
        next("Invalid Useraname or password");
    }
    //compare password
    const isMatch = await user.comparePassword(password); // call comparePassword function
    if (!isMatch) {
        next("Invalid Useraname or password"); // we use both username and password so that package cant get idea what is wrong in them
    }
    user.password = undefined; // for more security
    const token = user.createJWT(); //if everything is right then create token
    res.status(200).json({
        // either send or json van be used
        success: true,
        message: "Login SUccessfully",
        user,
        token,
    });
};

/* res.status(201).send({
        success: true,
        message: "User Created Successfully",
        user, //passing the user created
    });*/
// } //catch (error) {
/*console.log(error);
        res.status(400).send({
            message: "Error In Register Controller",
            success: false,
            error,
        });*/
//  next(error);
//The next() function is used to pass control to the error handling middleware function and pass an error object to it.
// }
//};
