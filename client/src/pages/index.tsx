import React, { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms/user";

interface UserData {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function Home({ data }: { data?: UserData }) {
  console.log("data : ", data);
  const setUserState = useSetRecoilState(userState);
  useEffect(() => {
    if (data) {
      console.log("yes");
      setUserState((old) => {
        console.log("old:", old);
        return {
          ...old,
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };
      });
    }
  }, []);

  const router = useRouter();
  const handleOnClick = () => {
    router.push("/projects/create");
  };
  return (
    <div className="h-full w-full relative">
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
      <div className="absolute m-auto w-full top-[300px] flex justify-center">
        <h1 className="select-none text-6xl font-extrabold mr-2i">Where</h1>
        <h1 className="select-none text-6xl font-extrabold mr-2 bg-clip-text bg-[#8F48EB] text-transparent">
          Docs
        </h1>
        <h1 className="select-none text-6xl font-extrabold mr-2">Meet</h1>
        <h1 className="select-none text-6xl font-extrabold  bg-clip-text bg-[#8F48EB] text-transparent">
          Doodles
        </h1>
        <h1 className="select-none text-6xl font-extrabold mr-2">. </h1>
      </div>
      <div className="absolute m-auto w-full top-[500px] flex justify-center">
        <button
          className="border border-gray-400 rounded-full p-4"
          onClick={handleOnClick}
        >
          <FaArrowRight size="40" strokeWidth="2" color="#8F48EB" />
        </button>
      </div>
      <div className="absolute bottom-56 w-60 h-52 bg-white">
        <div className="relative w-60 left-36 top-10">
          <h1 className="text-2xl font-bold">Seamless Integration</h1>
          <p className="py-2 text-gray-600">
            Seamlessly switch between document editing with rich text
            capabilities and visual flowchart creation, all in real-time.
          </p>
        </div>
      </div>
      <div className="absolute bottom-56 right-0 w-60 h-52 bg-gray-100">
        <div className="relative w-60 right-36 top-10">
          <h1 className="text-2xl font-bold">Interactive Widgets</h1>
          <p className="py-2 text-gray-600">
            Stay connected with your team, share ideas, and bring concepts to
            life effortlessly. Experience fluid teamwork with our intuitive
            interface and robust collaboration features.
          </p>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  var user;
  if (session) {
    user = session.user;
  } else
    return {
      props: {
        data: null,
      },
    };
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
