'use strict';

var isChannelReady = false;
var isStarted = false;
var localStream;
var pc;
var device_id;
var sender_type = 'device';

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
    
    var localVideo = document.querySelector('#local_video');
    
    function mediaReady(stream) {
        console.log('>> mediaReady ');

        console.log('>> Adding local stream.');
        localVideo.src = window.URL.createObjectURL(stream);
        localStream = stream;
        
        console.log('Set device status to ready, id: ' + device_id);
        socket.emit('ready', device_id);
    };

    var constraints = {
        video: true
    };

    function start() {
        console.log('>>> start ', isStarted, localStream, isChannelReady);
        console.log('   --- isStarted ', isStarted);
        console.log('   --- localStream ', localStream);
        console.log('   --- isChannelReady ', isChannelReady);
        
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

        //Set Opus as the preferred codec in SDP if Opus is present.
        //sessionDescription.sdp = preferOpus(sessionDescription.sdp);

        pc.setLocalDescription(sessionDescription);
        sendMessage(sessionDescription);
    }

    function handleCreateOfferError(event) {
        console.log('createOffer error: ', event);
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

    device_id = localStorage.device_id;

    if (device_id !== "") {
        console.log('Connect the device, id: ' + device_id);
        socket.emit('create', device_id);
    }

    socket.on('created', function(device_id, device_socket_id) {
        console.log('Device id: ' + device_id + ' created successfully!');
        console.log('Device socket ID: ' + device_socket_id);

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
        .then(mediaReady)
        .catch(function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
    });
     
    socket.on('joining', function(device_id, client_socket_id) {
        console.log('Client wants to connect with the divice, ID: ' + device_id);
        console.log('Client socket ID: ' + client_socket_id);
        isChannelReady = true;
    });

    socket.on('ipaddr', function(ipaddr) {
        console.log('Message from client: Server IP address is ' + ipaddr);
    });

    socket.on('message', function(message) {
        console.log('+++ HOST received a message:' + message + ' +++');

        if (message.type === 'offer') {
            if (!isStarted) {
                start();
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
        console.log('*** HOST sending message: ' + message + ' ***');
        socket.emit('message', device_id, sender_type, message);
    };
};

window.onbeforeunload = function() {
    var message = 'bye';
    console.log('*** HOST sending message: ' + message + ' ***');
    socket.emit('message', device_id, sender_type, message);
};