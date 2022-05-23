import { gql, useMutation } from '@apollo/client';
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';


const REGISTER = gql`
    mutation patientRegister($patientId:String!, $patientName:String!,  $address:String!, $password:String!){
        patientRegister(input:{patientId:$patientId, patientName:$patientName, address:$address, password:$password})
    }
`

export default function PatientRegister() {

    const {register, handleSubmit, formState:{errors}} = useForm();
    const navigate = useNavigate();

    const [registerUser, {loading, error}] = useMutation(REGISTER, {
        onCompleted:(res)=>{
            console.log(res)
            navigate('/loginpatient');
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

    const Submit = (data) =>{
        console.log(data)
        registerUser({variables: data})
    }


  return (
    <div className='container'>

        <h3 className='header'>Register as a new patient</h3>
        
        <form onSubmit={handleSubmit(data=>Submit(data))}>
           <label className='xl'>Name
               <input {...register('patientName', {required:"name required"})} type="text" />
               <small className='red'>{errors.patientName?.message}</small>
           </label>
           

           <label className='xl'>Patient ID 
               <input {...register('patientId', {required:"Patient ID required"})} type="text" />
               <small className='red'>{errors.patientId?.message}</small>
           </label>
           

           <label className='xl'>Address
               <input {...register('address', {required:"Address required"})} type="text" />
               <small className='red'>{errors.address?.message}</small>
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

           <button className='l submit' type="submit">Register</button>
            or login <a href="loginpatient">here</a>
       </form>
    </div>
  )
}
