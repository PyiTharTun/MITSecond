
class AppError extends Error{
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string ,statusCode: any){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4")? "client error": "Server error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError;