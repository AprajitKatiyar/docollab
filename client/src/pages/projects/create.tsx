import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoMdAdd } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/user";
import ProjectComponent from "@/components/ProjectComponent";
import { User } from "@/recoil/atoms/user";
import ProjectListType from "@/components/ProjectListType";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export type ProjectView = {
  projectId: string;
  name: string;
  isOwner: boolean;
  updatedAt: string;
};
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();

  if (date.toDateString() === currentDate.toDateString()) {
    return (
      "Today at  " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}
export default function Create({
  userProjects,
}: {
  userProjects: ProjectView[];
}) {
  const user: User = useRecoilValue(userState);
  useEffect(() => {
    console.log("user:", user);
  }, []);

  const [projects, setProjects] = useState<ProjectView[]>(userProjects);
  const router = useRouter();
  const handleOnClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/createProject`,
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
    <div className="h-full w-full relative">
      <div className="flex justify-center items-center w-full h-64 bg-gray-100">
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
      <div className=" h-14 flex justify-between mx-52 my-5">
        <p className=" text-center font-semibold">Recent Projects</p>
        <ProjectListType
          handleByMe={() => {
            const filteredProjects = userProjects.filter(
              (project) => project.isOwner === true
            );
            setProjects(filteredProjects);
          }}
          handleByAnyone={() => {
            setProjects(userProjects);
          }}
          handleNotByMe={() => {
            const filteredProjects = userProjects.filter(
              (project) => project.isOwner === false
            );
            setProjects(filteredProjects);
          }}
        />
      </div>
      <div className="grid grid-cols-5 mx-52 gap-y-12">
        {projects.map((proj) => (
          <ProjectComponent project={proj}></ProjectComponent>
        ))}
      </div>
    </div>
  );
}
export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  } else {
    var user = session.user;
  }
  var allProjectsData;
  let userProjects: ProjectView[] = [];

  try {
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const userData = await userResponse.json();
    const allProjects = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/getAllProjects/`,
      {
        method: "PUT",
        body: JSON.stringify({
          userId: userData.user.id,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    allProjectsData = await allProjects.json();
    var projectsData = allProjectsData.allProjects;
    if (projectsData) {
      userProjects = projectsData.map((proj: any) => ({
        projectId: proj.projectId,
        isOwner: proj.isOwner,
        name: proj.project.name,
        updatedAt: formatDate(proj.project.updatedAt),
      }));
    }
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      userProjects,
    },
  };
}
