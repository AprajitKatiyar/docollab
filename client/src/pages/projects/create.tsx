import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoMdAdd } from "react-icons/io";
export default function Create() {
  const router = useRouter();
  const handleOnClick = () => {
    //router.push();
  };

  return (
    <div className="h-full w-full realtive">
      <div className="flex justify-center items-center w-full h-64 absolute bg-gray-100">
        <div>
          <div
            className="w-32 h-44 bg-white flex justify-center items-center border-2 hover:border-gray-300"
            onClick={handleOnClick}
          >
            <IoMdAdd size="64" color="#8F48EB" />
          </div>
          <p className="mt-3 text-center font-semibold">New project</p>
        </div>
      </div>
    </div>
  );
}
