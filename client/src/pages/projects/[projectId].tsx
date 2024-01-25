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
  name: string;
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
  data: {
    docs: Doc[];
    flows: Flow[];
  };
};
const fetchedSlides: Slide[] = [
  {
    id: "1",
    name: "First",
    type: SlideType.Doc,
    order: 1,
    data: "ddfvd",
  },
  {
    id: "2",
    name: "First",
    type: SlideType.Flow,
    order: 2,
    data: "ydtjtyj",
  },
];
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];
export default function ProjectPage({ projectId, data }: ProjectPageProps) {
  //console.log(projectId);
  console.log("slides", data);
  const [slides, setSlides] = useState<Slide[]>(fetchedSlides);
  const [selectedItem, setSelectedItem] = useState<Slide>(slides[0]);
  const [socket, setSocket] = useState<any | null>(null);
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
    socket.emit("joinProject", projectId);
  }, []);

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
      <div className="h-full w-full grid grid-cols-8">
        <div className="col-span-1 w-full p-4 overflow-y-auto">
          {slides.map((item) => (
            <div
              className={`w-full h-40 mb-4 border-2 rounded-lg hover:border-4 
            ${selectedItem.id === item.id ? "border-[#8F48EB] border-4 " : ""}
            ${selectedItem.id !== item.id ? "hover:border-gray-300 " : ""}`}
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
              }}
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
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { params } = context;
  const { projectId } = params;
  let data: { docs: Doc[]; flows: Flow[] } | null = null;
  try {
    const response = await fetch(
      "http://localhost:3001/projects/getAllSlides/" + projectId,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    data = await response.json();
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      projectId,
      data,
    },
  };
}
