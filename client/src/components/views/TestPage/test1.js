import React, { useState } from 'react';

function App() {
  const [imgBase64, setImgBase64] = useState(""); // 파일 base64
  const [imgFile, setImgFile] = useState(null);	//파일	
  
  const handleChangeFile = (event) => {
    let reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
      }
    }
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      setImgFile(event.target.files[0]); // 파일 상태 업데이트
    }
  }
  
  return (
    <div className="App">
      <div style={{"backgroundColor": "#efefef", "width":"100px", "height" : "150px"}}>
      </div>
      <div>
      	{/* onChange 추가 */}
        <input type="file" name="imgFile" id="imgFile" onChange={handleChangeFile}/>
      </div>
    </div>
  );
}

export default App;