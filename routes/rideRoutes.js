const express = require("express")
const Ride = require("../models/Ride")
const router = express.Router()



// ✅ POST - Book a Ride
router.post("/book", async (req, res) => {
    try {
        const ride = await Ride.create(req.body)
        res.status(201).json(ride)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// ✅ GET - Get All Rides
router.get("/", async (req, res) => {
    try {
        const rides = await Ride.find().populate("user driver")
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
        const updatedRide = await Ride.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!updatedRide)
            return res.status(404).json({ message: "Ride not found" })

        res.status(200).json(updatedRide)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ==============================
// 🟡 PATCH - Partial Update (Status Only)
// ==============================
router.patch("/:id/status", async (req, res) => {
    try {
        const ride = await Ride.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

        if (!ride)
            return res.status(404).json({ message: "Ride not found" })

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

        if (!ride)
            return res.status(404).json({ message: "Ride not found" })

        res.status(200).json({ message: "Ride deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ==============================
// 🟣 HEAD - Check if rides exist
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