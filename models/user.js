var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id : { type:String, unique:true, required:true },
	name : { type:String, default:'Anonymous' }
});

/* Updates an existing user. In case the user was not found we will create it. */
userSchema.statics.update_user = function(user, callback) {
	
	var r = { msg:[], status:0 };
	var filter = {
		id:user.idd
	};
	
	var options = {
		upsert:true,
		new:true
	};
		
	this.model('users').findOneAndUpdate(filter, {$set:user}, options)
		.exec(function(err,result) {
			if (err){
				console.log("userSchema - update_user: error was raized - " + err);
				r.msg.push("userSchema - update_user: error was raized - " + err);
				return callback(r);
			}

			console.log("userSchema - update_user: user was found/created.");
			r.msg.push("userSchema - update_user: user was found/created.");
			r.status = 1;
			r.user = result;
			return callback(r);
		});
};

Users = mongoose.model('users', userSchema);