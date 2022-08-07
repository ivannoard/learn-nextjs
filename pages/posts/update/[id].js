import { useState } from 'react'
import { authPage } from '../../../middlewares/authorizationPage'
import Router from 'next/router'

export async function getServerSideProps(ctx) {
  const auth = await authPage(ctx)
  const { id } = ctx.query

  const postDetail = await fetch('http://localhost:3000/api/posts/detail/' + id, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + auth.token.token
    }
  })

  const postDetailResponse = await postDetail.json()

  return {
    props: {
      token: auth.token,
      data: postDetailResponse
    }
  }
}

export default function CreatePost(props) {
  const { data } = props.data
  const [fields, setFields] = useState({
    title: data.title,
    content: data.content
  })
  const [status, setStatus] = useState('normal')

  console.log(data)

  const handleUpdate = async (e) => {
    e.preventDefault()
    const token = props.token.token
    setStatus('loading')

    const updateData = await fetch('/api/posts/update/' + data.id, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(fields)
    })

    if (!updateData.ok) return setStatus('error')

    const updateResp = await updateData.json()
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

      <form onSubmit={handleUpdate}>
        <input onChange={handleChange} type="text" placeholder="title" name="title" defaultValue={data.title} /><br />
        <textarea
          onChange={handleChange}
          placeholder='content'
          name='content'
          defaultValue={data.content}
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