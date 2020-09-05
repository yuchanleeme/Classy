var connection = new RTCMultiConnection();

// this line is VERY_important
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.extra = {
    // divBGColor: prompt('Please enter DIV background color.') // 영역 배경 색깔 채우기
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
connection.onstream = function(event) {
	delete event.mediaElement.id; // make sure that below DIV has unique ID in the DOM
	
    var div = document.createElement('div');
	div.id = event.streamid;
    div.className = 'video-div';
    div.appendChild(event.mediaElement); // appending VIDEO to DIV

    var h2 = document.createElement('h2');
    // h2.innerHTML = event.extra.divBGColor;
    h2.innerHTML = event.extra.fullName;
    div.appendChild(h2);
	
	div.style.backgroundColor = event.extra.divBGColor;

    videosContainer.appendChild(div);
};

connection.onstreamended = function(event) {
	var div = document.getElementById(event.streamid);
	if(div && div.parentNode) {
		div.parentNode.removeChild( div ); // remove it from the DOM
	}
};

// consider the URL as UNIQUE-ROOM-ID
connection.openOrJoin(connection.channel);