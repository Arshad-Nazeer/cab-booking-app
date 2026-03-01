// const API = "http://localhost:2500/api"
const API = "https://cab-booking-app-7sii.onrender.com/api"

// ================= REGISTER =================
async function register() {
    const name = document.getElementById("regName").value
    const email = document.getElementById("regEmail").value
    const password = document.getElementById("regPassword").value

    await fetch(`${API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })

    alert("Registered Successfully")
}

// ================= LOGIN =================
async function login() {
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    localStorage.setItem("token", data.token)

    window.location.href = "dashboard.html"
}

// ================= BOOK RIDE =================
async function bookRide() {
    const pickupLocation = document.getElementById("pickup").value
    const dropLocation = document.getElementById("drop").value

    await fetch(`${API}/rides/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupLocation, dropLocation })
    })

    alert("Ride Booked")
    getRides()
}

// ================= GET RIDES =================
async function getRides() {
    const res = await fetch(`${API}/rides`)
    const rides = await res.json()

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
    await fetch(`${API}/rides/${id}`, {
        method: "DELETE"
    })
    getRides()
}

// ================= PATCH =================
async function completeRide(id) {
    await fetch(`${API}/rides/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
    })
    getRides()
}