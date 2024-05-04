import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],

  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];
const QuillEditor = ({ socket, docId }: { socket: any; docId: string }) => {
  console.log(docId);
  const editorRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<any>(null);
  const debouncedSave = useCallback(
    debounce(async (text) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/docs/save/${docId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              data: text,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }, 1000),
    [docId]
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill").then(({ default: Quill }) => {
        const quill = new Quill(editorRef.current!, {
          theme: "snow",
          placeholder: "Write something...",
          modules: { toolbar: toolbarOptions },
        });
        setQuill(quill);
        console.log("Quill instance:", quill);
      });
    }
  }, []);

  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/docs/getDoc/${docId}`,
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
  }, [quill, docId]);
  useEffect(() => {
    getData();
  }, [quill, docId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleChange = (delta: any, oldDelta: any, source: any) => {
      if (source !== "user") return;
      socket.emit("doc-changes", delta, docId);
      console.log(quill.getContents());
      debouncedSave(JSON.stringify(quill.getContents()));
    };

    quill && quill.on("text-change", handleChange);
    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket, docId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleChange = (delta: any, receivedDocId: string) => {
      if (receivedDocId == docId) quill.updateContents(delta);
    };
    socket && socket?.on("receive-doc-changes", handleChange);

    return () => {
      socket && socket.off("receive-doc-changes", handleChange);
    };
  }, [quill, socket, docId]);

  return <div ref={editorRef} className="h-full " />;
};

export default QuillEditor;
