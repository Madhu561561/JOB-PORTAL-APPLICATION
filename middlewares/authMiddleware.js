import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization; // IN POSTMAN
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        //It first checks if the authHeader is provided. or not OR token start with bearer or not
        //startwith => basic javascript function returns true if a string starts with a substring or false otherwise.
        next("Auth Failed");
    }
    //if above condition successfully validate
    const token = authHeader.split(" ")[1]; //It splits the authheader string into parts.it has 2 parts 1)bearer 2)token  ..It extracts and returns the token.
    try {
        //token will dcrypt and successfully token is compared
        const payload = JWT.verify(token, process.env.JWT_SECRET); //our data reside in payload, create varible naming payload
        req.body.user = { userId: payload.userId }; //get user from req.user and compre user id and payload uesr id
        next(); //menas if we get the value correctly then we can futher execute the program
    } catch (error) {
        next("Auth Failed"); //middleware called
    }
};

export default userAuth;
