import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Spin,
  Layout,
  PageHeader,
  Divider,
  Statistic,
  Result,
} from "antd";
import * as faceapi from "face-api.js";
import * as ml5 from "ml5";
import "antd/dist/antd.css";
import "./App.css";

const { Sider, Content } = Layout;
const { Countdown } = Statistic;

function App() {
  const [i, seti] = useState(0);
  const [roomname, setroomname] = useState("")
  const [examname, setexamname] = useState("")
  const [name, setname] = useState("")
  const [test, settest] = useState(0);

  const videoRef = useRef();
  let objectDetector;
  let classifier;

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  // video 시작 코드
  const startVideo = () => {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (videoRef.current.srcObject = stream),
      (err) => console.error(err)
    );
  };

  const startFaceApi = () => {
    let checkStart = 0;
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      checkStart++;
      if (checkStart > 10) {
        console.log("FaceApi", checkStart, detections);
      }
    }, 3000);
  };

  const startObjectDetect = async () => {
    let checkStart = 0;
    objectDetector = await ml5.objectDetector("cocossd");

    setInterval(async () => {
      await objectDetector.detect(videoRef.current, function (err, results) {
        if (err) {
          console.log(err);
          return;
        }
        checkStart++;
        if (checkStart > 10) {
          console.log("ObjectDetection", checkStart, results);
        }
      });
    }, 3000);
  };

  const startMyModel = async () => {
    let checkStart = 0;
    classifier = await ml5.imageClassifier(
      process.env.PUBLIC_URL + "/models/model.json",
      videoRef.current,
      (res) => {
        setInterval(async () => {
          await classifier.classify(videoRef.current, (error, results) => {
            if (error) {
              console.error(error);
              return;
            }

            checkStart++;
            if (checkStart > 10) {
              console.log("MyModel", checkStart, results[0]);
            }
          });
        }, 3000);
      }
    );
  };

  const startTest = async () => {
    if(test === 0) {
      document.querySelector("#startTest>span").innerHTML = "Test End";
      settest(1)
      startFaceApi();
      startObjectDetect();
      startMyModel();
    }
    else {
      seti(3)
    }
  };

  const onSubmit = (values) => {
    // join button click => 문제 가져오기 + 시험 시작
    setroomname(document.getElementById('basic_Room').value)
    setexamname(document.getElementById('basic_Exam').value)
    setname(document.getElementById('basic_UserName').value)
    seti(2);
    startVideo();
  };

  const onFinishTest = () => {
    seti(3);
  };

  useEffect( () => {
    const MODEL_URL = process.env.PUBLIC_URL + "/models";
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      seti(1);
    });
  }, []);

  if (i === 0) {
    return <Spin className="beforeTest" tip="Model Loading..."></Spin>;
  } else if (i === 1) {
    return (
      <div className="beforeTest">
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onSubmit}
        >
          <Form.Item
            id ="Room"
            label="Room"
            name="Room"
            initialValue="Room01"
            rules={[
              {
                required: true,
                message: "Please input RoomNumber!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            id = "Exam"
            label="Exam"
            name="Exam"
            initialValue="시험"
            rules={[
              {
                required: true,
                message: "Please input ExamName!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            id = "UserName"
            label="UserName"
            name="UserName"
            initialValue="사용자"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" shape="round" htmlType="submit">
              JOIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  } else if (i === 2) {
    return (
      <Layout>
        <Sider theme={"light"} width={"20vw"}>
          <PageHeader
            onBack={() => {
              console.log("back");
            }}
            title={roomname}
            subTitle={examname}
          />
          <Divider />
          <video
            className="video"
            ref={videoRef}
            autoPlay
          />
          {test === 0 ? null : (
            <Countdown
              title="Countdown"
              value={Date.now() + 1000 * 60 * 60}
              onFinish={onFinishTest}
            />
          )}
        </Sider>
        <Content>
          //문제 들어가는부분
        </Content>
        <Sider theme={"light"} width={"15vw"}>
          <Button
            id="startTest"
            type="primary"
            shape="round"
            onClick={startTest}
            style={{ margin: "0.5vh" }}
          >
            Test Start
          </Button>
          <Button
            id="startDownload"
            type="primary"
            shape="round"
            onClick={() => {}}
            style={{ margin: "0.5vh" }}
          >
            Download
          </Button>
          <Divider />
          <iframe
            src="https://service.dongledongle.com/developjik"
            title="chat"
            frameborder="0"
            width="100%"
            height="600"
          ></iframe>
        </Sider>
      </Layout>
    );
  } else if (i === 3) {
    return (
      <Result
        status="success"
        title="Successfully End Test!!!"
        extra={[
          <Button type="primary" key="console">
            홈으로
          </Button>,
        ]}
      />
    );
  }
}

export default App;
