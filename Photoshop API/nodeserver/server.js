
const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const sharp=require('sharp')
const logger=require('./errorLogger')
const multer=require('multer');

//  for creating file and adding logs
const address = require('address')
const morgan = require('morgan');
const fs=require('fs');

var imageFormat
logFilePath=path.join(__dirname+"/requestLogs",address.ip())

if(!fs.existsSync(logFilePath)){
    fs.writeFile(logFilePath, '', function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
}

const logStream=fs.createWriteStream(path.join(__dirname+"/requestLogs",address.ip()),{flags:'a'})
app.use(morgan(':method :url --:status --:date[web]',{stream:logStream}));
//  --------------------------------------------

app.use(express.static(path.join(__dirname,"../public")));

var currentTime=Date.now()
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,__dirname+"/Images/")
    },
    filename: (req,file,cb)=>{
        console.log(file)
        cb(null,currentTime+file.originalname);
        console.log("---")
    }
});

const upload=multer({storage:storage});


app.post("/api/v1/resize",upload.single('image'),(req,res)=>{

    console.log("==>"+req.file.mimetype)
    if(req.file.mimetype=="image/jpeg"){
        imageFormat="jpg"
    }else{
        imageFormat="png"
    }


    var sizeOf = require('image-size');
    let width, height

    sizeOf(req.file.path, function (err, dimensions) {
        
        if(isNaN(req.body.width)){
            width=dimensions.width;
        }else{
            width=req.body.width;
        }
    
        if(isNaN(req.body.height)){
            height=dimensions.height;
        }else{
            height=req.body.height;
        }
       
       processImage(req,res,width,height)

    });
   
    
    console.log("uploaded")
});



function processImage(req,res,width,height){

    outFile=currentTime+"resizedImage."+imageFormat;
    sharp("./Images/"+currentTime+req.file.originalname)
    .resize(parseInt(width),parseInt(height))
    .toFile(outFile,(err)=>{
        if(err) {
            console.log(err)
           
            logger.errorLogger.log('error',err.message)
            return res.status(400).send({
                message: err.message
             });
        }

        res.download(outFile,err=>{
            if(err) {
                console.log(err)
               
                logger.errorLogger.log('error',err.message)
                return res.status(400).send({
                    message: err.message
                 });
            }
            console.log("downloaded")
            try{
                fs.unlinkSync("./Images/"+currentTime+req.file.originalname);
                fs.unlinkSync(resizedImage.jpg)
            }catch{}
        })

    })
}

//---------------------------------------------

app.post("/api/v1/resize.base64",upload.single('image'),(req,res)=>{

    console.log("==>"+req.file.originalname)

    console.log("==>"+req.file.mimetype)
    if(req.file.mimetype=="image/jpeg"){
        imageFormat="jpg"
    }else{
        imageFormat="png"
    }

    var sizeOf = require('image-size');
    let width, height

    sizeOf(req.file.path, function (err, dimensions) {
        
        if(isNaN(req.body.width)){
            width=dimensions.width;
        }else{
            width=req.body.width;
        }
    
        if(isNaN(req.body.height)){
            height=dimensions.height;
        }else{
            height=req.body.height;
        }
       
       processImageToBase64(req,res,width,height)

    });
   
    
    console.log("uploaded")
});



function processImageToBase64(req,res,width,height){

    
    outFile=currentTime+"resizedImage."+imageFormat;
    var base64String;
    sharp("./Images/"+currentTime+req.file.originalname)
    .resize(parseInt(width),parseInt(height))
    .toFile(outFile,(err)=>{
        if(err) {
            console.log(err)
           
            logger.errorLogger.log('error',err.message)
            return res.status(400).send({
                message: err.message
             });
        }

        var bitmap = fs.readFileSync(outFile);

        base64String="data:image/jpg;base64," +(new Buffer(bitmap).toString('base64')); 
            
        try{
            fs.unlinkSync("./Images/"+currentTime+req.file.originalname);
            fs.unlinkSync(resizedImage.jpg)
        }catch{}

        return res.status(200).send({
            message: "your base64 String is "+ base64String
        });   
    })

}


server.listen(3000, () => {
  console.log('listening on *:3000');
});