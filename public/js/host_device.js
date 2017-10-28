'use strict';

var isChannelReady = false;
var isStarted = false;
var localStream;
var pc;

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

window.onload = function() {
    
    var localVideo = document.querySelector('#localVideo');
    //TODO. goes to another page
    var remoteVideo = document.querySelector('#remoteVideo');
    
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
    .then(gotStream)
    .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
    });

    function gotStream(stream) {
        console.log('>> gotStream ');

        console.log('>> Adding local stream.');
        localVideo.src = window.URL.createObjectURL(stream);
        localStream = stream;
        
        var message = 'got user media';
        console.log('>> Client: send message: ' + message);

        socket.emit('message', message);

        maybeStart();
    };

    var constraints = {
        video: true
    };

    function maybeStart() {
        console.log('>>> maybeStart ', isStarted, localStream, isChannelReady);

        if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
            console.log('>>> creating peer connection');
            createPeerConnection();
            pc.addStream(localStream);
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
        //TODO. place on the other page
        remoteVideo.src = window.URL.createObjectURL(event.stream);
        remoteStream = event.stream;
    }

    function handleRemoteStreamRemoved(event) {
        console.log('>>>>> handleRemoteStreamRemoved. Event: ', event);
    }

    function doCall() {
        console.log('>>>> doCall');
        console.log('Sending offer to peer');
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    function handleCreateOfferError(event) {
        console.log('createOffer error: ', event);
    }

    function setLocalAndSendMessage(sessionDescription) {
        console.log('>>>>> setLocalAndSendMessage');
        // Set Opus as the preferred codec in SDP if Opus is present.
        //  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
        pc.setLocalDescription(sessionDescription);
        console.log('>>>>> Client sending message: ', sessionDescription);
        socket.emit('message', sessionDescription);
    }

    var socket = io();

    window.device_id = localStorage.device_id;

    if (device_id !== "") {
        console.log('Device is ready for action, id: ' + device_id);
        socket.emit('create', device_id);
    }

    socket.on('created', function(device_id, device_socket_id) {
        console.log('Created room ' + device_id);
        console.log('Device socket ID: ' + device_socket_id);
    });
     
    socket.on('joining', function(device_id, user_socket_id) {
        console.log('A peer made a request to connect with the divice, ID: ' + device_id);
        console.log('Peer socket ID: ' + user_socket_id);
        isChannelReady = true;
    });

    //TODO. goes to another page
    socket.on('joined', function(device_id, user_id) {
        isInitiator = false;
    });

    socket.on('ipaddr', function(ipaddr) {
        console.log('Message from client: Server IP address is ' + ipaddr);
    });

    socket.on('message', function(message) {
        console.log('Device received a message:', message);

        if (message === 'got user media') {
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

    function sendMessage(message) {
        console.log('Client sending message: ', message);
        socket.emit('message', message);
    };
};

window.onbeforeunload = function() {
    sendMessage('bye');
};