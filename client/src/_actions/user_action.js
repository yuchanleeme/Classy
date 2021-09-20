import Axios from 'axios';
// import {response} from 'express';
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  UPLOAD_QUESTION,
  MAKE_TEST,
  FETCH_EXAM,
  FETCH_QUESTIONS,
  // FETCH_USER_ROLE
} from './type'

export function loginUser(dataToSubmit){

  const request = Axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data)

  return{
    type: LOGIN_USER,
    payload: request
  }
}

export function registerUser(dataToSubmit){

  const request = Axios.post('/api/users/register', dataToSubmit)
    .then(response => response.data)
  return{
    type: REGISTER_USER,
    payload: request
  }
}

export function auth(){
  const request = Axios.get('/api/users/auth')
    .then(response => response.data)
    
  return{
    type: AUTH_USER,
    payload: request
  }
}

export function UploadQuestion(dataToSubmit){

  const request = Axios.post('/api/test/upload/question', dataToSubmit)
    .then(response => response.data)

  return{
    type: UPLOAD_QUESTION,
    payload: request
  }
}

export function MakeTest(dataToSubmit){

  const request = Axios.post('/api/test/maketest', dataToSubmit)
    .then(response => response.data)

  return{
    type: MAKE_TEST,
    payload: request
  }
}

export function FetchExam(dataToSubmit){
 
  const request = Axios.post('/api/room/fetch/exam', dataToSubmit)
    .then(response => response.data)
  console.log(request)
  return{
    type: FETCH_EXAM,
    payload: request
  }
}

export function FetchQuestions(dataToSubmit){
 
  const request = Axios.post('/api/room/fetch/questions', dataToSubmit)
    .then(response => response.data)
  return{
    type: FETCH_QUESTIONS,
    payload: request
  }
}

// export function FetchUserRole(dataToSubmit){
 
//   const request = Axios.post('/api/users/fetchuserrole', dataToSubmit)
//     .then(response => response.data)
//   console.log(request)
//   return{
//     type: FETCH_USER_ROLE,
//     payload: request
//   }
// }