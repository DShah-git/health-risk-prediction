const Nurse = require('../../models/nurse')
const jwt = require('jsonwebtoken')
const Patient = require('../../models/patient') 
const bcrypt = require('bcrypt');
const Tip = require('../../models/tips'); 
const Alert = require('../../models/alerts');

const ML = require('../../TensorFlow/predict')



function Auth(token){
    if (!token)
    throw new Error("No Token")
    const verified =  jwt.verify(token,process.env.TOKEN_SECRET);
    if(!verified) return new Error("Access Denied")
    return verified
}

module.exports = {
    nurseLogin:async function({input}){
        const nurse = await Nurse.findOne({nurseId:input.nurseId})
        if(!nurse) return new Error("Nurse not found")

        if(input.password!=nurse.password) return new Error("Incorrect Password")
        
        const token = jwt.sign({id:nurse.nurseId},process.env.TOKEN_SECRET);

        return token
    },
    getNurseProfile:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        const id = authdata.id;

        var nurse = await Nurse.findOne({nurseId:id})
        if(!nurse) return new Error("Nurse not found")

        nurse.password = undefined
        return nurse
    },
    patientRegister:async function({input}){
        const patientExists = await Patient.findOne({patientId:input.patientId})
        if(patientExists) return new Error("Patient Already Registered")

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(input.password,salt);

        const patient = new Patient({
            patientName:input.patientName,
            address:input.address,
            patientId:input.patientId,
            password:hashPassword,
            vitals:[]
        });

        const registeredNurse = await patient.save()
        if(registeredNurse) return "Registered"
        else return new Error("Some Error! Please Try Again")
    },
    patientLogin:async function({input}){
        const patient = await Patient.findOne({patientId:input.patientId});
        if(!patient) return new Error("Patient not registered")


        checkPassword = await bcrypt.compare(input.password,patient.password)
        if(!checkPassword) return new Error("Incorrect password")

        const token = jwt.sign({id:patient.patientId},process.env.TOKEN_SECRET);
        return token
    },
    getPatientProfile:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        const id = authdata.id
        var patient = await Patient.findOne({patientId:id})
        if(!patient) return new Error("Patient not found")

        return patient

    },
    getPatientList:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
    
        var patients = await Patient.find()
        return patients

    },
    getOnePatient:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        const patientId = args.patientId
        var patient = await Patient.findOne({patientId:patientId})
        if(!patient) return new Error("Patient Not Found")

        return patient;

    },
    enterPatientVitals:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        args = args.input
        const patientId = args.patientId

        var vitals = { 
            bodyTemperature : args.bodyTemperature,
            heartRate : args.heartRate,
            bloodPressure: args.bloodPressure,
            respiratoryRate:args.respiratoryRate,
            weight: args.weight, 
            time:new Date().getTime(),    
        } 

        var patient = await Patient.findOne({patientId:patientId})
        if(!patient) return new Error("Patient Not Found")

        patient.vitals.push(vitals)   

        var savedPatient = patient.save();
        if(!savedPatient) return new Error("Something went wrong")

        return savedPatient
        
    },
    sendTip:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        nurseId = authdata.id;
        
        args = args.input
        const patientId = args.patientId
        const message = args.message
        
        var tip = new Tip({
            nurseId:nurseId,
            patientId:patientId,
            message:message,
            time:new Date().getTime()
        })

        const savedTip = tip.save()
        if(!savedTip) return new Error("Try Later")

        return "Tip Sent"
        
        
    },
    getPatientTips:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        patientId = authdata.id;    
        
        var tips = await Tip.find({patientId:patientId})

        tips = tips.map(tip=>{ return { message:tip.message , time:tip.time }})

        return tips
    },

    createAlert:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        patientId = authdata.id;    
        var patient = await Patient.findOne({patientId:patientId})
        if(!patient) return new Error("No patient found") 
        
        var alert = new Alert({
            patientName : patient.patientName,
            patientId:patientId,
            message : args.message,
            time:new Date().getTime()
        })

        var savedAlert = await alert.save()
        if(!savedAlert) return new Error ("Try Later")

        return "Alert Sent"

    },
    getPatientAlerts:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        var alerts = Alert.find()
        return alerts; 
    },
    enterMyVitals:async function(args,request){
        token = request.headers.authorization
        const authdata = Auth(token)
        const patientId = authdata.id;

        var patient = Patient.findOne({patientId:patientId})
        if(!patient) return new Error("No patient found") 

        args = args.input
        var vitals = { 
            bodyTemperature : args.bodyTemperature,
            heartRate : args.heartRate,
            bloodPressure: args.bloodPressure,
            respiratoryRate:args.respiratoryRate,
            weight: args.weight, 
            time:new Date().getTime(),    
        }
        
        
        vitals = {
            bodyTemperature: parseFloat(vitals.bodyTemperature),
            heartRate: parseFloat(vitals.heartRate),
            bloodPressure: parseFloat(vitals.bloodPressure),
            respiratoryRate: parseFloat(vitals.respiratoryRate),
            weight: parseFloat(vitals.weight),
            time: vitals.time
        }
  
               
        var patient = await Patient.findOne({patientId:patientId})
        if(!patient) return new Error("Patient Not Found")

        patient.vitals.push(vitals)   

        var savedPatient = await patient.save();
        if(!savedPatient) return new Error("Something went wrong")
        return savedPatient

    },

}