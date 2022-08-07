import Link from "next/link"
import Router from "next/router"
import { useState } from "react"
import { authPage } from "../../middlewares/authorizationPage"
import Cookie from 'js-cookie'

export async function getServerSideProps(ctx) {
  const auth = await authPage(ctx)

  const postDataReq = await fetch('http://localhost:3000/api/posts', {
    headers: {
      'Authorization': 'Bearer ' + auth.token.token
    }
  })

  const postDataResp = await postDataReq.json()
  console.log(auth)

  return {
    props: {
      token: auth.token.token,
      data: postDataResp.data
    }
  }
}

export default function PostIndex(props) {
  const [posts, setPosts] = useState(props.data)

  const handleDelete = async (id, e) => {
    e.preventDefault()
    const { token } = props

    const ask = confirm('Apakah post Data akan dihapus?')
    if (ask) {
      const postsFiltered = posts.filter(item => item.id !== id)
      setPosts(postsFiltered)

      const deletePost = await fetch(`/api/posts/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
      const deleteResp = await deletePost.json()
      // console.log(deleteResp)
    }
  }

  const handleUpdate = (id, e) => {
    e.preventDefault()
    Router.push(`/posts/update/${id}`)
  }

  const handleLogout = (e) => {
    e.preventDefault()

    Cookie.remove('token')
    Router.replace('/auth/login')
  }
  // console.log(posts)
  return (
    <>
      <h1>Welcome to Posts</h1>
      <Link href='/posts/create'>
        <button>create</button>
      </Link>
      <button onClick={handleLogout}>Logout</button>
      {posts.map(item => (
        <div key={item.id} style={{ border: '1px solid black', margin: '10px' }}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <div>
            <button onClick={(e) => handleUpdate(item.id, e)}>update</button>
            <button onClick={(e) => handleDelete(item.id, e)}>delete</button>
          </div>
        </div>
      ))}
    </>
  )
}