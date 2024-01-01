import React, { useCallback, useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

enum Type {
  "Doc",
  "Flow",
}
export default function AddNewSlide({
  handleNewDoc,
  handleNewFlow,
}: {
  handleNewDoc: () => void;
  handleNewFlow: () => void;
}) {
  const [type, setType] = useState(Type.Doc);
  const [isDown, setIsDown] = useState(false);
  const addNewDoc = () => {
    setType(Type.Doc);
    setIsDown(false);
    handleNewDoc();
  };
  const addNewFlow = () => {
    setType(Type.Flow);
    setIsDown(false);
    handleNewFlow();
  };
  return (
    <div>
      <div className="w-full h-10 grid grid-cols-8 ">
        <button
          className="col-span-7 border-r-2  rounded-l-md bg-[#8F48EB]  text-white font-semibold  hover:bg-[#7f4ec0]"
          onClick={() => {
            if (type == Type.Doc) {
              addNewDoc();
            } else {
              addNewFlow();
            }
          }}
        >
          + New {type == Type.Doc ? "Doc" : "Flow"}
        </button>
        <button
          className="col-span-1 border-collapse bg-[#8F48EB] rounded-r-md text-white font-semibold   hover:bg-[#7f4ec0] flex justify-center items-center"
          onClick={() => {
            setIsDown(!isDown);
          }}
        >
          <IoMdArrowDropdown />
        </button>
      </div>
      <div className="flex justify-end">
        <div
          className={`w-40  rounded-sm border shadow-md ${
            isDown ? "block" : "hidden"
          }`}
        >
          <div
            className="flex justify-center items-center hover:bg-gray-100 p-2 select-none"
            onClick={addNewDoc}
          >
            Doc
          </div>
          <div
            className="flex justify-center items-center hover:bg-gray-100 p-2 select-none"
            onClick={addNewFlow}
          >
            Flow
          </div>
        </div>
      </div>
    </div>
  );
}
