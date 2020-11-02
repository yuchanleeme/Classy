var nameArr = new Array(),
    videoDivArr = new Array();

/*
RTCMultiConnection 함수 안에서 소켓 연결이 이뤄지며
소켓 연결 후 영상 통화, 메시지 전송 등과 관련된 모든 함수가 정의 및 구현 되어있다.
*/
var connection = new RTCMultiConnection();

/*
free signaling server 사용을 위한 코드이다.
signaling server가 없다면 상대방을 알 수 없으므로 모든 communication이 불가능하다.
 */
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

/*
웹 페이지 접속 시, 입장할 시험 방의 room-code를 입력받을 프롬프트를 띄운다.
 */
var predefinedRoomId = prompt('Please enter room-code');
connection.openOrJoin(predefinedRoomId);

/*
room-code 입력 직후, 본인의 이름을 입력할 수 있는 프롬프트를 띄운다.
(현재 개발 단계에서는 역할 구분을 위해 교사와 학생이라는 입력 값만 받아온다.)
 */
connection.extra = {
    fullName: prompt('Please Enter Your Full Name')
};

/*
세션 연결 시, 비디오 자동 실행, 오디오는 묵음 처리를 위함.
 */
connection.session = {
    audio: false,
    video: true
};

/*
브라우저에서 상대(peer)의 오디오와 비디오를 받아올 것인지 체크
 */
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: true
};

/*
index.html의 teacherSection 영역에 비디오를 추가하기 위한 코드
 */
var videosContainer = document.getElementById('teacherSection');

/*
시험 방에 접속하여 on stream 상황일 때,
교사는 자신의 웹캠, 스크린을 모든 학생들에게 공유하게 되고
모든 학생들의 웹캠, 스크린을 공유 받는다.
학생은 자산의 웹캠과 스크린을 교사에게만 공유하고
다른 학생들에게는 공유하지 않는다.
 */
connection.onstream = function(event) {
    delete event.mediaElement.id; // make sure that below DIV has unique ID in the DOM

    // 교사일 때
    if(connection.extra.fullName.includes('교사')){
        attachStream(event);
    }
    // 학생일 때
    else if(connection.extra.fullName.includes('학생')){
        if(event.extra.fullName.includes('학생')){
            return;
        }
        else if (event.extra.fullName.includes('교사')){
            attachStream(event);
        }
    }
};

/*
브라우저를 종료하게 된다면
DOM에서 자신의 데이터들을 제거한다.
 */
connection.onstreamended = function(event) {
	var div = document.getElementById(event.streamid);
	if(div && div.parentNode) {
		div.parentNode.removeChild( div ); // remove it from the DOM
	}
};

connection.addStream({
    screen: true,
    oneway: true,
    streamCallback: function(stream) {
        console.log('Screen is successfully captured: ' + stream.getVideoTracks().length);
    }
});

function attachStream(event){
    const constraints = {
        video: {
            width: 320, // 최대 너비
            //height: 1080, // 최대 높이
            frameRate: 10, // 최대 프레임
        },
    }

    if(!nameArr.includes(event.extra.fullName)){
        var div = document.createElement('div');

        div.id = event.streamid;

        if (event.extra.fullName.includes('교사')) {
            div.className = 'totalTeacherView';
            var teacherDiv = document.createElement('div');
            var teacherID_Div = document.createElement('div');
            teacherDiv.className = 'teacherView';
            teacherID_Div.className = 'teacherID';
            teacherDiv.appendChild(event.mediaElement);
            teacherID_Div.innerHTML = event.extra.fullName;
            div.appendChild(teacherDiv);
            div.appendChild(teacherID_Div);
            videoDivArr.push(teacherDiv);
            nameArr.push(event.extra.fullName);
        }
        else if (event.extra.fullName.includes('학생')) {
            div.className = 'studentView';
            div.appendChild(event.mediaElement); // appending VIDEO to DIV
            var h2 = document.createElement('h2');
            h2.innerHTML = event.extra.fullName;
            div.appendChild(h2);
            videoDivArr.push(div)
            nameArr.push(event.extra.fullName);
        }
        videosContainer.appendChild(div);
    }
    else{
        var div = videoDivArr[nameArr.indexOf(event.extra.fullName)];
        div.insertBefore(event.mediaElement, div.firstChild);
    }
}

// consider the URL as UNIQUE-ROOM-ID
// connection.openOrJoin(connection.channel);