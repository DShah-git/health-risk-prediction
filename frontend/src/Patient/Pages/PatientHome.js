import { gql, useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PatientNav from '../Components/PatientNav'
import {isLoggedIn} from '../Components/PatientAuth'
import './home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import spinner from '../../Assets/spinnner.gif' 

const GET_PROFILE = gql`
  query getPatientProfile{
    getPatientProfile{
      patientId
      patientName
      address
      vitals{
        bodyTemperature
        heartRate
        bloodPressure
        respiratoryRate
        weight
        time
      }
    }
  }
`

const Add_MY_VITAL = gql`
  mutation enterMyVitals($bodyTemperature:String!, $heartRate:String!, $bloodPressure:String!, $respiratoryRate:String!, $weight:String! ){
    enterMyVitals(input:{bodyTemperature:$bodyTemperature, heartRate:$heartRate, bloodPressure:$bloodPressure, respiratoryRate:$respiratoryRate, weight:$weight}){
      patientName
      address
      patientId
      vitals{
        bodyTemperature
        heartRate
        bloodPressure
        respiratoryRate
        weight
        time
      }
    }
  }
`

const GET_TIPS = gql`
  query{
    getPatientTips {
      message
      time
    }
  }
`

const CREATE_ALERT = gql`
  mutation createAlert($message:String!){
    createAlert(message:$message)
  }
`


export default function PatientHome() {

  const [addToggle, setAddToggle] = useState(false);
  const [alertJustSent, setAlertJustSent] = useState(false);
  const [alert, setAlert] = useState("");
  const [data, setData] = useState("");
  const [tips, setTips] = useState([]);
  const {register, handleSubmit, formState:{errors}} = useForm()

  const navigate = useNavigate()


  const [getProfile] = useLazyQuery(GET_PROFILE, {
    onCompleted:(res)=>{
      console.log(res)
      setData(res.getPatientProfile)
    }
  });

  const [getTips] = useLazyQuery(GET_TIPS, {
    onCompleted:(res)=>{
      console.log(res)
      let trips = [...res.getPatientTips]
      trips.reverse();
      console.log(trips)
      setTips(trips)
    }
  });

  

  const [sendAlert, {loading2, error2}] = useMutation(CREATE_ALERT, {
    onCompleted:(res)=>{
        console.log(res);
        setAlert('')
        setAlertJustSent(true);
        setTimeout(()=>{
          setAlertJustSent(false);
        },5000)
    },
    onError:({graphQLErrors, networkError})=>{
        
        if (graphQLErrors) {
            console.log(graphQLErrors)
        }
        if (networkError) {
            console.log("network Error"+ networkError)
        }
    },
  })

  useEffect(()=>{
    if (!isLoggedIn()) {
      navigate('/loginpatient') 
    }
    getProfile()
    getTips()
  },[])

  const addVitalClicked = () =>{
    setAddToggle(true)
  }

  const [addVital, {loading1, error1}] = useMutation(Add_MY_VITAL, {
    onCompleted:(res)=>{
        console.log(res.enterMyVitals)
        setData(res.enterMyVitals);
        setAddToggle(false);
    },
    onError:({graphQLErrors, networkError})=>{
        
        if (graphQLErrors) {
            console.log(graphQLErrors)
        }
        if (networkError) {
            console.log("network Error"+ networkError)
        }
    },
  })

  const [vitalState,setVitalState] = useState("none")
  const [vitalMessage,setVitalMessage]=useState("")

  const submitVital = (formdata) => {
    formdata.patientId = data.patientId;
    console.log(formdata);
    addVital({variables:formdata})
    
    formdata = {
      bloodPressure:parseFloat(formdata.bloodPressure),
      temperature:parseFloat(formdata.bodyTemperature),
      heartRate:parseFloat(formdata.heartRate),
      respiratoryRate:parseFloat(formdata.respiratoryRate),
      weight:parseFloat(formdata.weight),
    }

    setVitalState("loading")
    
    var arr = {input : [formdata]}
    console.log(arr);
    axios.post('http://localhost:5000/predict',arr).then((result) => {
      console.log(result.data[0])
      result = result.data
      if(result[0][0]>0.525){
        setVitalMessage("Your Vitals show you are at risk. Please send a alert to a nurse")
        setVitalState("loaded")
      }
      else if (result[0][2]>0.29){
        setVitalMessage("Your Vitals shows that you needed to take better care of yourself. Maybe play a game on our site")
        setVitalState("loaded")
      }
      else {
        setVitalState("loaded")
        setVitalMessage("Vitals are okay.")
      }
        
      

    }).catch((err) => {
      console.log(err)
      setVitalState("loaded")
      setVitalMessage("Some Error happened")
    });

  }

  const sendAlertToNurse = () => {
    console.log(alert)
    sendAlert({variables:{message:alert}})
}

  const closeToast = () => { 
    setVitalState("none")
    setVitalMessage("")
  }

  return (
    <div>
      <PatientNav isactive="home" />
      
      { data && 

      <div className='container home-main'>
      <div className='user-profile'>
        <p className='xl'>{data.patientName}</p>
        <p className='xl'>Patient ID - {data.patientId}</p>
        <p className='xl'>Address - {data.address}</p>
        
        { addToggle===false &&
          <button className='add-course' onClick={()=>addVitalClicked()}>Add Vital</button>
        }
        
        { addToggle &&
          <div>
            <hr />
            <form onSubmit={handleSubmit(data=>submitVital(data))} >
              <h3 className='header'>Add Vital</h3>

              <label className='xl'>Body Temperature
                    <input {...register('bodyTemperature', {required:"field required"})} type="text" />
                    <small className='red'>{errors.bodyTemperature?.message}</small>
                </label>

              <label className='xl'>Heart Rate
                    <input {...register('heartRate', {required:"field required"})} type="text" />
                    <small className='red'>{errors.heartRate?.message}</small>
                </label>

              <label className='xl'>Blood Pressure
                    <input {...register('bloodPressure', {required:"field required"})} type="text" />
                    <small className='red'>{errors.bloodPressure?.message}</small>
                </label>

              <label className='xl'>Respiratory Rate
                    <input {...register('respiratoryRate', {required:"field required"})} type="text" />
                    <small className='red'>{errors.respiratoryRate?.message}</small>
                </label>

              <label className='xl'>Weight
                    <input {...register('weight', {required:"field required"})} type="text" />
                    <small className='red'>{errors.weight?.message}</small>
                </label>

              <br />

              <button className='add-course cancel' onClick={()=>setAddToggle(false)}>Cancel</button>
              <button className='add-course' type="submit" >Submit</button>
            </form>
          </div>
          
        }

        { tips.length>0 &&
          <div className='tips'>
            <hr />
          <p className='tips-header'>Your tips</p>
          <br />
            {tips.map((tip,i)=>
                <div className='tip'>
                  <p>{tip.message}</p>
                  <small>{new Date(parseInt(tip.time)).toDateString()}</small>
                  
                </div>
              )
            }          
        </div>
        }
        
        
      </div>
      <div className='user-courses'>
        { data.vitals.length>0 &&
          <div className='cards'>
            { data.vitals.map((vital, i)=>
              <div key={i} className="outerbox">
                <div className='course-card xl'>
                  <p>Blood Pressure: {vital.bloodPressure}</p> 
                  <p>Body Temperature: {vital.bodyTemperature}</p> 
                  <p>Heart Rate: {vital.heartRate}</p> 
                  <p>Respiratory Rate: {vital.respiratoryRate}</p> 
                  <p>Weight: {vital.weight}</p> 
                  <p>{new Date(parseInt(vital.time)).toDateString()}</p> 
                </div>
              </div>
            )
            }

            { alertJustSent &&
                <div className="bg-green">
                <div className='course-card xl'>
                    <p className='xl'>Alert Sent!! Nurse will send you a tip or contact you soon...</p> 
                </div>
                </div>
            }

            { !alertJustSent &&
                <div className="outerbox">
                <div className='course-card xl'>
                    <p className='xl'>Send an alert to your nurse</p> 
                    <input className='input-tip' type="text" value={alert} onChange={(e)=>setAlert(e.target.value)} />
                    <br />
                    <button className='send-tip-btn' onClick={()=>sendAlertToNurse()}>Send Alert</button>
                </div>
                </div>
            }
            
          </div>
          
        }
      </div>
      </div>

      }

    { vitalState!=="none" &&
      <div className="toastMessage">
        {vitalState==="loading"&&<div className='loading'>
          <img className="spinner"  src={spinner} alt="loading..." />  
          Checking Vitals....
        </div>}
        {vitalState==="loaded"&&
        <div className="message">
          <div>
            <button onClick={()=>closeToast()} className='close'>X</button>
          </div>
          {vitalMessage}  
        </div>}
      </div>
    }
      
    </div>
    
  )
}
