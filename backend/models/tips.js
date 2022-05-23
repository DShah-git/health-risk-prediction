const mongoose = require('mongoose')
const tipSchema = new mongoose.Schema({
    patientId:{
        type:String,
        required:true
    },
    nurseId:{
        type:String,
        required:true
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

module.exports = mongoose.model('Tip',tipSchema);