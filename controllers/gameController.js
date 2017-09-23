var uuid = require('uuid');

exports.create_game = function(req, res, next) {

    var r = { msg: [], status: 0 };
    var user_id = req.body.user_id;
    var game_name = req.body.game_name;

    if (!user_id || typeof(user_id) !== 'object' || 
        !game_name || typeof(game_name) !== 'object') {
        r.msg.push('create_game - please supply all the needed information.');
        console.log('create_game - please supply all the needed information.');
		return res.json(r);
    }
    
    //create uniq id for the game
    var game_id = uuid.v4();

    console.log("create_game - user id: ", user_id);
    console.log("create_game - game name: ", game_name);
    console.log("create_game - game id: ", game_id);

    Game.create_game(user_id, game_name, game_id, function(result) {

		if (!result.status) {
			res.status(404).send("create_game - game creation failed");
        }
        
		return res.json(result)
	});
};

exports.get_all_games = function (req, res) {
	
		var r = { msg: [], status: 0 };
		console.log('--get_all_games--');
	

};