// Importing required modules

// 1. Importing user module to interact with the database with the user schema
const User = require('../models/user');

// User Crypto for password encryption.
const CryptoJS = require('crypto-js');

// Use JWT for token generation.
const jsonwebtoken = require('jsonwebtoken');

// Start Registeration buesness logic
exports.register = async (req, res) => {
  // Extracting password from the request body
  const { password } = req.body;
  try {
    // Encrypts the password using AES (Advanced Encryption Standard) with Secret Key
    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    )

    // Stores the new user in MongoDB (now with the encrypted password)
    const user = await User.create(req.body);
    // Creates a JWT token containing the user ID
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    );
    // Responds with the user and token
    res.status(200).json({ data: {user, token} })
    } catch (err) {
    res.status(500).json(err)
  }
}

// Start Login buesness logic
exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    // Looks for a user in the DB by username
    const user = await User.findOne({ username }).select('password username')
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username or password'
          }
        ]
      })
    }

    // Password Verification
    const decryptedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)

    if (decryptedPass !== password) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username or password'
          }
        ]
      })
    }

    // Clean up - Removes the password from the response manually (so it's not leaked)
    user.password = undefined

    // Creates another JWT token just like in register
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    // Returns the user (without password) and token
    res.status(200).json({ data: {user, token} })

  } catch (err) {
    res.status(500).json(err)
  }
}