import userModel from "../models/userModel.js"; //.js is used bcz we are using ES6 (module based approach)

export const updateUserController = async (req, res, next) => {
    const { name, email, lastName, location } = req.body;
    if (!name || !email || !lastName || !location) {
        next("Please Provide All Fields"); //perfom validation
    }

    //after validation check user
    const user = await userModel.findOne({ _id: req.user.userId });
    user.name = name; //update name
    user.lastName = lastName;
    user.email = email;
    user.location = location; //password cant be updated directly

    await user.save(); //save
    const token = user.createJWT(); //creating token again
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
        token,
    });
};
//get user data
export const getUserController = async (req, res, next) => {
  try {
    const user = await userModel.findById({ _id: req.body.user.userId });
    user.password = undefined;// initailly password will not show
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};