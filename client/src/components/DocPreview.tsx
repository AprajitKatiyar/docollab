import { useEffect, useRef, useState, useCallback } from "react";
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
        const quill = new Quill(editorRef.current!, {
          readOnly: true,
        });
        setQuill(quill);
      });
    }
  }, []);
  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/docs/getDoc/${item.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (quill != null) {
          quill.setContents([{ insert: "\n" }]);
          quill.setContents(JSON.parse(data.doc.data));
        }
      } else {
        throw new Error("Error while fetching doc");
      }
    } catch (error) {
      console.log("Error while fetching doc");
    }
  }, [quill, item]);
  useEffect(() => {
    getData();
  }, [quill, item]);
  useEffect(() => {
    const handleChange = (delta: any, receivedDocId: string) => {
      console.log(delta);
      if (receivedDocId == item.id) quill.updateContents(delta);
    };
    socket && socket.on("receive-doc-preview-changes", handleChange);

    return () => {
      socket && socket.off("receive-doc-preview-changes", handleChange);
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
    ${
      !isSelected ? "hover:border-gray-300 " : ""
    } pointer-events-none overflow-hidden`}
      >
        <div
          ref={editorRef}
          className="h-full w-full bg-white transform scale-75"
        />
      </div>
    </div>
  );
};
export default DocPreview;
