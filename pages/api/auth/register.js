import db from '../../../libs/db'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  /* step register
    1. get body
    2. hash password with salt + bcrypt
    3. insert to table
    4. return json data registered user
  */

  // step 1
  const { email, password } = req.body

  // step 2
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  // step 3
  const register = await db('users').insert({
    email,
    password: hashedPassword
  })

  const registeredUser = await db('users').where({ id: register }).first()

  res.status(200)
  res.json({
    message: 'User registered successfully',
    data: registeredUser
  })
}