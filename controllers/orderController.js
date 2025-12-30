const db = require("../db")

exports.createOrder = (req, res) => {
  const { item, quantity } = req.body

  db.query(
    "INSERT INTO orders (user_id, item, quantity) VALUES (?, ?, ?)",
    [req.userId, item, quantity],
    () => res.json({ message: "Order created" })
  )
}

exports.getOrders = (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [req.userId],
    (err, result) => res.json(result)
  )
}
