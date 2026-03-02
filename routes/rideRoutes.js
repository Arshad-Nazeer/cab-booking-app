const auth = require("../middleware/auth")

const express = require("express")
const Ride = require("../models/Ride")
const router = express.Router()

// ==============================
// 🚖 POST - Book Ride
// ==============================
router.post("/book", auth, async (req, res) => {
    try {
        const { pickupLocation, dropLocation } = req.body

        if (!pickupLocation || !dropLocation) {
            return res.status(400).json({ message: "Pickup and drop required" })
        }

        // Simulated distance (1–20 km)
        const distance = Math.floor(Math.random() * 20) + 1

        // Fare logic
        const fare = distance * 15

        // ETA logic (2 min per km)
        const estimatedTime = distance * 2

        const ride = await Ride.create({
            pickupLocation,
            dropLocation,
            user: req.user.id,
            fare,
            estimatedTime
        })

        res.status(201).json(ride)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// ==============================
// 📄 GET - Get All Rides (with optional filter)
// ==============================
router.get("/", auth, async (req, res) => {
    try {
        const filter = {}

        // Optional filtering by status
        if (req.query.status) {
            filter.status = req.query.status
        }

        const rides = await Ride.find({ user: req.user.id })

        res.status(200).json(rides)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ==============================
// 🔵 PUT - Full Update Ride
// ==============================
router.put("/:id", async (req, res) => {
    try {
        const { pickupLocation, dropLocation, status } = req.body

        if (!pickupLocation || !dropLocation || !status) {
            return res.status(400).json({ message: "All fields required for full update" })
        }

        const updatedRide = await Ride.findByIdAndUpdate(
            req.params.id,
            { pickupLocation, dropLocation, status },
            { new: true, runValidators: true }
        )

        if (!updatedRide) {
            return res.status(404).json({ message: "Ride not found" })
        }

        res.status(200).json(updatedRide)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ==============================
// 🟡 PATCH - Update Status Only
// ==============================
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body

        const allowedStatus = ["pending", "accepted", "completed", "cancelled"]

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" })
        }

        const ride = await Ride.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" })
        }

        res.status(200).json(ride)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ==============================
// 🔴 DELETE - Delete Ride
// ==============================
router.delete("/:id", async (req, res) => {
    try {
        const ride = await Ride.findByIdAndDelete(req.params.id)

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" })
        }

        res.status(200).json({ message: "Ride deleted successfully" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ==============================
// 🟣 HEAD - Count Rides
// ==============================
router.head("/", async (req, res) => {
    try {
        const count = await Ride.countDocuments()
        res.set("X-Total-Count", count)
        res.status(200).end()
    } catch (err) {
        res.status(500).end()
    }
})

module.exports = router
