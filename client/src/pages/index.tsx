import { Inter } from "next/font/google";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  console.error(session);
  // const handleOnClick = async () => {
  //   const res = await signIn("credentials", {
  //     email: "john@gmail.com",
  //     password: "1234",
  //     redirect: true,
  //   });
  //   console.log(res);
  // };

  return (
    <div style={{ height: 60, background: "white", padding: 10 }}>
      {session.data && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 color="black">{session.data.user?.email}</h3>
          <div>
            <button color="black" onClick={() => signOut()}>
              Logout
            </button>
          </div>
        </div>
      )}
      {!session.data && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 color="black">Docollab</h3>
          <div>
            <button color="black" onClick={() => signIn()}>
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
