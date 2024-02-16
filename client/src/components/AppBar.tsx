import React, { useState } from "react";
import { MdOutlineSubject } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function AppBar() {
  const [isDown, setIsDown] = useState(false);
  const session = useSession();
  const data = session.data;
  const router = useRouter();

  const handleLogout = () => {
    signOut();
  };
  const handleCreate = () => {};

  return (
    <div className="flex justify-between p-4  z-50 w-full">
      <div
        className="flex justify-start items-center"
        onClick={() => {
          router.push("/");
        }}
      >
        <MdOutlineSubject size="25" color="#8F48EB" />
        <h1 className="text-xl font-extrabold ml-2 select-none">Do.Collab.</h1>
      </div>
      <div className="flex justify-end">
        {data && (
          <div>
            <button
              className="flex justify-center items-center border-collapse"
              onClick={() => {
                setIsDown(!isDown);
              }}
            >
              <h1 className="font-extrabold">Hi</h1>
              <h1 className="font-extrabold bg-clip-text bg-[#8F48EB] text-transparent mr-1">
                ,{" "}
              </h1>
              <h1 className="font-extrabold">
                {data.user?.name?.split(" ")[0]}
              </h1>
              <IoMdArrowDropdown size="25" color="#8F48EB" />
            </button>
            <div className="absolute right-1">
              <div className="flex justify-end">
                <div
                  className={`w-40  rounded-sm border shadow-md bg-white ${
                    isDown ? "block" : "hidden"
                  }`}
                >
                  <div
                    className="flex justify-center items-center hover:bg-gray-100 p-2 select-none z-10"
                    onClick={handleCreate}
                  >
                    Create
                  </div>
                  <div
                    className="flex justify-center items-center hover:bg-gray-100 p-2 select-none z-10"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              </div>
            </div>
          </div>
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
