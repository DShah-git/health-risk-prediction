const mongoose = require('mongoose')
const alertSchema = new mongoose.Schema({
    patientId:{
        type:String,
        required:true
    },
    patientName:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    }
    
})


module.exports = mongoose.model('Alert',alertSchema);