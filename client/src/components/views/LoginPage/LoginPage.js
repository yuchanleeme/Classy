import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'
function LoginPage(props) {

  const dispatch = useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  // 이메일 패스워드 타이핑 하게 해줌
  const onEmailHandler = (event) =>{
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) =>{
    setPassword(event.currentTarget.value)
  }

  // submit
  const onSubmitHandler = (event) =>{
    // 계속 새로고침 방지
    event.preventDefault();
    
    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))
      .then(response =>{
        if (response.payload.loginSuccess){
          props.history.push('/')
        } else{
          alert('Error')
        }
      })

  }

  return (
    <div style = {{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height: '100vh'
    }}>

      <form style={{display: 'flex', flexDirection: 'column'}}
        onSubmit = {onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        
        <br />
        <button>
          Login
        </button>
      </form>
    </div>
    
  )
}

export default withRouter(LoginPage)
