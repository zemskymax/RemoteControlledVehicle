

exports.connectDevice = function (req, res) {

	console.log('--connectDevice--');
	
	var r = { msg: [], status: 0 };
    var device_type = req.body.device_type;
	var room_id = req.body.room_id;
	var user_name = req.body.user_name;

    if (!room_id || typeof(room_id) !== 'object') {
        r.msg.push('create_game - please supply all the needed information.');
        console.log('create_game - please supply all the needed information.');
		return res.json(r);
	}
	else {
		console.log('create_game - the data saw correctly supplied.'); 
	}

}