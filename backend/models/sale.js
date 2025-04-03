const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    totalOrders: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    paymentBreakdown: {
    UPI: { type: Number, default: 0 },
    Cash: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Sales', salesSchema);
