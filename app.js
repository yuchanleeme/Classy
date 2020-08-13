// express 모듈 불러오기
const express = require('express')

// socket 모듈 불러오기
const socket = require('socket.io')

// Node.js 기본 내장 모듈 불러오기
const http = require('http')

// fs 모듈을 사용하여 index.html 파일을 읽고 클라이언트로 읽은 내용을 전달
// 파일과 관련된 처리를 할 수 있는 모듈
const fs = require('fs')

// express 객체 생성
const app = express()

// express http 서버 생성
const server = http.createServer(app)

// 생성된 서버를 socket.io에 바인딩
const io = socket(server)

// 정적파일을 제공하기 위해 미들웨어(Middleware)를 사용하는 코드
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

//Get 방식으로 / 경로에 접속하면 실행 됨
app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data) {
        if (err) {
            response.send('Error')
        }
        else {
            response.writeHead(200, {'Content-Type' : 'text/html'}) // HTML 파일이라는 것을 알려야하기 때문에 헤더에 해당 내용을 작성해서 보낸다
            response.write(data) // HTML 데이터를 보낸다
            response.end() // 모두 보냈으면 완료됐음을 알린다, write를 통해 응답할 경우 꼭! end를 사용해야 한다!
        }
    })
})

io.sockets.on('connection', function(socket) {

    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.on('newUser', function(name) {
      console.log(name + ' 님이 접속하였습니다.')
  
      /* 소켓에 이름 저장해두기 */
      socket.name = name
  
      /* 모든 소켓에게 전송 */
      io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
    })
  
    /* 전송한 메시지 받기 */
    socket.on('message', function(data) {
      /* 받은 데이터에 누가 보냈는지 이름을 추가 */
      data.name = socket.name
      
      console.log(data)
  
      /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.emit('update', data);
    })
  
    /* 접속 종료 */
    socket.on('disconnect', function() {
      console.log(socket.name + '님이 나가셨습니다.')
  
      /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
  })

// 서버를 8080포트로 listen
// listen 메소드를 통해 원하는 포트번호로 서버를 시작할 수 있다.
server.listen(8080, function() {
    console.log('서버 실행 중...')
})