import React from 'react'
import { useUser } from '@clerk/nextjs'
const Hello = () => {
    const {user} = useUser();
  return (
    <div className='  ' >Hello ,<span className='text-bold text-blue-500 text-3xl ' >{user.firstName}</span> </div>
  )
}

export default Hello