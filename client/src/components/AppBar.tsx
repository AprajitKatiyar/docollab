import React, { useCallback, useEffect, useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { MdOutlineSubject } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function AppBar() {
  const session = useSession();
  const data = session.data;
  console.log("aa", session);
  return (
    <div className="flex justify-between p-4">
      <div className="flex justify-start items-center">
        <MdOutlineSubject size="25" color="#8F48EB" />
        <h1 className="text-xl font-extrabold ml-2 select-none">Do.Collab.</h1>
      </div>
      <div className="flex justify-end">
        {data && (
          <button className="flex justify-center items-center border-collapse">
            <h1 className="font-extrabold">Hi</h1>
            <h1 className="font-extrabold bg-clip-text bg-[#8F48EB] text-transparent mr-1">
              ,{" "}
            </h1>
            <h1 className="font-extrabold">{data.user?.name?.split(" ")[0]}</h1>
            <IoMdArrowDropdown size="25" color="#8F48EB" />
          </button>
        )}
        {!data && (
          <div className="flex">
            <button className="mr-3 border-collapse text-lg font-bold">
              Login
            </button>
            <button className="border-collapse text-lg font-bold  text-[#8F48EB]">
              SignUp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
