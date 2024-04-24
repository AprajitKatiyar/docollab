import React, { useEffect, useState, useRef } from "react";
import AddNewSlide from "@/components/AddNewSlide";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

import QuillEditor from "@/components/QuillEditor";
import ReactFlowEditor from "@/components/ReactFlowEditor";
import DocPreview from "@/components/DocPreview";
import FlowPreview from "@/components/FlowPreview";
enum SlideType {
  "Doc",
  "Flow",
}
export interface Slide {
  id: string;
  name: string | null;
  type: SlideType;
  order: number;
  data: string;
}
type Doc = {
  id: string;
  name: string | null;
  order: number;
  data: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
};
type Flow = {
  id: string;
  name: string | null;
  order: number;
  data: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
};
type ProjectPageProps = {
  projectId: string;
  orderedSlides: Slide[];
};
export default function ProjectPage({
  projectId,
  orderedSlides,
}: ProjectPageProps) {
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);
  const slideUnderPreviewId = useRef<any>(null);
  const [slides, setSlides] = useState<Slide[]>(orderedSlides);

  const [selectedItem, setSelectedItem] = useState<Slide | null>(
    slides.length != 0 ? slides[0] : null
  );
  const [socket, setSocket] = useState<any | null>(null);
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
    socket.emit("joinProject", projectId);
  }, []);
  const saveOrder = async (slides: Slide[]) => {
    try {
      const response = await fetch(
        "http://localhost:3001/projects/updateSlides",
        {
          method: "PUT",
          body: JSON.stringify({
            slides: slides,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = async () => {
    let _slides = [...slides];
    const draggedItemContent = _slides.splice(dragItem.current, 1)[0];
    _slides.splice(dragOverItem.current, 0, draggedItemContent);
    for (var i = 0; i < _slides.length; i++) _slides[i].order = i + 1;

    setSlides(_slides);
    setSelectedItem(_slides[dragOverItem.current]);
    dragItem.current = null;
    dragOverItem.current = null;
    await saveOrder(_slides);
  };

  const updateOrder = async (newSlide: Slide) => {
    let _slides = [...slides];
    if (newSlide.order == slides.length + 1) _slides.push(newSlide);
    else _slides.splice(newSlide.order - 1, 0, newSlide);
    for (var i = 0; i < _slides.length; i++) _slides[i].order = i + 1;
    setSlides(_slides);
    setSelectedItem(newSlide);
    await saveOrder(_slides);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between p-2 bg-gray-100 h-30">
        <div className="w-40">
          <AddNewSlide
            handleNewDoc={async () => {
              try {
                const response = await fetch(
                  "http://localhost:3001/projects/createDoc",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      projectId: projectId,
                      order: selectedItem == null ? 1 : selectedItem.order + 1,
                      data: "",
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                );
                const data = await response.json();
                const doc = data.doc;
                const newDocSlide: Slide = {
                  id: doc.id,
                  name: doc.name,
                  type: SlideType.Doc,
                  order: doc.order,
                  data: doc.data,
                };
                await updateOrder(newDocSlide);
              } catch (error) {
                console.log(error);
              }
            }}
            handleNewFlow={async () => {
              try {
                const response = await fetch(
                  "http://localhost:3001/projects/createFlow",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      projectId: projectId,
                      order: selectedItem == null ? 1 : selectedItem.order + 1,
                      data: "",
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                );
                const data = await response.json();
                const flow = data.flow;
                const newFlowSlide: Slide = {
                  id: flow.id,
                  name: flow.name,
                  type: SlideType.Flow,
                  order: flow.order,
                  data: flow.data,
                };
                await updateOrder(newFlowSlide);
              } catch (error) {
                console.log(error);
              }
            }}
          />
        </div>
      </div>
      {!selectedItem && (
        <div className="h-full w-full flex items-center justify-center">
          Add a new doc or flow.
        </div>
      )}
      {selectedItem && (
        <div className="h-full w-full grid grid-cols-8">
          <div className="col-span-1 w-full p-4 overflow-y-auto">
            {slides.map((item, index) =>
              item.type == SlideType.Doc ? (
                <DocPreview
                  key={index}
                  item={item}
                  isSelected={selectedItem.id == item.id}
                  socket={socket}
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                  onDragStart={(e) => {
                    dragItem.current = index;
                    setSelectedItem(slides[index]);
                  }}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                />
              ) : (
                <FlowPreview
                  key={index}
                  item={item}
                  isSelected={selectedItem.id == item.id}
                  socket={socket}
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                  onDragStart={(e) => {
                    dragItem.current = index;
                    setSelectedItem(slides[index]);
                  }}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                />
              )
            )}
          </div>
          {selectedItem.type == SlideType.Doc && (
            <div className="col-span-7 h-full ">
              <QuillEditor socket={socket} docId={selectedItem.id} />
            </div>
          )}
          {selectedItem.type == SlideType.Flow && (
            <div className="col-span-7 h-full ">
              <ReactFlowEditor socket={socket} flowId={selectedItem.id} />
            </div>
          )}
        </div>
      )}
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
  const { params } = context;
  const { projectId } = params;
  let data: { docs: Doc[]; flows: Flow[] } | null = null;
  let orderedSlides: Slide[] = [];
  try {
    const userResponse = await fetch(
      "http://localhost:3001/users/" + user?.email,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const userData = await userResponse.json();
    console.log("project page user", userData);

    const projectUserResponse = await fetch(
      "http://localhost:3001/projects/addProjectUser/" + projectId,
      {
        method: "POST",
        body: JSON.stringify({
          userId: userData.user.id,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const projectUserData = await projectUserResponse.json();
    console.log("projectuserdata", projectUserData);
    const response = await fetch(
      "http://localhost:3001/projects/getAllSlides/" + projectId,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    data = await response.json();
    if (data) {
      orderedSlides = data.docs.map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: SlideType.Doc,
        order: doc.order,
        data: doc.data,
      }));
      orderedSlides = orderedSlides.concat(
        data.flows.map((flow) => ({
          id: flow.id,
          name: flow.name,
          type: SlideType.Flow,
          order: flow.order,
          data: flow.data,
        }))
      );
      orderedSlides.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      projectId,
      orderedSlides,
    },
  };
}
