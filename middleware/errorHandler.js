const {logEvents} =require('./logger')
const errorHandler =(err,req,res,next)=>{
    logEvents(`${err.name}\t${err.message}\t${req.method}\ts${req.url}\t${req.headers.origin}`,"reqlog.log") 
    console.log(err.stack) 
const status =res.statusCode ? res.statusCode:500//server error
res.status(status)

res.json({
   message:err.message 
})



}
module.exports=errorHandler