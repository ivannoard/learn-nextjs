import jwt from 'jsonwebtoken'

export default function authorization(req, res) {
  return new Promise(function (resolve, reject) {
    const { authorization } = req.headers

    if (!authorization) return res.status(401).json({ message: 'unauthorize' })

    const authSplit = authorization.split(' ')
    const [authType, authToken] = [authSplit[0], authSplit[1]]

    if (authType !== 'Bearer') return res.status(401).json({ message: 'unauthorize' })

    return jwt.verify(authToken, 'akugantengsekali', function (err, decoded) {
      if (err) return res.status(401).json({ message: 'unauthorize' })
      return resolve(decoded)
    })
  })
}