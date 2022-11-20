const {createLogger, transports,format} = require('winston')

const path = require('path');
const fs=require('fs');


const address = require('address')

logFilePath=path.join(__dirname+"/errorLogs",address.ip())

if(!fs.existsSync(logFilePath)){
    fs.writeFile(logFilePath, '', function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
}


ip=address.ip()
const errorLogger=createLogger({
    transports:[
        new transports.File({
            filename:path.join(__dirname+"/errorLogs",address.ip()),
            level:"error",
            format: format.combine(format.timestamp(),format.json())
        })
    ]
})

module.exports = {errorLogger};