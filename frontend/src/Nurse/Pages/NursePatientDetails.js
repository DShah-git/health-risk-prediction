import { gql, useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import NurseNav from '../Components/NurseNav'

const GET_PATIENT = gql`
    query getOnePatient($patientId:String!){
        getOnePatient(patientId:$patientId){
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

const Add_PATIENT_VITAL = gql`
  mutation enterPatientVitals($patientId:String!, $bodyTemperature:String!, $heartRate:String!, $bloodPressure:String!, $respiratoryRate:String!, $weight:String! ){
    enterPatientVitals(input:{patientId:$patientId, bodyTemperature:$bodyTemperature, heartRate:$heartRate, bloodPressure:$bloodPressure, respiratoryRate:$respiratoryRate, weight:$weight}){
      patientName
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

const SEND_TIP = gql`
    mutation sendTip($patientId:String!, $message:String!){
        sendTip(input:{patientId:$patientId, message:$message})
    }
`


export default function NursePatientDetails() {

    const { patientid } = useParams()
    const [data, setData] = useState("");
    const [addToggle, setAddToggle] = useState(false);
    const [tipJustSent, setTipJustSent] = useState(false);
    const [tip, setTip] = useState("");
    const {register, handleSubmit, formState:{errors}} = useForm()

    const [getPatient] = useLazyQuery(GET_PATIENT, {
        onCompleted:(res)=>{
          setData(res.getOnePatient)
        }
      });
    

    const [addVital, {loading1, error1}] = useMutation(Add_PATIENT_VITAL, {
        onCompleted:(res)=>{
            window.location.reload(false);
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

    const [sendTipMutation, {loading2, error2}] = useMutation(SEND_TIP, {
        onCompleted:(res)=>{
            console.log(res);
            setTip('')
            setTipJustSent(true);
            setTimeout(()=>{
                setTipJustSent(false);
            },5000)
            // window.location.reload(false);
            // setAddToggle(false);
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
        console.log(patientid)
        getPatient({variables:{patientId:patientid}})
    },[])

    const addVitalClicked = () =>{
        setAddToggle(true)
      }

    const submitVital = (formdata) => {
        formdata.patientId = data.patientId;
        console.log(formdata);
        addVital({variables:formdata})
    }

    const sendTip = () => {
        console.log(tip);
        sendTipMutation({variables:{patientId:data.patientId, message:tip}})
    }

  return (
    <div>
        <NurseNav  isactive="home" />

        { data && 

        <div className='container home-main'>
        <div className='user-profile'>
        <p className='l'>Patient Name - {data.patientName}</p>
        <p className='l'>Patient ID - {data.patientId}</p>
        <p className='l'>Address - {data.address}</p>
        
        { addToggle==false &&
            <button className='add-course' onClick={()=>addVitalClicked()}>Add Vital</button>
        }
        
        { addToggle &&
            <div>
            <hr />
            <form onSubmit={handleSubmit(data=>submitVital(data))} >
                <h3 className='header'>Add {data.patientName}'s Vital</h3>

                <label className='xl'>Body Temperature <br />
                    <input className='nurse-input' {...register('bodyTemperature', {required:"field required"})} type="text" />
                    <small className='red'>{errors.bodyTemperature?.message}</small>
                </label>

                <label className='xl'>Heart Rate <br />
                    <input className='nurse-input' {...register('heartRate', {required:"field required"})} type="text" />
                    <small className='red'>{errors.heartRate?.message}</small>
                </label>

                <label className='xl'>Blood Pressure  <br />
                    <input className='nurse-input' {...register('bloodPressure', {required:"field required"})} type="text" />
                    <small className='red'>{errors.bloodPressure?.message}</small>
                </label>

                <label className='xl'>Respiratory Rate <br />
                    <input className='nurse-input' {...register('respiratoryRate', {required:"field required"})} type="text" />
                    <small className='red'>{errors.respiratoryRate?.message}</small>
                </label>

                <label className='xl'>Weight <br />
                    <input className='nurse-input' {...register('weight', {required:"field required"})} type="text" />
                    <small className='red'>{errors.weight?.message}</small>
                </label>

                <br />

                <button className='add-course cancel' onClick={()=>setAddToggle(false)}>Cancel</button>
                <button className='add-course' type="submit" >Submit</button>
            </form>
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
            
            { tipJustSent &&
                <div className="bg-green">
                <div className='course-card xl'>
                    <p className='xl'>Thanks for sending the tip</p> 
                </div>
                </div>
            }

            { !tipJustSent &&
                <div className="outerbox">
                <div className='course-card xl'>
                    <p className='xl'>Send a healthy tip to {data.patientName}</p> 
                    <input className='input-tip' type="text" value={tip} onChange={(e)=>setTip(e.target.value)} />
                    <br />
                    <button className='send-tip-btn' onClick={()=>sendTip()}>Send Tip</button>
                </div>
                </div>
            }
                
            </div>
            
        }
        </div>
        </div>

        }
    </div>
  )
}
