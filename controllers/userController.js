const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
require('dotenv').load()

const user_login_post_controller = [
  body('username', 'Username required.').isLength({ min: 3 }).trim(),
  body('password', 'Password must atleast 6 characters.').isLength({ min:6 }),
  sanitizeBody('*'),

  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
    }
    else {
      const username = req.body.username.toLowerCase()

      const token = jwt.sign({ username: username }, process.env.jwtSecret,
        {expiresIn: 21600 })
        
      req.headers['token'] = token
      res.status(200).send({ user: username, authorized: true, token: token })
    }
  },
]

module.exports = {
  user_login_post_controller
}