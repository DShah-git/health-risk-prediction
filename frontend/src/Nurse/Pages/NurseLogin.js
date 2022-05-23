import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import NurseNav from '../Components/NurseNav';

const LOGIN = gql`
    mutation nurseLogin($nurseId:String!, $password:String!){
        nurseLogin(input:{nurseId:$nurseId, password:$password})
    }
`

export default function NurseLogin() {

  
  const {register, handleSubmit, formState:{errors}} = useForm();
  const navigate = useNavigate();

  const [loginUser, {loading, error}] = useMutation(LOGIN, {
      onCompleted:(res)=>{
          localStorage.setItem('nurse_token',res.nurseLogin);
          navigate('/homenurse');
      },
      onError:(err)=> console.log(err.message),
  })

  const Submit = (data) =>{
      loginUser({variables:data})
  }
  return (
    <div>
        <NurseNav isactive="log" />
        <div className='container'>
            <h3 className='header'>Login (Nurse)</h3>

            <form onSubmit={handleSubmit(data=>Submit(data))}>           

            <label className='xl'>Nurse ID 
                <input {...register('nurseId', {required:"Nurse ID required"})} type="text" />
                <small className='red'>{errors.nurseId?.message}</small>
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
                <br /> <br />
                <a href="loginpatient">login</a> as a patient
        </form>
        </div>
    </div>
  )
}
