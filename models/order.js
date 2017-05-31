var mongoose = require('mongoose');


var OrderSchema = mongoose.Schema({
   // userId      : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId      : { type: Number},
    orderId: String,
    orderStatus: Number
});

var Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.findByOrderId = function(id, callback) {
    var query = {orderId: id};
    Order.findOne(query,callback);
}
