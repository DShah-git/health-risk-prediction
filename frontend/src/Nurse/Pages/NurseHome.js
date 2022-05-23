import { gql, useLazyQuery, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NurseNav from '../Components/NurseNav'

const GET_PROFILE = gql`
  query getNurseProfile{
    getNurseProfile{
      nurseId
      nurseName
    }
  }
`
const GET_PATIENT_LIST = gql`
  query{
    getPatientList{
      patientId
      patientName
      address
      vitals{
        weight
      }
    }
  }
`

const GET_ALERTS = gql`
  query{
    getPatientAlerts{
      patientId
      patientName
      message
      time
    }
  }
`

export default function NurseHome() {

  const [profile, setProfile] = useState({})
  const [alerts, setAlerts] = useState([])
  const [patientList, setPatientList] = useState([])

  const navigate = useNavigate()

  const [getPatientList] = useLazyQuery(GET_PATIENT_LIST, {
    onCompleted:(res)=>{
      console.log(res)
      setPatientList(res.getPatientList);
    }
  });

  const [getAlerts] = useLazyQuery(GET_ALERTS, {
    onCompleted:(res)=>{
      console.log(res)
      let alerts = [...res.getPatientAlerts]
      alerts.reverse();
      setAlerts(alerts)
    }
  });

  const [getProfile] = useLazyQuery(GET_PROFILE, {
    onCompleted:(res)=>{
      console.log(res)
      setProfile(res.getNurseProfile)
    }
  });

  useEffect(()=>{
    getPatientList()
    getProfile()
    getAlerts()
  },[])

  const openUser = (patientId) => {
    navigate(`/patient/${patientId}`);
  }

  return (
    <div>
        <NurseNav isactive="home" /> 

        { profile && 

        <div className='container home-main'>
        <div className='user-profile'>
          <p className='xl'>{profile.nurseName}</p>
          <p className='xl'>Nurse ID - {profile.nurseId}</p>

          { alerts.length>0 &&
          <div className='tips'>
            <hr />
          <p className='tips-header'>Alerts</p>
          <br />
            {alerts.map((alert,i)=>
                <div className='tip'>
                  <p>Patient Name - {alert.patientName}</p>
                  <p>{alert.message} </p>
                  <small>{new Date(parseInt(alert.time)).toDateString()}</small>
                  
                </div>
              )
            }          
            </div>
        }
          
        </div>
        <div className='user-courses'>
          { patientList.length>0 &&
            <div className='cards'>
              { patientList.map((patient, i)=>
                <div key={i} className="outerbox" onClick={()=>openUser(patient.patientId)}>
                  <div className='course-card xl'>
                    <p>Patient: {patient.patientName}</p> 
                    <p>Patient ID: {patient.patientId}</p> 
                    <p>Address: {patient.address}</p> 
                    <p>{patient.vitals.length} vitals</p> 
                  </div>
                </div>
              )
              }
              
            </div>
            
          }
        </div>
        </div>

        } 
    </div>
  )
}