import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";
// =====   C R E A T E    J O B  ========

export const createJobController = async (req, res, next) => {
    const { company, position } = req.body; //fetching user's company ,position from req and destructure
    if (!company || !position) {
        //perform validation
        next("Please Provide All Fields");
    }
    req.body.createdBy = req.user.userId; //check Id
    const job = await jobsModel.create(req.body); //create job in mongodb
    res.status(201).json({ job });
};

// =========  G E T   J O B S  ========

/*export const getAllJobsController = async (req, res, next) => {
    //jobs find using jobs model
    const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
        totalJobs: jobs.length,
        jobs,
    });
};*/

export const getAllJobsController = async (req, res, next) => {
    const { status, workType, search, sort } = req.query;
    //conditons for searching filters
    const queryObject = {
        createdBy: req.user.userId,
    };
    //logic filters
    if (status && status !== "all") {
        //if status find then
        queryObject.status = status;
    }
    if (workType && workType !== "all") {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: "i" }; //Regular expressions (regex) are patterns used to match character combinations in strings.
    } //  type : insensitive (),means the regular expression will treat uppercase and lowercase letters as equivalent

    let queryResult = jobsModel.find(queryObject);

    //sorting
    if (sort === "latest") {
        queryResult = queryResult.sort("-createdAt");    // add (- before created at) means latest
    }
    if (sort === "oldest") {
        queryResult = queryResult.sort("createdAt");
    }
    if (sort === "a-z") {
        queryResult = queryResult.sort("position");
    }
    if (sort === "z-a") {
        queryResult = queryResult.sort("-position");  // - means reverse 
    }

    //pagination
    //Instead of retrieving all documents at once, the server only retrieves a small subset (a single page)
    //at a time. This reduces the load on the database and the server, making the application more scalable.
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit; //if page =2, limit=10,and total job =13,skip = (2-1)*10=10 ->skip the 1st 10 document remain = 3 job

    queryResult = queryResult.skip(skip).limit(limit);
    //jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage,
    });
};

// =========  U P D A T E   J O B S  ========
export const updateJobController = async (req, res, next) => {
    const { id } = req.params; // id store in params // get id from the URL
    const { company, position } = req.body;
    if (!company || !position) {
        //perform validation
        next("Please Provide All Fields");
    }
    const job = await jobsModel.findOne({ _id: id }); //_id ->document id (by default create in database)  and id-> req.params
    if (!job) {
        next(`No Jobs found with this id ${id}`);
    }
    ///only creator of job can update that particular job
    if (!req.user.userId === job.createdBy.toString()) {
        next("You are not Authorized to update this job");
        return;
    }
    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        //jobModel.findOneAndUpdate(...): This is a Mongoose method used to find a single document
        //in the collection that matches the given criteria and update it.
        new: true, //new: true: This option ensures that the method returns the updated document instead of the original document before the update. Without this option, the method would return the document as it was before the update.
        runValidator: true, // validates the updated data.
    });
    res.status(200).json({ updateJob });
};
//update TCS ,back-end develpoer to TCS ,sde
//used url -> http://localhost:8080/api/v1/job/update-job/668a41714ee9d215efdab36c    =>_id of the job to be updated

// =======   D E L E T E    J O B S ==========

export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    // first find job and then delete
    const job = await jobsModel.findOne({ _id: id });
    //validation
    if (!job) {
        next(`No job found with this ID ${id} `);
    }
    //ony login user can delete the data
    if (!req.user.userID === job.createdBy.toString()) {
        next("You are authorised to delete this job");
        return;
    }
    await job.deleteOne();
    res.status(200).json({ message: "Success, Job Deleted !" });
};

//=======  JOBS STATS & FILTER =========
export const jobStatsController = async (req, res) => {
    //NO Need of middleware
    const stats = await jobsModel.aggregate([
        //using aggregation pipeline  function of array
        //It can have multiple queries in the form of queries
        // search by user jobs
        {
            //match  is also an object// it contain query
            // This stage filters the documents to include only those where the createdBy field matches the userId
            //from the request. The req.user.userId is converted to an ObjectId using mongoose.Types.ObjectId.
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            //group is also an object and to filter based on any thing,position,worktype etc
            // This stage groups the filtered documents by the position field/status field (_id: "$position"/ _id: "$status").It then
            //calculates the number of documents in each group by summing 1 for each document (count: { $ sum: 1 }).
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    // handle the case where a user with a given userId has not created any jobs.
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    };

    //use let variable tso that we can change further
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" }, //in mongodb we have year function,,getting year with the help of creatyedat field
                    month: { $month: "$createdAt" },
                },
                count: {
                    //count is also an object
                    $sum: 1,
                },
            },
        },
    ]);
    monthlyApplication = monthlyApplication //making changes to variable monthlyApplication
        .map((item) => {
            const {
                _id: { year, month },
                count,
            } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count };
        })
        .reverse();
    res.status(200).json({
        totalJobs: stats.length,
        stats,
        monthlyApplication,
    });
};
