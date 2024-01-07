import { useEffect, useRef } from "react";

const QuillEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill").then(({ default: Quill }) => {
        const quill = new Quill(editorRef.current!, {
          theme: "snow",
          placeholder: "Write something...",
        });

        console.log("Quill instance:", quill);

        quill.on("text-change", (delta, oldDelta, source) => {
          console.log("Editor content changed:", quill.root.innerHTML);
        });
      });
    }
  }, []);

  return <div ref={editorRef} className="h-full " />;
};

export default QuillEditor;
