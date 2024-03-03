import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const handleOnClick = async () => {
    const res = await signIn("login", {
      email: email,
      password: password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <div className="h-screen w-full flex relative">
      <div className="absolute h-full w-full grid grid-cols-2">
        <div className="bg-gray-100" />
        <div className="relative">
          <h1 className=" select-none ml-[-10px] text-9xl font-extrabold text-gray-100">
            Do.
          </h1>
          <h1 className="select-none ml-[-10px] text-9xl font-extrabold text-gray-100">
            Collab.
          </h1>
        </div>
      </div>
      <div className="absolute h-full w-full flex content-center items-center">
        <div className="p-8 m-auto border shadow-lg h-[480px] w-[300px] bg-white">
          <h2 className="text-4xl text-center font-bold my-4">Log in.</h2>
          <h3 className="text text-center font-thin my-4">
            Start collaborating right away.
          </h3>
          <div className="flex justify-center ">
            <button
              className="flex justify-center items-center border shadow-md  p-2 w-80 mr-4 rounded-sm hover:shadow-lg"
              onClick={() =>
                signIn("google", { redirect: false, callbackUrl: "/" })
              }
            >
              <FcGoogle className="mr-2" /> Google
            </button>
            <button className="flex justify-center items-center border shadow-md p-2 w-80 rounded-sm hover:shadow-lg">
              <AiFillFacebook className="mr-2" /> Facebook
            </button>
          </div>

          <div className="flex flex-col my-3">
            <label>Email</label>
            <input
              className="border shadow-sm focus:outline-none focus:shadow-md pl-1 py-1 text-left"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col my-3">
            <label>Password</label>
            <input
              className="border shadow-sm focus:outline-none focus:shadow-md pl-1 py-1 text-left"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button
            className="w-full border bg-[#8F48EB] text-white rounded-md p-2 hover:bg-[#7f4ec0]"
            onClick={handleOnClick}
          >
            Log in
          </button>
          <p className="flex justify-center my-1">
            New member?{" "}
            <Link href="/auth/signup" className="underline ml-2">
              {" "}
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
