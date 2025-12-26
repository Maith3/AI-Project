const mongoose = require("mongoose");

const JournalsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        entryDateTime: {
            type: Date,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        sentiment_score: { type: Number },
        risk_level: { type: String },
        timestamp: { type: Date },
    }
);

JournalsSchema.index({userId: 1, entryDateTime: -1}, {unique: true});
module.exports = mongoose.model("Journal", JournalsSchema);