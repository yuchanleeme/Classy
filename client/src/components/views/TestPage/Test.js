import React, { useState, useEffect, useCallback } from "react";

async function fetchQuiz(id) {
  const resp = await fetch(
    `/api/quizes/${id}/questions`
  );
  const data = await resp.json();
  return data;
}

function App() {
  const [quiz, setQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  useEffect(() => {
    const id = 1;
    fetchQuiz(id).then(setQuiz);
  }, []);
  const handleAnswerSelected = useCallback(
    (ev) => {
      console.log(ev);
      const { name, value } = ev.target;
      setSelectedAnswers((oldData) => ({ ...oldData, [name]: Number(value)}));
    },
    [setSelectedAnswers]
  );
  const handleCheckAnswers = useCallback(
    (ev) => {
      console.log(quiz, selectedAnswers)
      const allCorrect = quiz.every((question) => question.correct_answer_index === selectedAnswers[question.id])
      alert(allCorrect ? 'You win!' : 'Something is incorrect')
    },
    [quiz, selectedAnswers]
  );
  
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