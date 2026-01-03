USE restaurant;

INSERT INTO users (name, email, password)
VALUES
  ('Test User','test@example.com','<replace_with_hashed_password>')
ON DUPLICATE KEY UPDATE email = email;
