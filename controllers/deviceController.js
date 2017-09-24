var util = require('util');

exports.connect_device = function (req, res) {

	var r = { msg: [], status: 0 };
	console.log('--connect_device--');

	var data = req.body;
	util.log("data: " + util.inspect(data));

    var device_type = data.device_type;
	var room_id = data.room_id;
	var user_name = data.user_name;

	console.log('device_type: ' + device_type);
	console.log('room_id: ' + room_id);
	console.log('user_name: ' + user_name);

    if (!room_id || !device_type || !user_name) {
		console.log('connect_device - please supply all the needed information.');

        r.msg.push('connect_device - please supply all the needed information.');		
		return res.json(r);
	}
	else {
		console.log('connect_device - the data was correctly supplied.');

		r.status = 1;
		r.msg.push('connect_device - the data was correctly supplied.');
		return res.json(r); 
	}

	
};
