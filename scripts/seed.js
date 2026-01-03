const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const mysqlHost = process.env.DB_HOST || 'localhost'
const mysqlUser = process.env.DB_USER || 'root'
const mysqlPassword = process.env.DB_PASSWORD || ''
const mysqlDatabase = process.env.DB_NAME || 'restaurant'

const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql')

const mysql = require('mysql2')
const schemaSql = fs.readFileSync(schemaPath, 'utf8')
const db = mysql.createConnection({ host: mysqlHost, user: mysqlUser, password: mysqlPassword, multipleStatements: true })

db.connect((e) => {
  if (e) { console.error('DB connect failed:', e); process.exit(1) }
  db.query(schemaSql, (sErr) => {
    if (sErr) { console.error('Failed to run schema:', sErr); process.exit(1) }
    const db2 = mysql.createConnection({ host: mysqlHost, user: mysqlUser, password: mysqlPassword, database: mysqlDatabase })
    db2.connect((e2) => {
      if (e2) { console.error('DB connect failed:', e2); process.exit(1) }
      const bcrypt = require('bcrypt')
      const hashed = bcrypt.hashSync('password123', 10)
      db2.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE email = email', ['Test User','test@example.com', hashed], (uErr) => {
        if (uErr) console.error('User insert error:', uErr)
        db2.query('SELECT id FROM users WHERE email = ?', ['test@example.com'], (sErr, rows) => {
          if (sErr) { console.error(sErr); process.exit(1) }
          const userId = rows[0].id
          db2.query('INSERT INTO orders (user_id, item, quantity) VALUES ?',[ [ [userId,'Margherita Pizza',2], [userId,'Caesar Salad',1] ] ], (oErr) => {
            if (oErr) console.error('Orders insert error:', oErr)
            db2.end()
            db.end()
          })
        })
      })
    })
  })
})
