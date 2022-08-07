import { useState, useEffect } from 'react'
import Cookie from 'js-cookie'
import Router from 'next/router'
import { unauthPage } from '../../middlewares/authorizationPage'

export async function getServerSideProps(ctx) {

  await unauthPage(ctx)

  return {
    props: {}
  }
}

export default function Login() {

  const [fields, setFields] = useState({
    email: '',
    password: ''
  })

  const [status, setStatus] = useState('normal')

  // useEffect(() => {
  //   const cookie = Cookie.get('token')
  //   console.log(cookie)
  //   if (cookie) Router.push('/posts')
  // }, [])

  const handleChange = (e) => {
    const inputName = e.target.getAttribute('name')
    setFields({
      ...fields,
      [inputName]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setStatus('loading')

    const loginReq = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'content-type': 'application/json'
      }
    })

    if (!loginReq.ok) return setStatus('error ' + loginReq.status)

    const loginRes = await loginReq.json()

    setStatus('success')

    Cookie.set('token', loginRes.token)

    Router.push('/posts')
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input name='email' onChange={handleChange} type="email" placeholder='email' />
        <input name='password' onChange={handleChange} type="password" placeholder="password" />
        <button type='submit'>Login</button>
        <div>status: {status}</div>
      </form>
    </>
  )
}