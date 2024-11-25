const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    value: {
        type: Boolean,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("message", MessageSchema);