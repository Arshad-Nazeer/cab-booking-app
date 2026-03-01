const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

// ================= REGISTER =================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // 🔒 Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        // 🔍 Check duplicate email
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(200).json({ token })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
// const express = require("express")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

// const router = express.Router()

// // Register
// router.post("/register", async (req, res) => {
//     const { name, email, password, role } = req.body

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         role
//     })

//     res.json(user)
// })

// // Login
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body

//     const user = await User.findOne({ email })
//     if (!user) return res.status(400).json({ msg: "User not found" })

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

//     res.json({ token })
// })

// module.exports = router