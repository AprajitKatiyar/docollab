import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleOnClick = async () => {
    const res = await signIn("credentials", {
      email: userName,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });
    console.log(res);
  };
  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  }
  async function onSubmit() {
    const res = await signIn("credentials", {
      email: userName,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });
    console.log(res);
  }
  return (
    <div className="h-screen w-full flex">
      <div className="h-full w-full flex content-center items-center">
        <form
          className="p-8 m-auto border shadow-lg h-[480px] w-[300px]"
          onSubmit={onSubmit}
        >
          <h2 className="text-4xl text-center font-bold my-4">Welcome.</h2>
          <h3 className="text text-center font-thin my-4">
            Start collaborating right away.
          </h3>
          <div className="flex justify-center ">
            <button
              className="flex justify-center items-center border shadow-md  p-2 w-80 mr-4 rounded-sm hover:shadow-lg"
              onClick={handleGoogleSignin}
            >
              <FcGoogle className="mr-2" /> Google
            </button>
            <button className="flex justify-center items-center border shadow-md p-2 w-80 rounded-sm hover:shadow-lg">
              <AiFillFacebook className="mr-2" /> Facebook
            </button>
          </div>
          <div className="flex flex-col my-6">
            <label>Username</label>
            <input
              className="border shadow-sm focus:outline-none focus:shadow-md pl-1 py-1 text-left"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col my-6">
            <label>Password</label>
            <input
              className="border shadow-sm focus:outline-none focus:shadow-md pl-1 py-1 text-left"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button
            className="w-full border bg-indigo-600 text-white rounded-md p-2 hover:bg-indigo-400"
            type="submit"
          >
            SignIn
          </button>
          <p className="flex justify-center my-1">
            New member?{" "}
            <a href="https://www.google.com" className="underline ml-2">
              {" "}
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
