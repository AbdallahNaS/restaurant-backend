const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const orderRoutes = require("./routes/orderRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)

app.listen(process.env.PORT)
