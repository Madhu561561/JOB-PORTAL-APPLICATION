//error middleware  //NEXT function //The next() function is used to pass control to the error handling middleware function and pass an error object to it.
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    //forming reusable object
    const defaultErrors = {
        statusCode: 500,
        message: err,
    };
    /*  res.status(500).send({
        success: false,
        message: err, // "Something went wrong",
        err,
    });*/
    //missing field error
    if (err.name === "ValidationError") {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
    }
    //duplicate error
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${Object.keys(
            err.keyValue //extracts key value in the error eg.email
        )} field has to be unique`; //if duplicates occur => email field has to be unique
    }
    res.status(defaultErrors.statusCode).json({
        message: defaultErrors.message,
    });
};

export default errorMiddleware;
