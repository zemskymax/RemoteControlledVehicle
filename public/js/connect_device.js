'use strict';

var isStarted = false;
var pc;
var device_id;
var sender_type = 'client';

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

window.onload = function() {
    
    var remoteVideo = document.querySelector('#remote_video');

    function start() {
        console.log('>>> start. isStarted: ', isStarted);

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
            pc = new RTCPeerConnection(pcConfig);
            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;
            console.log('>>>> RTCPeerConnnection connection was created.');
        } catch (e) {
            console.log('>>>> Failed to create RTCPeerConnnection connection, exception: ' + e.message);
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
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError, sdpConstraints);
    }

    function setLocalAndSendMessage(sessionDescription) {
        console.log('>>>>> setLocalAndSendMessage');

        // Set Opus as the preferred codec in SDP if Opus is present.
        //  sessionDescription.sdp = preferOpus(sessionDescription.sdp);

        pc.setLocalDescription(sessionDescription);
        sendMessage(sessionDescription);
    }

    function handleCreateOfferError(event) {
        console.log('>>>>> createOffer error: ', event);
    }

    function doAnswer() {
        console.log('>>>> doAnswer');
        console.log('>>>> Sending answer to peer.');
        pc.createAnswer().then(
            setLocalAndSendMessage,
            onCreateSessionDescriptionError
        );
    }

    function onCreateSessionDescriptionError(error) {
        console.log('>>>>> session description error: ' + error.toString());
    }
    
    device_id = localStorage.active_device_id;

    if (device_id !== "") {
        console.log('Join the device, id: ' + device_id);
        socket.emit('join', device_id);
    }
     
    socket.on('joined', function(device_id, client_socket_id) {
        console.log('Device id: ' + device_id + ' joined succesfully!');
        console.log('Client socket ID: ' + client_socket_id);  
        
        start();
    });

    socket.on('ipaddr', function(ipaddr) {
        console.log('Message from client: Server IP address is ' + ipaddr);
    });

    socket.on('message', function(message) {
        console.log('+++ CLIENT received a message:' + message.type + ' +++');
        
        if (message.type === 'offer') { 
            if (!isStarted) {
                start();
            }
            pc.setRemoteDescription(new RTCSessionDescription(message));
            doAnswer();
        } 
        else if (message.type === 'answer' && isStarted) { //Todo. remove
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
    
    function handleRemoteHangup() {
        console.log('Session terminated.');
        stop();
    }
      
    function stop() {
        isStarted = false;
        pc.close();
        pc = null;
    }

    function sendMessage(message) {
        console.log('*** CLIENT sending message: ' + message + ' ***');
        socket.emit('message', device_id, sender_type, message);
    };
};

window.onbeforeunload = function() {
    var message = 'bye';
    console.log('*** HOST sending message: ' + message + ' ***');
    socket.emit('message', device_id, sender_type, message);
};