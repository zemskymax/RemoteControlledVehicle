var uuid = require('uuid');
var util = require('util');

exports.connect_device = function (req, res) {

	var r = { msg: [], status: 0 };
	console.log('--connect_device--');

	var data = req.body;
	util.log("data: " + util.inspect(data));

	var device_type = data.device_type;
	var game_id = data.game_id;
	var user_id = data.user_id;

	console.log('device_type: ' + device_type);
	console.log('game_id: ' + game_id);
	console.log('user_id: ' + user_id);

    if (!game_id || !device_type || !user_id) {
		console.log('connect_device - please supply all the needed information.');

        r.msg.push('connect_device - please supply all the needed information.');		
		return res.json(r);
	}

	//create uniq id for the device
	var device_id = uuid.v4();

	console.log('device_id: ' + device_id);

	//crete new device
	var newDevice = new Device({ 
		id: device_id,
		type: device_type,
		gameId: game_id,
		ownerId: user_id   
	});

	console.log('connect_device - device object was created.');
	
	newDevice.save( function(err, device) {
		if (err) {
			console.log('connect_device - device creation failed, err: ' + err); 
			r.msg.push('connect_device - device creation failed, err: ' + err);   
			return res.json(r);
		}

		console.log('connect_device - device was successfully created.');    
		r.msg.push("connect_device - device was successfully created.");
		r.status = 1;
		r.device_id = device_id;
		return res.json(r);
	});
};

exports.get_game_devices = function (req, res) {
	
    var r = { msg: [], status: 0 };
    console.log('--get_game_devices--');

    var game_id = req.body.game_id;

    if (!game_id) {
        console.log('get_game_devices - please supply all the needed information.');
        r.msg.push('get_game_devices - please supply all the needed information.');        
		return res.json(r);
    }

    var query = {
		id : game_id
    };

    Game.findOne(query, function (err, game) {
        if (err) {
            console.log("get_game_devices - fetching game devices failed, err:" + err);
            r.msg.push("get_game_devices - fetching game devices failed, err:" + err);        
            return res.json(r);            
        }

		if (game.active) {
			Device.find({ gameId : game_id }, function (err, devices) {
				if (err) {
					console.log("get_game_devices - fetching game devices failed, err:" + err);
					r.msg.push("get_game_devices - fetching game devices failed, err:" + err);        
					return res.json(r);            
				}
				console.log('devices found: ' + devices.length);

				console.log("get_game_devices - fetching game devices was successfully started.");
				r.msg.push("get_game_devices - fetching game devices was successfully started.");
				r.status = 1;
				r.devices = devices;
				return res.json(r);
			});
		}
		else {
            console.log("get_game_devices - the game is not active.");
            r.msg.push("get_game_devices - the game is not active.");        
            return res.json(r);   
		}
    });
};
