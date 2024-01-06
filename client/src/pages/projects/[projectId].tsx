import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AddNewSlide from "@/components/AddNewSlide";
import { type } from "os";

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
export default function ProjectPage({ projectId }: any) {
  const [selectedItem, setSelectedItem] = useState<Slide>(slides[0]);
  console.log(selectedItem);
  return (
    <div className="h-full w-full grid grid-cols-8">
      <div className="col-span-1 w-full p-4 overflow-y-auto">
        {slides.map((item) => (
          <div
            className={`w-full h-40 mb-4 border-2 rounded-lg hover:border-4 
            ${selectedItem.id === item.id ? "border-[#8F48EB] " : ""}
            ${selectedItem.id !== item.id ? "hover:border-gray-300 " : ""}`}
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
            }}
          ></div>
        ))}
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
