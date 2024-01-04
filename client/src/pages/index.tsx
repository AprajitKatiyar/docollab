import React, { useCallback, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Home() {
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
            Combine the power of realtime collaborative document editing and
            flow creation all in one platform.
          </p>
        </div>
      </div>
      <div className="absolute bottom-56 right-0 w-60 h-52 bg-gray-100">
        <div className="relative w-60 right-36 top-10">
          <h1 className="text-2xl font-bold">Interactive Widgets</h1>
          <p className="py-2 text-gray-600">
            Combine the power of realtime collaborative document editing and
            flow creation all in one platform.
          </p>
        </div>
      </div>
    </div>
  );
}
