var connection = new RTCMultiConnection();
//test
// this line is VERY_important
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

var predefinedRoomId = prompt('Please enter room-code');
connection.openOrJoin(predefinedRoomId);

connection.extra = {
    fullName: prompt('Please Enter Your Full Name')
};

connection.session = {
    audio: true,
    video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

var videosContainer = document.getElementById('section');
connection.onstream = function h(event) {
    delete event.mediaElement.id; // make sure that below DIV has unique ID in the DOM
    // const screenConstraints = {
    //     video: {
    //         width: 320, // 최대 너비
    //         height: 240, // 최대 높이
    //         frameRate: 10, // 최대 프레임
    //     },
    // };
	
    var div = document.createElement('div');
    div.id = event.streamid;
    var vDivID = event.streamid;
    div.className = 'video-div';
    div.appendChild(event.mediaElement); // appending VIDEO to DIV
    // var screen = navigator.mediaDevices.getDisplayMedia(screenConstraints);
    // div.appendChild(screen);
    var h2 = document.createElement('h2');
    h2.innerHTML = event.extra.fullName;
    div.appendChild(h2);



    videosContainer.appendChild(div);



};

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

// consider the URL as UNIQUE-ROOM-ID
// connection.openOrJoin(connection.channel);