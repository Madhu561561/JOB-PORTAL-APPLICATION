//imports
//API Documentation
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
//const express = require("express");
//import packages
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
//security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

//import files
import connectDB from "./config/db.js";
//import routes
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//DOT ENV config
dotenv.config();

//mongoDB connection
connectDB();

//Swagger API config
//swagger api options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal Application",
            description: "Node ExpressJS Job Portal Application",
        },
        servers: [
            //array of objects bcz we can have multiple hosting providers
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./routes/*.js"], // * is used to access all the routes with the help of swagger
    //This documentation will include all the endpoints defined in the ./routes/*.js files,
    //complete with descriptions, request parameters, and response schemas.
};

const spec = swaggerDoc(options);
//rest object
const app = express();

//middlewares  //adding middleware to inform application we are dealing with JSON format
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json()); //body parser
app.use(cors()); //enabling cors  as we are using 2 diff ports ..1) client port 2)nodejs port
app.use(morgan("dev")); //logging tool

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes); //job is initial endpoints

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
//validation middleware
app.use(errorMiddleware); //If an error is thrown by any of the previous middleware or routes, the error handler middleware will catch it and respond with a 500 error.
//app.use() can also take a path parameter to specify which routes the middleware function should be applied to. If no path parameter is provided, the middleware function will be applied to all routes.
/*app.get("/", function (req, res) {
    //further divide in MVC pattern
    res.send("<h1>Welcone to  my JOB PORTAL</h1>");
});*/

//port
const PORT = process.env.PORT || 8080; //|| 8080 ->if unable to find port from .env file
//listen
app.listen(PORT, function () {
    //listen => to run the application
    console.log(
        `Node Server running In ${process.env.DEV_MODE} Mode on port no ${PORT}`
            .bgCyan.yellow
    );
});
