import React, { useState } from "react";
import { ProjectView } from "@/pages/projects/create";
import { FaUserGroup } from "react-icons/fa6";
import { useRouter } from "next/router";
import { IoPerson } from "react-icons/io5";
export default function ProjectComponent({
  project,
}: {
  project: ProjectView;
}) {
  const router = useRouter();

  return (
    <div
      className="w-64 h-16 border-2 hover:border-gray-400 p-2 cursor-pointer"
      onClick={() => router.push(`/projects/${project.projectId}`)}
    >
      <p className="text-left font-semibold  truncate "> {project.name}</p>
      <div className="flex justify-start items-center">
        {project.isOwner ? (
          <IoPerson className="mr-1" />
        ) : (
          <FaUserGroup className="mr-1" />
        )}
        <p className="text-left font-thin">{project.updatedAt}</p>
      </div>
    </div>
  );
}
