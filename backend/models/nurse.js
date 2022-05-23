const mongoose = require('mongoose')
const nurseSchema = new mongoose.Schema({
    nurseName:{
        type:String,
        required:true
    },
    nurseId:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('Nurse',nurseSchema);