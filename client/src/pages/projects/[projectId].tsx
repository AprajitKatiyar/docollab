import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import AddNewSlide from "@/components/AddNewSlide";
import { type } from "os";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

import QuillEditor from "@/components/QuillEditor";
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
const slides: Slide[] = [
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
    type: SlideType.Doc,
    order: 2,
    data: "ydtjtyj",
  },
  {
    id: "3",
    name: "First",
    type: SlideType.Doc,
    order: 3,
    data: "vzzxcv",
  },
  {
    id: "4",
    name: "First",
    type: SlideType.Doc,
    order: 4,
    data: "tyjtyj",
  },
  {
    id: "5",
    name: "First",
    type: SlideType.Doc,
    order: 5,
    data: "vsdvzv",
  },
  {
    id: "6",
    name: "First",
    type: SlideType.Doc,
    order: 6,
    data: "tdyjtdy",
  },
  {
    id: "7",
    name: "First",
    type: SlideType.Doc,
    order: 7,
    data: "ersgergh",
  },
  {
    id: "8",
    name: "First",
    type: SlideType.Doc,
    order: 8,
    data: "sdvsdv",
  },
  {
    id: "9",
    name: "First",
    type: SlideType.Doc,
    order: 9,
    data: "dsvsdv",
  },
  {
    id: "10",
    name: "First",
    type: SlideType.Doc,
    order: 10,
    data: "casecse",
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
export default function ProjectPage({ projectId }: any) {
  console.log(projectId);
  const [selectedItem, setSelectedItem] = useState<Slide>(slides[0]);

  console.log(selectedItem);
  return (
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
      <div className="col-span-7 h-full overflow-y-auto">
        <QuillEditor />
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
