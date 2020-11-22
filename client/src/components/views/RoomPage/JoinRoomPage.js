import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FetchExam } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'
import { Checkbox, Row, Col } from 'antd';

function JoinRoomPage(props) {

  const dispatch = useDispatch();

  const [ExamId, setExamId] = useState("")
  const [Questions, setQuestions] = useState([])
  const [RoomNo, setRoomNo] = useState(0)
  const [nowQuestion, setnowQuestion] = useState([])
  const [nowQuestionidx, setnowQuestionidx] = useState(0)

  const onExamIdHandler = (event) =>{
    setExamId(event.currentTarget.value)
  }

  function onChangeHandler(checkedValues){
    console.log('checked = ', checkedValues)
  }

  // submit
  const onSubmitHandler = (event) =>{
    // 계속 새로고침 방지
    event.preventDefault();
    console.log(Questions)
    
    let body = {
      Exam_id: ExamId 
    }
    
    dispatch(FetchExam(body))
      .then(response =>{
        if (response.payload.fetchSuccess){
          setQuestions([...response.payload.QuestionIdx])
          setRoomNo(1)
        } else{
          alert('Eaxm failed')
        }
      })
    }
    
  if(RoomNo == 0){
    return (
    <div style = {{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height: '100vh'
    }}>

      <form style={{display: 'flex', flexDirection: 'column'}}
        onSubmit = {onSubmitHandler}
      >
        <label>Exam_id</label>
        <input type="text" value={ExamId} onChange={onExamIdHandler} />
        
        <br />
        <button>
          Submit
        </button>
      </form>
    </div>
   ) 
  }
  else{
    return (
      <div style = {{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height: '100vh'}}>
      <form style={{display: 'flex', flexDirection: 'column'}}>
        <Checkbox.Group style={{ width: '100%' }} onChange={onChangeHandler}>
        <Row>
          <Col span={100}>
            <Checkbox value="1"></Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={100}>
            <Checkbox value="2">{}</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={100}>
            <Checkbox value="3">C</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={100}>
            <Checkbox value="4">D</Checkbox>
          </Col>
        </Row>
        </Checkbox.Group>
      </form>
    </div>
    )
  }
}

export default withRouter(JoinRoomPage)
