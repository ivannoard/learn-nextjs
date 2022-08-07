import { useState } from 'react'
import { authPage } from '../../middlewares/authorizationPage'
import Router from 'next/router'

export async function getServerSideProps(ctx) {
  const auth = await authPage(ctx)
  return {
    props: {
      token: auth.token
    }
  }
}

export default function CreatePost(props) {
  const [fields, setFields] = useState({
    title: '',
    content: ''
  })
  const [status, setStatus] = useState('normal')


  const handleCreate = async (e) => {
    e.preventDefault()
    const token = props.token.token
    setStatus('loading')

    const postData = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(fields)
    })

    if (!postData.ok) return setStatus('error')

    const postResp = await postData.json()
    setStatus('success')
    Router.push('/posts')
  }

  const handleChange = (e) => {
    const name = e.target.getAttribute('name')
    setFields({
      ...fields,
      [name]: e.target.value
    })
  }

  return (
    <>
      <h1>Create a Post</h1>

      <form onSubmit={handleCreate}>
        <input onChange={handleChange} type="text" placeholder="title" name="title" /><br />
        <textarea
          onChange={handleChange}
          placeholder='content'
          name='content'
        >
        </textarea><br />
        <button type="submit">Create Post</button>
        <div>
          Status: {status}
        </div>
      </form>
    </>
  )
}