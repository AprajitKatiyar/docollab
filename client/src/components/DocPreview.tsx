import { useEffect, useRef, useState, useCallback } from "react";
import { Quill } from "react-quill";
import { debounce } from "lodash";
import { Slide } from "@/pages/projects/[projectId]";

type DocPreviewProps = {
  item: Slide;
  isSelected: boolean;
  socket: any;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragEnd: () => void;
};
const DocPreview = ({
  item,
  isSelected,
  socket,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: DocPreviewProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill").then(({ default: Quill }) => {
        const quill = new Quill(editorRef.current!);
        setQuill(quill);
        //console.log("Doc preview Quill instance:", quill);
      });
    }
  }, []);
  useEffect(() => {
    //if (socket == null || quill == null) return;
    const handleChange = (delta: any, receivedDocId: string) => {
      console.log(delta);
      if (receivedDocId == item.id) quill.updateContents(delta);
    };
    socket && socket.on("receive-doc-changes", handleChange);

    return () => {
      socket && socket.off("receive-doc-changes", handleChange);
    };
  }, [quill, socket, item]);
  return (
    <div
      className={`w-full grid grid-cols-8 h-40 mb-4 `}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="col-span-1">{item.order}</div>
      <div
        className={`col-span-7 border-2 rounded-lg hover:border-4
    ${isSelected ? "border-[#8F48EB] border-4 " : ""}
    ${!isSelected ? "hover:border-gray-300 " : ""}`}
      >
        <div ref={editorRef} className="h-full " />
      </div>
    </div>
  );
};
export default DocPreview;
