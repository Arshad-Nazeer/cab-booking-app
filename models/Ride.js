const mongoose = require("mongoose")

const rideSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupLocation: String,
    dropLocation: String,
    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" }
}, { timestamps: true })

module.exports = mongoose.model("Ride", rideSchema)