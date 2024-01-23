import { loadStaticPaths } from "next/dist/server/dev/static-paths-worker";
import { useEffect, useRef, useState, useCallback } from "react";
import { Quill } from "react-quill";
import { debounce } from "lodash";

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
const QuillEditor = ({ socket, docId }: { socket: any; docId: string }) => {
  console.log(docId);
  const editorRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<any>(null);
  const debouncedSave = useCallback(
    debounce(async (text) => {
      try {
        const response = await fetch(
          "http://localhost:3001/docs/save/" + docId,
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
      //console.log("Debounced API call:", text);
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
        "http://localhost:3001/docs/getDoc/" + docId,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        quill.setContents([{ insert: "\n" }]);
        quill.setContents(JSON.parse(data.doc.data));
      } else {
        throw new Error("Error while fetching doc");
      }
    } catch (error) {
      console.log("Error while fetching doc");
    }
  }, [docId]);
  // const getData = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3001/docs/getDoc/" + docId,
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       //quill.setContents([{ insert: "\n" }]);
  //       //quill.setContents(JSON.parse(data.doc.data));
  //     } else {
  //       throw new Error("Error while fetching doc");
  //     }
  //   } catch (error) {
  //     console.log("Error while fetching doc");
  //   }
  // };
  useEffect(() => {
    getData();
  }, [docId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleChange = (delta: any, oldDelta: any, source: any) => {
      if (source !== "user") return;
      socket.emit("doc-changes", delta);
      console.log(quill.getContents());
      debouncedSave(JSON.stringify(quill.getContents()));
      //console.log("pasrsed", JSON.parse(JSON.stringify(quill.getContents())));
    };

    quill && quill.on("text-change", handleChange);
    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket, docId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleChange = (delta: any) => {
      quill.updateContents(delta);
    };
    socket && socket?.on("receive-doc-changes", handleChange);

    return () => {
      socket && socket.off("receive-doc-changes", handleChange);
    };
  }, [quill, socket, docId]);

  return <div ref={editorRef} className="h-full " />;
};

export default QuillEditor;
