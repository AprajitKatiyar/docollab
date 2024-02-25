import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdAdd } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/user";
import { User } from "@/recoil/atoms/user";
export default function Create() {
  const user: User = useRecoilValue(userState);
  useEffect(() => {
    console.log("Saefwsef");
    console.log("user:", user);
  }, []);

  const router = useRouter();
  const handleOnClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/projects/createProject",
        {
          method: "POST",
          body: JSON.stringify({
            userId: user.id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      const project = data.project;
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full realtive">
      <div className="flex justify-center items-center w-full h-64 absolute bg-gray-100">
        <div>
          <button
            className="w-32 h-44 bg-white flex justify-center items-center border-2 hover:border-gray-300"
            onClick={handleOnClick}
          >
            <IoMdAdd size="64" color="#8F48EB" />
          </button>
          <p className="mt-3 text-center font-semibold">New project</p>
        </div>
      </div>
    </div>
  );
}
