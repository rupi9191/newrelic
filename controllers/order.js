var Order = require('../models/order');
var orderCtrl = {};

orderCtrl.newOrder = function(req, res) {
    const newOrder = new Order({
        orderId: "1",
        userId: 1,
        orderStatus: 1
    });
    console.log("entered");
    newOrder.save(function(err, order){
        if (err) res.json({error: "Order failed"});
        res.json(order);
    });
}

module.exports = orderCtrl;