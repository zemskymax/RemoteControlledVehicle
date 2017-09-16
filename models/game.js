var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
	
	id: { type: String, unique: true, required: true },
	name: { type: String, default: 'Game' },
    userId: { type: String, required: true },
	devices: [ deviceSchema ],
	active: { type: Boolean, default: false }
});

gameSchema.statics.create_game = function(user_id, game_name, game_id, callback) {
	
	var r = { msg: [], status:0 };
	var query = {
		_id:user_id
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
}

Game = mongoose.model('games', gameSchema);