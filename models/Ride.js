const mongoose = require("mongoose")

const rideSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    driver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    pickupLocation: { 
        type: String, 
        required: true 
    },
    dropLocation: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "accepted", "completed", "cancelled"], 
        default: "pending" 
    },
    fare: { 
        type: Number, 
        required: true 
    },
    estimatedTime: { 
        type: Number, // in minutes
        required: true 
    }
}, { timestamps: true })

module.exports = mongoose.model("Ride", rideSchema)
