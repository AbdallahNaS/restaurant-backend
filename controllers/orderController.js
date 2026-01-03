const db = require("../db")

exports.createOrder = (req, res) => {
  const { item, quantity } = req.body
  if (!item || !quantity) return res.status(400).json({ message: "Missing fields" })

  db.query(
    "INSERT INTO orders (user_id, item, quantity) VALUES (?, ?, ?)",
    [req.userId, item, quantity],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error" })
      res.status(201).json({ message: "Order created" })
    }
  )
}

exports.getOrders = (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" })
      res.json(result)
    }
  )
}

exports.updateOrder = (req, res) => {
  const { item, quantity } = req.body
  const { id } = req.params
  if (!item || !quantity) return res.status(400).json({ message: "Missing fields" })

  db.query(
    "UPDATE orders SET item = ?, quantity = ? WHERE id = ? AND user_id = ?",
    [item, quantity, id, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" })
      if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found or not authorized" })
      res.json({ message: "Order updated" })
    }
  )
}

exports.deleteOrder = (req, res) => {
  const { id } = req.params

  db.query(
    "DELETE FROM orders WHERE id = ? AND user_id = ?",
    [id, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" })
      if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found or not authorized" })
      res.json({ message: "Order deleted" })
    }
  )
}
