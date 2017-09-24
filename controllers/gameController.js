var uuid = require('uuid');
var util = require('util');

exports.create_game = function(req, res, next) {

    var r = { msg: [], status: 0 };
    console.log('--create_game--');

    //util.log("body: " + util.inspect(req.body));

    var user_id = req.body.user_id;
    var game_name = req.body.game_name;

    if (!user_id || !game_name) {
        console.log('create_game - please supply all the needed information.');

        r.msg.push('create_game - please supply all the needed information.');        
		return res.json(r);
    }
    
    //create uniq id for the game
    var game_id = uuid.v4();

    console.log("create_game - user id: ", user_id);
    console.log("create_game - game name: ", game_name);
    console.log("create_game - game id: ", game_id);

    //crete new game
    var newGame = new Game({ 
        id: game_id,
        name: game_name,
        ownerId: user_id   
    });

    console.log('create_game - game object was created.');
    
    newGame.save( function(err) {
        if (err) {
            console.log('create_game - game creation failed, err: ' + err); 
            r.msg.push('create_game - game creation failed, err: ' + err);   
            return res.json(r);
        }

        console.log('create_game - game was successfully created.');    
        r.msg.push("create_game - game was successfully created.");
        r.status = 1;
        r.game_id = game_id;
		return res.json(r);
	});
};

exports.start_game = function (req, res) {
    var r = { msg: [], status: 0 };
    console.log('--start_game--');

    var game_id = req.body.game_id;
    var user_id = req.body.user_id;

    if (!game_id) {
        console.log('start_game - please supply all the needed information.');
        r.msg.push('start_game - please supply all the needed information.');        
		return res.json(r);
    }
    
    var query = {
        id: game_id,
        ownerId: user_id
    };
    
    var update = {
        active: true
    };

    Game.update(query, update, function(err) {
        if (err) {
            console.log("start_game - games failed to start, err:" + err);
            r.msg.push("start_game - games failed to start, err:" + err);        
            return res.json(r);            
        }

        console.log("start_game - game was successfully started.");
        r.msg.push("start_game - game was successfully started.");
        r.status = 1;
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
		id: game_id
    };

    Game.findOne(query, function (err, game) {
        if (err) {
            console.log("get_game_devices - fetching game devices failed, err:" + err);
            r.msg.push("get_game_devices - fetching game devices failed, err:" + err);        
            return res.json(r);            
        }

        console.log("get_game_devices - fetching game devices was successfully started.");
        r.msg.push("get_game_devices - fetching game devices was successfully started.");
        r.status = 1;
        r.devices = game.devices;
        return res.json(r);
    });
};

exports.get_all_games = function (req, res) {
	
    var r = { msg: [], status: 0 };
    console.log('--get_all_games--');

    var query = {
		active: true
	};
	
	Game.find(query, function(err, docs) {
        if (err) {
            console.log("get_all_games - failed, error: ", err);

            r.msg.push("get_all_games - failed, error: ", err);
            return callback(r);
        }

        console.log("get_all_games - started games were successfully found.");
        
        r.msg.push("get_all_games - started games were successfully found.");
        r.status = 1;
        r.games = docs;
        return res.json(r);
    });
};