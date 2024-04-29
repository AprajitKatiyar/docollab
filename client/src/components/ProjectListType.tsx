import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

enum Type {
  "By_Me",
  "By_Anyone",
  "Not_by_me",
}
export default function ProjectListType({
  handleByMe,
  handleByAnyone,
  handleNotByMe,
}: {
  handleByMe: () => void;
  handleByAnyone: () => void;
  handleNotByMe: () => void;
}) {
  const [type, setType] = useState(Type.By_Anyone);
  const [isDown, setIsDown] = useState(false);
  const byMe = () => {
    setType(Type.By_Me);
    handleByMe();
    setIsDown(false);
  };
  const byAnyone = () => {
    setType(Type.By_Anyone);
    handleByAnyone();
    setIsDown(false);
  };
  const notByMe = () => {
    setType(Type.Not_by_me);
    handleNotByMe();
    setIsDown(false);
  };
  return (
    <div>
      <div className="w-full h-10 grid grid-cols-8 ">
        <button
          className="col-span-8 border-collapse rounded-sm text-gray font-semibold  hover:bg-gray-300 flex justify-center items-center p-2"
          onClick={() => {
            setIsDown(!isDown);
          }}
        >
          {type == Type.By_Me
            ? "Owned By Me"
            : type == Type.Not_by_me
            ? "Not Owned By Me"
            : "Owned By Ayone"}
          <IoMdArrowDropdown />
        </button>
      </div>
      <div className="flex justify-end absolute z-50">
        <div
          className={`w-40  rounded-sm border shadow-md bg-white ${
            isDown ? "block" : "hidden"
          }`}
        >
          <div
            className="flex justify-center items-center hover:bg-gray-100 p-2 select-none"
            onClick={byMe}
          >
            Owned by Me
          </div>
          <div
            className="flex justify-center items-center hover:bg-gray-100 p-2 select-none"
            onClick={byAnyone}
          >
            Owned by Anyone
          </div>
          <div
            className="flex justify-center items-center hover:bg-gray-100 p-2 select-none"
            onClick={notByMe}
          >
            Not Owned by Me
          </div>
        </div>
      </div>
    </div>
  );
}
