var io;
const util = require('util');

module.exports.init =  function (http) {
    io = require('socket.io')(http);

    io.on('connection', function (socket) {
		//TODO. remove
		var socket_id = socket.id;
		console.log("socket is connected, id: ", socket_id);
		
		//***HOST functions***//
		socket.on('create', function(device_id) {
			console.log('REQUEST - create the device, id: ' + device_id);

//			var nsp = io.of(user._id);
//			clients[user._id] = nsp;
			
			//this is a device socket
			routing_data[device_id]  = [];
			routing_data[device_id].device = io.of(socket);

			socket.join(device_id);
			socket.emit('created', device_id, socket.id);
		});

		socket.on('ready', function(device_id) {
			console.log('REQUEST - media is ready, id: ' + device_id);

			//TODO. SET THE DEVICE STATUS TO ACTIVE
		});
		//***----------------***//

		//***CLIENT functions***//
		socket.on('join', function(device_id) {
			console.log('REQUEST - join the device, id: ' + device_id);
			
			// this is a client socket	
			if (routing_data[device_id] !== undefined) {
				console.log('Client is registrated succesfully!');			
				routing_data[device_id].client = io.of(socket);
				routing_data[device_id].device.emit('joininig', device_id, socket.id);				
			}
			else {
				console.log('Client registration failed!');			
			}

			//io.sockets.in(device_id).emit('joininig', device_id, socket.id);
			socket.join(device_id);			
			socket.emit('joined', device_id, socket.id);
		});
		//***----------------***//

		//***GENERAL functions***//
		socket.on('message', function(device_id, sender_type, message) {

			var msg = '';
			if (message.type !== undefined) {
				msg = message.type;
			} 
			else {
				msg = message;
			}

			console.log('-->message received: ' + msg + '<--');
			console.log('-->the device is: ' + device_id + '<--');
			console.log('-->the sender type is: ' + sender_type + '<--');

			if (routing_data[device_id] !== undefined) { 
				if (sender_type === 'client') {
					routing_data[device_id].device.emit('message', message);
				}
				else if (sender_type === 'device') {
					routing_data[device_id].client.emit('message', message);
				}
			}
			else {
				console.log('No socket belongs to this device!');
			}
		});

		//console.log("device: ", util.inspect(socket, false, null));
		
        socket.on('connect_failed', function(cf) { 
			console.log('socket connection has failed - ', cf); 
			delete devices[0]; 
			devices.pop();
		});
			
        socket.on('disconnect', function (cd) { 
			console.log('device was disconnected - ', cd);
			// remove the device from the array
			//delete devices[socket.id]; 
			
			
			//delete devices[0]; 
			//devices.pop();			
		});
		
		socket.on('shutdown', function (msg) {
			console.log('SERVER - greeting message: ', msg);
			//socket.emit('greeting', 'SERVER - back to you');
			if (devices.length > 0) {
				devices[devices.length-1].emit('greeting', 'SERVER - back to you');
			}
		});
		//***----------------***//
    });
}

module.exports.connectDevice = function(device) {
	
    console.log('connectDevice');
	
	console.log('device', device)
	
    var nsp = io.of(device);
    //devices[device.id] = nsp;
	devices.push(device);
	
    console.log("sockets on device was connected", Object.keys(io.nsps));
	
    setTimeout(function(){
        nsp.emit('on device connected', 'welcome ');

        setInterval(function(){
            nsp.emit('ping', 'ping');
        },10000);
    },1000)

}
