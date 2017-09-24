var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
	
	id: { type: String, unique: true, required: true },
	name: { type: String, default: 'Game' },
    ownerId: { type: String, required: true },
	//devices: [ deviceSchema ],
	active: { type: Boolean, default: false }
});

gameSchema.statics.create = function(user_id, game_name, game_id, callback) {
	
	var r = { msg: [], status:0 };
	console.log("---create---");
	
	var query = {
		_id: game_id
	};

	this.model('games').update(query, {
		$addToSet: {
				devices: {_id: regid}
		}
	}).exec(function(err, result) {
		if (err) {
			console.log("create -- failed to create a game, error: ", err);
			
			r.msg.push("create -- failed to create a game, error: ", err);
			return callback(r);
		}

		r.msg.push("create -- game was created successfully.");
		r.status=1;

		return callback(r);
	});
};

gameSchema.statics.start = function(game_id, callback) {
	
	var r = { msg: [], status:0 };
	console.log("---create---");
	
	var query = {
		_id: game_id
	};
/*
	this.model('games').update(query, {
			$addToSet: {
					devices: {_id: regid}
			}
	}).exec(function(err, result){
			if (err){
				r.msg.push("add device to user", err);
				return callback(r);
			}

			r.msg.push("add device to user success");
			r.status=1;

			return callback(r);
		});
*/
};

gameSchema.statics.get_all = function(callback) {
	
	var r =  {msg: [], status: 0 };
	console.log("---get_all---");
	
	var query = {
		active: true
	};
	
	this.model('games').find(query)
		.exec(function(err,result){
			if (err) {
				console.log("get_all -- failed, error: ", err);
	
				r.msg.push("get_all -- failed, error: ", err);
				return callback(r);
			}

			console.log("get_all -- successfully ended.");
			
			r.msg.push("get_all -- successfully ended.");
			r.status = 1;
			r.games = result;
			return callback(r);
		});
};

//TODo...
Game = mongoose.model('games', gameSchema);