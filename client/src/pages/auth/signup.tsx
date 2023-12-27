import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const router = useRouter();

  const handleOnClick = async () => {
    const res = await signIn("signup", {
      email: email,
      password: password,
      name: firstName + " " + lastName,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/");
    }
    console.log(res);
  };
  return (
    <div className="relative h-screen w-full flex ">
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
        <div className="p-8 m-auto border shadow-lg h-[520px] w-[300px] bg-white">
          <h2 className="text-4xl text-center font-bold my-4">Welcome.</h2>
          <h3 className="text text-center font-thin my-4">
            Sign up and start collaborating.
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
          <div className="grid grid-cols-2 gap-1 my-3">
            <div className="flex flex-col">
              <label>First Name</label>
              <input
                className="border shadow-sm focus:outline-none focus:shadow-md pl-1 py-1 text-left"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
            </div>
            <div className="flex flex-col">
              <label>Last Name</label>
              <input
                className="border shadow-sm focus:outline-none focus:shadow-md pl-1 py-1 text-left"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </div>
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
            SignUp
          </button>
          <p className="flex justify-center my-1">
            Already a member?{" "}
            <Link href="/auth/signin" className="underline ml-2">
              {" "}
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
