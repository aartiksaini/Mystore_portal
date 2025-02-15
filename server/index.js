const express=require('express');
const fileUpload=require('express-fileupload');
const cors = require("cors");
const cookieParser = require('cookie-parser')
const paymentRoutes=require('./Routes/paymentRoutes.js');
const { dbconnect } = require('./Config/databases.js');

require('dotenv').config();
const app=express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.get('/',(req,res)=>{
    res.send("hello word");
})

app.use('/api/v1',paymentRoutes);

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
});

dbconnect();