import db from '../../../libs/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  /*
    Step login with compare bcrypt + jwt assign
    1. get body
    2. get user
    3. compare password
    4. jwt assign
    5. return with data + token
  */

  // step 1 : get body request
  const { email, password } = req.body;

  // step 2 : get user + validation
  const checkUser = await db('users').where({ email }).first()
  if (!checkUser) return res.status(401).end()

  // step 3 compare password + password validation 
  const checkPassword = await bcrypt.compare(password, checkUser.password)
  if (!checkPassword) return res.status(401).end()

  // step 4 : jwt assign
  const token = jwt.sign({
    id: checkUser.id,
    email: checkUser.email
  }, 'akugantengsekali', {
    expiresIn: '7d'
  })

  res.status(200)
  res.json({
    message: 'Login successfully',
    token
  })
}