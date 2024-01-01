import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AddNewSlide from "@/components/AddNewSlide";

export default function ProjectPage({ projectId }: any) {
  return (
    <div className="h-screen w-full grid grid-cols-8">
      <div className="col-span-1">
        <AddNewSlide handleNewDoc={() => {}} handleNewFlow={() => {}} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { params } = context;
  const { projectId } = params;
  return {
    props: {
      projectId,
    },
  };
}
