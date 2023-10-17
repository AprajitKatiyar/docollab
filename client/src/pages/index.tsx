import { Inter } from 'next/font/google'
import {signIn, useSession, signOut} from "next-auth/react"


export default function Home() {
  const session = useSession();
  console.log(session);
  console.error(session)
  return (
    <div style={{height: 60, background: "white", padding: 10}}>
      {session.data && <div style={{display: "flex", justifyContent: "space-between"}}>
        <h3 color='black'>
          {session.data.user?.email}
        </h3>
        <div>
          <button color='black' onClick={() => signOut()}>Logout</button>
        </div>
        </div>}
      {!session.data && <div style={{display: "flex", justifyContent: "space-between"}}>
        <h3 color='black' >
          Docollab
        </h3>
        <div>
          <button color='black' onClick={() => signIn('google')}>Sign In</button>
        </div>
      </div>}
    </div>
  )
}