import { useEffect, useRef } from "react";

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
const QuillEditor = ({ socket }: { socket: any }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill").then(({ default: Quill }) => {
        const quill = new Quill(editorRef.current!, {
          theme: "snow",
          placeholder: "Write something...",
          modules: { toolbar: toolbarOptions },
        });

        console.log("Quill instance:", quill);
        console.log("socket instance", socket);
        quill.on("text-change", (delta, oldDelta, source) => {
          if (source !== "user") return;
          socket.emit("doc-changes", delta);
          console.log("Delta", delta);
        });
        socket?.on("receive-doc-changes", (delta: any) => {
          quill.updateContents(delta);
        });
      });
    }
  }, [socket]);

  return <div ref={editorRef} className="h-full " />;
};

export default QuillEditor;
