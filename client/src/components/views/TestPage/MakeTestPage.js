import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { MakeTest, UploadQuestion } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'


function MakeTestPage(props) {

  const dispatch = useDispatch();

  const [Title, setTitle] = useState("")
  const [Choice1, setChoice1] = useState("")
  const [Choice2, setChoice2] = useState("")
  const [Choice3, setChoice3] = useState("")
  const [Choice4, setChoice4] = useState("")
  const [CorrectIdx, setCorrectIdx] = useState("")

  const [ExamId, setExamId] = useState("")
  const [QuestionsIds, setQuestionsIds] = useState([])
  

  const setTitleHandler = (event) =>{ 
    setTitle(event.currentTarget.value)
  }
  const setChoiceHandler1 = (event) =>{ 
    setChoice1(event.currentTarget.value)
  }
  const setChoiceHandler2 = (event) =>{ 
    setChoice2(event.currentTarget.value)
  }
  const setChoiceHandler3 = (event) =>{ 
    setChoice3(event.currentTarget.value)
  }
  const setChoiceHandler4 = (event) =>{ 
    setChoice4(event.currentTarget.value)
  }
  const setCorrectIdxHandler = (event) =>{ 
    setCorrectIdx(event.currentTarget.value)
  }

  const setExamHandler = (event) =>{ 
    setExamId(event.currentTarget.value)
  }

  const onUploadHandler = (event) =>{
    // 계속 새로고침 방지
    event.preventDefault();
    
    let body = {
      Question_id: Math.floor( Math.random() * 100000 ),
      title: Title,
      choice : [Choice1,Choice2,Choice3,Choice4],
      correct_idx : CorrectIdx
    }

    QuestionsIds.push(body.Question_id)
    
    dispatch(UploadQuestion(body))
    .then(response => {
      if(response.payload.success){
        } else{
          alert("Failed to Upload Question Info.")
        }
      })
  }

  const onMakeTestHandler = (event) =>{
    // 계속 새로고침 방지
    
    event.preventDefault();
    console.log(QuestionsIds)
    let body = {
      Exam_id: ExamId,
      Questions : QuestionsIds
    }
 
    dispatch(MakeTest(body))
    .then(response => {
      if(response.payload.success){
          props.history.push("/")
        } else{
          alert("Failed to Send Question Info.")
        }
      })
  }

  return (
    <div style = {{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height: '100vh', flexDirection : 'column'
    }}>
 
      <form style = {{display: 'flex', flexDirection: 'column'}}
        onSubmit = {onUploadHandler}>
        <label>Question</label>
        <input type="text" value={Title} onChange={setTitleHandler} />
        <label>choice1</label>
        <input type="text" value={Choice1} onChange={setChoiceHandler1} />
        <label>choice2</label>
        <input type="text" value={Choice2} onChange={setChoiceHandler2} />
        <label>choice3</label>
        <input type="text" value={Choice3} onChange={setChoiceHandler3} />
        <label>choice4</label>
        <input type="text" value={Choice4} onChange={setChoiceHandler4} />
        <label>Correctidx</label>
        <input type="text" value={CorrectIdx} onChange={setCorrectIdxHandler} />
        <br></br>
        <button>
            Upload Question
        </button>
      </form>

      <br></br>
      <form style={{display: 'flex', flexDirection: 'column'}}
        onSubmit = {onMakeTestHandler}>
        <label>Exam_id</label>
        <input type="text" value={ExamId} onChange={setExamHandler} />
        <button>
          End make Test
        </button>
      </form>
    </div>
   
  )
}

export default withRouter(MakeTestPage)
