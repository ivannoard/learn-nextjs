import cookies from 'next-cookies'


export function unauthPage(ctx) {
  return new Promise(resolve => {
    const token = cookies(ctx)

    if (token.token)
      return ctx.res.writeHead(302, {
        Location: '/posts'
      }).end()

    return resolve('unauthorize')
  })
}

export function authPage(ctx) {
  return new Promise(resolve => {
    const token = cookies(ctx)

    if (!token.token)
      return ctx.res.writeHead(302, {
        Location: '/auth/login'
      }).end()

    return resolve({
      token
    })
  })
}