const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key');
const {auth} = require('./middleware/auth')
const {User} = require("./models/User");
const {QuestionList} = require("./models/QuestionList");
const {ExamList} = require("./models/ExamList");
const multer = require('multer')
const path = require('path')

// application/x-www-form-urlencoded
// 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));

// applicaion/json
// json 파일을 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB와 연동
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! here'))

app.get('/api/hello', (req, res)=>{
  res.send("HI")
})

//****************

// 업로드 이미지
app.use("/uploads", express.static("uploads"));
var storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
var upload = multer({
  storage: storage
});

app.post("/api/users/upload", upload.single("profile_img"), function(req, res, next){
  res.send({
    filename: res.req.file.path
  })
})

//*****************

// post를 보내준다.
app.post('/api/users/register', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.  
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })

})

// question upload 하기
app.post('/api/test/UploadQuestion', (req, res) => {
  const Question = new QuestionList(req.body)
  Question.save((err, QuestionInfo) =>{
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
 
})

// Exam 만들기
app.post('/api/test/maketest', (req, res) => {

  const Exam = new ExamList(req.body)

  Exam.save((err, ExamInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

// ques
app.post('/api/room/fetchexam', (req, res) => {

  ExamList.findOne({ Exam_id: req.body.Exam_id }, (err, exam) => {

    if(!exam){
      return res.json({
        fetchSuccess: false,
        message: `${req.body.Exam_id} 에 입장할 수 없습니다.`
      })
    }
    else 
      return res.status(200).json({
      fetchSuccess : true,
      QuestionIdx : exam.Questions,
      Exam_code : exam.Exam_code
    })
  })
})

// ques
app.post('/api/room/fetchquestions', (req, res) => {
  
  QuestionList.findOne({ Question_id: req.body.Question_id }, (err, questions) => {
    if(!questions){
      return res.json({
        fetchSuccess: false,
        // message: `${req.Question_id}를 가져올 수 없습니다.`
      })
    }
    else 
      return res.status(200).json({
      fetchSuccess : true,
      QuestionInfo : questions
    })
  })
})

// 로그인 라우터
app.post('/api/users/login', (req, res) => {

  // 1. 요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 2. 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) =>{
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        // 3. 비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) =>{
        if(err) return res.status(400).senc(err);

        // 토큰을 (쿠키, 로컬스토리지 등) 에 저장한다.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId : user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) =>{
  // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

// 로그 아웃
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""}, (err, user) =>{
      if(err) return res.json({success: false, err})
      return res.status(200).send({
        success: true
      })
    })
})

const port = process.env.PORT||5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// app.listen(process.env.PORT || port)
