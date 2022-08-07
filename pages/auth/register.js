import { useState } from 'react'
import { unauthPage } from '../../middlewares/authorizationPage'

export async function getServerSideProps(ctx) {

  await unauthPage(ctx)

  return {
    props: {}
  }
}

export default function Register() {

  const [fields, setFields] = useState({
    email: '',
    password: ''
  })
  const [status, setStatus] = useState('normal')

  const handleRegister = async (e) => {
    e.preventDefault()

    setStatus('loading')

    const registerReq = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!registerReq.ok) return setStatus('error ' + registerReq.status)

    console.log(registerReq)
    const registerRes = await registerReq.json()
    setStatus('success')
  }

  const handleChange = (e) => {
    const inputName = e.target.getAttribute('name')
    setFields({
      ...fields,
      [inputName]: e.target.value
    })
  }

  return (
    <>
      <h1>Register Form</h1>
      <form onSubmit={handleRegister}>
        <input name='email' onChange={handleChange} type="email" placeholder="email" /><br />
        <input name='password' onChange={handleChange} type="password" placeholder="password" /><br />
        <button type="submit">Register</button><br />
        <span>status {status}</span>
      </form>
    </>
  )
}