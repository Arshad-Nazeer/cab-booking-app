require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")

const app = express()

// 🔥 Middleware FIRST
app.use(cors())
app.use(express.json())

// 🔥 Static folder AFTER app is created
app.use(express.static(path.join(__dirname, "public")))

// 🔥 Then routes
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/rides", require("./routes/rideRoutes"))

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

app.get("/", (req, res) => {
    res.send("Cab Booking API Running")
})

const PORT = process.env.PORT || 2500
app.listen(PORT, () => console.log(`Server running on ${PORT}`))