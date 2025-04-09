const errorHandler=((error,req,res,next)=>{
    res.status(error.status|| 500).json({
        status:error.status||500,
        error:error.message,
        satck:error.stack
    })
    })
    module.exports = errorHandler