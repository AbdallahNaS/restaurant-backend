const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" })

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" })
    if (result.length > 0) return res.status(409).json({ message: "Email already registered" })

    const hashed = bcrypt.hashSync(password, 10)
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed],
      (err2) => {
        if (err2) return res.status(500).json({ message: "Database error" })
        res.status(201).json({ message: "User created" })
      }
    )
  })
}

exports.login = (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: "Missing fields" })

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" })
    if (!result || result.length === 0) return res.status(401).json({ message: "Invalid credentials" })

    const user = result[0]
    const match = bcrypt.compareSync(password, user.password)

    if (!match) return res.status(401).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  })
}
