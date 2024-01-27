import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import AddNewSlide from "@/components/AddNewSlide";
import { type } from "os";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

import QuillEditor from "@/components/QuillEditor";
import ReactFlowEditor from "@/components/ReactFlowEditor";
import { stringify } from "querystring";
enum SlideType {
  "Doc",
  "Flow",
}
interface Slide {
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
  //console.log(projectId);
  console.log("slides", orderedSlides);
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);
  const [slides, setSlides] = useState<Slide[]>(orderedSlides);
  const [selectedItem, setSelectedItem] = useState<Slide | null>(
    slides.length != 0 ? slides[0] : null
  );
  useEffect(() => {
    if (slides.length > 0) {
      setSelectedItem(slides[slides.length - 1]);
    }
    console.log("slides", slides);
  }, [slides]);
  const [socket, setSocket] = useState<any | null>(null);
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
    socket.emit("joinProject", projectId);
  }, []);

  const handleSort = () => {
    let _slides = [...slides];
    const draggedItemContent = _slides.splice(dragItem.current, 1)[0];
    _slides.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setSlides(_slides);
  };

  //console.log(selectedItem);
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
                      order: slides.length + 1,
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
                setSlides((oldSlides) => [...oldSlides, newDocSlide]);
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
                      order: slides.length + 1,
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
                setSlides((oldSlides) => [...oldSlides, newFlowSlide]);
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
            {slides.map((item, index) => (
              <div
                className={`w-full h-40 mb-4 border-2 rounded-lg hover:border-4
            ${selectedItem.id === item.id ? "border-[#8F48EB] border-4 " : ""}
            ${selectedItem.id !== item.id ? "hover:border-gray-300 " : ""}`}
                key={index}
                onClick={() => {
                  setSelectedItem(item);
                }}
                draggable
                onDragStart={(e) => {
                  dragItem.current = index;
                  setSelectedItem(slides[index]);
                }}
                onDragEnter={(e) => (dragOverItem.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
              ></div>
            ))}
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
  const { params } = context;
  const { projectId } = params;
  let data: { docs: Doc[]; flows: Flow[] } | null = null;
  let orderedSlides: Slide[] = [];
  try {
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
