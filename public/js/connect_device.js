'use strict';

var isStarted = false;
var pc;
var device_id;

var pcConfig = {
    'iceServers': [
        {'url': 'stun:stun.services.mozilla.com'}, 
        {'url': 'stun:stun.l.google.com:19302'}
    ]
};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
};

var socket = io('drone-controller.herokuapp.com');

function sendMessage(message) {
    console.log('*** CLIENT sending message: ' + message + ' ***');
    socket.emit('message', message);
};

window.onload = function() {
    
    var remoteVideo = document.querySelector('#remote_video');

    function maybeStart() {
        console.log('>>> maybeStart. isStarted: ', isStarted);

        if (!isStarted) {
            console.log('>>> creating peer connection');
            createPeerConnection();
            isStarted = true;

            doCall();
        }
    };

    function createPeerConnection() {
        console.log('>>>> createPeerConnection ');
        try {
            pc = new RTCPeerConnection(null);
            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;
            console.log('>>>> RTCPeerConnnection connection was created.');
        } catch (e) {
            console.log('>>>> Failed to create RTCPeerConnnection connection, exception: ' + e.message);
            //alert('>>>> Cannot create RTCPeerConnection object.');
            return;
        }
    };
    
    function handleIceCandidate(event) {
        console.log('>>>>> handleIceCandidate');
        console.log('>>>>> icecandidate event: ', event);
        if (event.candidate) {
          sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          });
        } else {
          console.log('>>>>> End of candidates.');
        }
    }

    function handleRemoteStreamAdded(event) {
        console.log('>>>>> handleRemoteStreamAdded');
        console.log('>>>>> Remote stream added.');
        
        remoteVideo.src = window.URL.createObjectURL(event.stream);
        remoteStream = event.stream;
    }

    function handleRemoteStreamRemoved(event) {
        console.log('>>>>> handleRemoteStreamRemoved. Event: ', event);
    }

    function doCall() {
        console.log('>>>> doCall');
        console.log('>>>> Sending offer to peer');
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    function setLocalAndSendMessage(sessionDescription) {
        console.log('>>>>> setLocalAndSendMessage');
        // Set Opus as the preferred codec in SDP if Opus is present.
        //  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
        pc.setLocalDescription(sessionDescription);
        console.log('>>>>> Client sending message: ', sessionDescription);
        socket.emit('message', sessionDescription);
    }

    function handleCreateOfferError(event) {
        console.log('createOffer error: ', event);
    }
    
    device_id = localStorage.active_device_id;

    if (device_id !== "") {
        console.log('Join the device, id: ' + device_id);
        socket.emit('join', device_id);
    }
     
    socket.on('joined', function(device_id, client_socket_id) {
        console.log('Device id: ' + device_id + ' joined succesfully!');
        console.log('Client socket ID: ' + client_socket_id);  
        
        maybeStart();
    });

    socket.on('ipaddr', function(ipaddr) {
        console.log('Message from client: Server IP address is ' + ipaddr);
    });

    socket.on('message', function(message) {
        console.log('Device received a message:', message);

        if (message === 'media_ready') {
            maybeStart();
        } 
        else if (message.type === 'offer') {
            if (!isStarted) {
                maybeStart();
            }
            pc.setRemoteDescription(new RTCSessionDescription(message));
            doAnswer();
        } 
        else if (message.type === 'answer' && isStarted) {
            pc.setRemoteDescription(new RTCSessionDescription(message));
        } 
        else if (message.type === 'candidate' && isStarted) {
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            pc.addIceCandidate(candidate);
        } 
        else if (message === 'bye' && isStarted) {
            handleRemoteHangup();
        }
    });
};

window.onbeforeunload = function() {
    sendMessage('bye');
};