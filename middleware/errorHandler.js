const notFound = (req,resp,next)=>{
const error = new Error(`Not Found : ${req.originalUrl}`);
resp.status(404);
next(error)
}

const errorHandler = (error,req,resp,next)=>{
    const statuscode = resp.statusCode==200?500:resp.statusCode;
    resp.status(statuscode);
    resp.json({
        message:error?.message,
        stack:error?.stack
    })
}
module.exports = {notFound,errorHandler}