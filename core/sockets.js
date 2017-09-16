var io;
const util = require('util');

module.exports.init =  function (http) {
    io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log("device is connected");

		devices.push(socket);
		
		//TODO. remove
		var socket_id = socket.id;
		console.log("socket id: ", socket_id);
		
		//console.log("device: ", util.inspect(socket, false, null));
		
        socket.on('connect_failed', function(cf) { 
			console.log('socket connection has failed - ', cf); 
			delete devices[0]; 
			devices.pop();
		});
			
        socket.on('disconnect', function ( cd ) { 
			console.log('device was disconnected - ', cd);
			// remove the device from the array
			//delete devices[socket.id]; 		
			delete devices[0]; 
			devices.pop();			
		});
		
		socket.on('greeting', function (msg) {
			console.log('SERVER - greeting message: ', msg);
			//socket.emit('greeting', 'SERVER - back to you');
			if (devices.length > 0) {
				devices[devices.length-1].emit('greeting', 'SERVER - back to you');
			}
		});
		
		//socket.emit('greeting', 'SERVER - good evening');
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
