
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

const app= express()
const path =require('path')
const {logger}=require('./middleware/logger');
const errorHandler=require('./middleware/errorHandler')

const cookieparser= require('cookie-parser')
const cors=require('cors')
const corsOptions = require('./config/corsOptions');
const connectDB=require('./config/dbConn')
const mongoose=require('mongoose')
const { logEvents }=require('./middleware/logger')
const dotenv =require("dotenv")
dotenv.config();

const port = process.env.PORT || 3500
console.log(process.env.NODE_ENV)


connectDB()
app.use(logger)
app.use(cors(corsOptions))
app.use(cookieparser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/test", (req, res) => {
    res.send("Hello world!");
  });
  

app.use('/', express.static(path.join(__dirname,"public")))
app.use('/',require('./routes/root'))
app.use('/users', require('./routes/UserRoutes'))
app.use('/notes', require('./routes/NoteRoutes'))
app.use('/auth', require('./routes/Auth.js'))



 // for parsing URL-encoded data






app.all("*",(req,res)=>{res.status(404)
if (req.accepts('html')){
    res.sendFile(path.join(__dirname,'views','404.html'))

}
else if(req.accepts('json')){
    res.json({
        message:"404 Not Found"
    }) 
} else{res.type('txt').send('404 not found')}
})

app.use(errorHandler)
mongoose.connection.once('open',()=>{
    console.log('connect to mongodb')
    app.listen(port,()=>console.log(`sever running on port ${port}`))

})

mongoose.connection.on('error',err =>{
    
console.log(err)
logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
'mongoErrLog.log'
)
})