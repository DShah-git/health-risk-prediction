const {buildSchema} = require('graphql')

module.exports = buildSchema(`

input nurseLoginInput{
    nurseId:String!
    password:String!
}

type nurseProfileData {
    nurseId:String!
    nurseName:String!
} 

input patientRegisterInput{
    patientName:String!
    address:String
    patientId:String!
    password:String!
}

input patientLoginInput{
    patientId:String!
    password:String!
}

type patient{
    patientName:String!
    address:String
    patientId:String!
    vitals:[vitals!]!
}

type vitals{
    bodyTemperature:String!
    heartRate:String!
    bloodPressure:String!
    respiratoryRate:String!
    weight:String!
    time:String! 
}

input vitalsInputFromNurse{
    patientId:String!
    bodyTemperature:String!
    heartRate:String!
    bloodPressure:String!
    respiratoryRate:String!
    weight:String!
}

input vitalsInputFromPatient{
    bodyTemperature:String!
    heartRate:String!
    bloodPressure:String!
    respiratoryRate:String!
    weight:String!
}

input tipInput{
    patientId:String!
    message:String!
}

type tips {
    message:String
    time:String
}

type alerts{
   patientId:String
   patientName:String
   message:String
   time:String 
}

type RootQuery{
    getNurseProfile:nurseProfileData
    getPatientProfile:patient
    getPatientList:[patient]
    getOnePatient(patientId:String):patient
    getPatientTips:[tips]
    getPatientAlerts:[alerts]
  
}

type RootMutation{
    nurseLogin(input:nurseLoginInput):String!
    patientRegister(input:patientRegisterInput!):String!
    patientLogin(input:patientLoginInput):String!
    enterPatientVitals(input:vitalsInputFromNurse):patient
    sendTip(input:tipInput):String
    createAlert(message:String):String
    enterMyVitals(input:vitalsInputFromPatient):patient
}

schema {
    query : RootQuery
    mutation : RootMutation
}`);