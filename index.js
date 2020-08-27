var connection = new RTCMultiConnection();

// this line is VERY_important
// connection.socketURL = 'https://conewbie.xyz:443/'; // 이걸론 소켓 사용 불가 
 connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
 //connection.socketURL = 'https://welshimeat.site:9001/';

// all below lines are optional; however recommended.

connection.session = {
    audio: true,
    video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};

// connection.onstream = function (event) {
//     document.body.appendChild(event.mediaElement);
// };

// connection.offstream = function (event) {
//     document.body.removeChild(event.mediaElement);
// }

var predefinedRoomId = prompt('Please enter room-id', 'xyzxyzxyz');

connection.openOrJoin(predefinedRoomId);