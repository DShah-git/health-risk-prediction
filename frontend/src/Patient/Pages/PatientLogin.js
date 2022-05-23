import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PatientNav from '../Components/PatientNav';

const LOGIN = gql`
    mutation patientLogin($patientId:String!, $password:String!){
        patientLogin(input:{patientId:$patientId, password:$password})
    }
`

export default function PatientLogin() {

    const {register, handleSubmit, formState:{errors}} = useForm();
    const navigate = useNavigate();

    const [loginUser, {loading, error}] = useMutation(LOGIN, {
        onCompleted:(res)=>{
            localStorage.setItem('patient_token',res.patientLogin);
            navigate('/');
        },
        onError:(err)=> console.log(err.message),
    })

    const Submit = (data) =>{
        loginUser({variables:data})
    }


  return (
      <div>
          <PatientNav isactive="log" />
        <div className='container'>
                <h3 className='header'>Login (Patient)</h3>

                <form onSubmit={handleSubmit(data=>Submit(data))}>           

                <label className='xl'>Patient ID 
                    <input {...register('patientId', {required:"Patient ID required"})} type="text" />
                    <small className='red'>{errors.patientId?.message}</small>
                </label>

                <label className='xl'>Password
                    <input {...register('password', {
                        required:"Password required",
                        minLength:{
                            value:8,
                            message:"minimum length of password is 8"
                        }
                        })} type="password" />
                        <small className='red'>{errors.password?.message}</small>
                </label>

                <button className='l submit' type="submit">Login</button>
                    or register <a href="registerpatient">here</a>
                    <br /> <br />
                    <a href="loginnurse">login</a> as a nurse
            </form>
            </div>
      </div>
    
  )
}
