const AppErrors = require('../utils/appError');
module.exports = (err: any, req: any, res:any, next: any) =>{
    console.log("<<<<<<")
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    console.log(">>>>>");
    const sendErrorDev = (err: any, res: any) =>{
        console.log("Dev Error");
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            err: err,
            errorStack: err.stack,
        });
    };

    const sendErrorProd = (err: any , res: any )=>{
        console.log("Prod Error");
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    };

    if (process.env.NODE_ENV == "development"){
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV == "production"){
        if(err.name == "JsonWebTokenError" || err.name == "TokenExpiredError"){
            err = new AppErrors(
                `${err.message.toUpperCase()}. Please Login again`, 401
            );
        }
        sendErrorProd(err, res);
    };
};