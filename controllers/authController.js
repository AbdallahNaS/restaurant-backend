const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = (req, res) => {
  const { name, email, password } = req.body
  const hashed = bcrypt.hashSync(password, 10)

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    () => res.json({ message: "User created" })
  )
}

exports.login = (req, res) => {
  const { email, password } = req.body

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (result.length === 0) return res.status(401).json({ message: "Invalid" })

      const user = result[0]
      const match = bcrypt.compareSync(password, user.password)

      if (!match) return res.status(401).json({ message: "Invalid" })

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
      res.json({ token })
    }
  )
}
