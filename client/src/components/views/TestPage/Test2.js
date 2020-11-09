import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { MakeTest } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'
import Axios from 'axios';


function TestPage(props) {
  const [Quiz, setQuiz] = useState([]);
  
  const onQuizHandler = (event) =>{
    setQuiz
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1> Simple Quiz App</h1>
        <ul>
          {quiz.map((question) => (
            <div key={question.id}>
              <h2>{question.question_text}</h2>
              {question.answers.map((answer, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      checked={ idx === selectedAnswers[question.id]} 
                      onChange={handleAnswerSelected}
                      type="radio"
                      value={idx}
                      name={question.id}
                    />
                    {answer}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </ul>
        <button onClick={handleCheckAnswers}>Submit</button>
      </header>
    </div>
  );
}

export default App;