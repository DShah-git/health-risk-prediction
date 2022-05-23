const mongoose = require('mongoose')
const patientSchema = new mongoose.Schema({
    patientName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    patientId:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    vitals:{
        type:mongoose.Schema.Types.Array,
        require:false
    }
})


module.exports = mongoose.model('Patient',patientSchema);