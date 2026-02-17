import React from 'react'

function Greeting( {name}: {name: string} ) {
  return (
    <div>
        <h1>Hello, {name}!</h1>
        <p>Welcome to our blog app!</p>
    </div>
  )
}

export default Greeting