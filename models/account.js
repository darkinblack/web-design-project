var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    cart: [{ dishNo: Number, quantity: Number }],
    orders: [{
    	orderDate: { type: Date, default: Date.now },
    	orderItems: [{
    		dishNo: Number,
    		quantity: Number,
	    	expectedShipDate: Date,
	    	actualShipDate: Date
    	}]
    }]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
