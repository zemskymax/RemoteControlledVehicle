var uuid = require('uuid');

module.exports.order = function (req, res) {
	var message = JSON.parse(req.body.message);
	//console.log('order - message received: ', message);
	var order = message.order;
	var action = message.action;
	console.log('order - order received: ', order);
	console.log('order - on action: ', action);
	
	sendOrderToDevice(order, action);
	
	res.status(200).send();
}

var sendOrderToDevice = function (order, action) {
	console.log('sendMessageToDevice - number of devices: ', devices.length);
	
	if(devices.length > 0) { 
		console.log('sending order - ', order, 'with action - ' , action);
		devices[devices.length-1].emit(order, { 'order': order, 'action': action});
    }
}

exports.register_user = function(req, res, next) {

	var r = { msg: [], status: 0 };
    var user_name = req.body.user_name;

    if (!user_name || typeof(user_name) !== 'object') {
        r.msg.push('create_game - please supply all the needed information.');
        onsole.log('create_game - please supply all the needed information.');
		return res.json(r);
	}
		
	//create uniq id for the game
	var user_id = uuid.v4();

	
};
