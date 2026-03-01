// const API = "http://localhost:2500/api"
const API = "https://cab-booking-app-7sii.onrender.com/api"


// ================= REGISTER =================
async function register() {
    const name = document.getElementById("regName").value.trim()
    const email = document.getElementById("regEmail").value.trim()
    const password = document.getElementById("regPassword").value.trim()

    if (!name || !email || !password) {
        alert("Please fill all fields")
        return
    }

    const res = await fetch(`${API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
        alert(data.message)
        return
    }

    alert("Registered Successfully")
}


// ================= LOGIN =================
async function login() {
    const email = document.getElementById("loginEmail").value.trim()
    const password = document.getElementById("loginPassword").value.trim()

    if (!email || !password) {
        alert("Please enter email and password")
        return
    }

    const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
        alert(data.message)
        return
    }

    localStorage.setItem("token", data.token)
    window.location.href = "dashboard.html"
}


// ================= BOOK RIDE =================
async function bookRide() {
    const pickupLocation = document.getElementById("pickup").value.trim()
    const dropLocation = document.getElementById("drop").value.trim()

    if (!pickupLocation || !dropLocation) {
        alert("Please enter pickup and drop locations")
        return
    }

    const token = localStorage.getItem("token")

    const res = await fetch(`${API}/rides/book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ pickupLocation, dropLocation })
    })

    const data = await res.json()

    if (!res.ok) {
        alert(data.message)
        return
    }

    alert("Ride Booked Successfully")
    getRides()
}


// ================= GET RIDES =================
async function getRides() {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API}/rides`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    const rides = await res.json()

    if (!res.ok) {
        alert(rides.message)
        return
    }

    const ridesDiv = document.getElementById("rides")
    ridesDiv.innerHTML = ""

    rides.forEach(ride => {
        ridesDiv.innerHTML += `
            <div class="ride-card">
                <p><strong>From:</strong> ${ride.pickupLocation}</p>
                <p><strong>To:</strong> ${ride.dropLocation}</p>
                <p><strong>Status:</strong> ${ride.status}</p>

                <button onclick="deleteRide('${ride._id}')">Delete</button>
                <button onclick="completeRide('${ride._id}')">Complete</button>
            </div>
        `
    })
}


// ================= DELETE =================
async function deleteRide(id) {
    const token = localStorage.getItem("token")

    await fetch(`${API}/rides/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    getRides()
}


// ================= PATCH =================
async function completeRide(id) {
    const token = localStorage.getItem("token")

    await fetch(`${API}/rides/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "completed" })
    })

    getRides()
}