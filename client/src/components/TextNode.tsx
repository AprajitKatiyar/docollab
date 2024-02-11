import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

function TextNode({ data, id, updateLabel }: any) {
  const [value, setValue] = useState(data.label);
  const handleInputChange = (e: any) => {
    const newLabel = e.target.value;
    setValue(newLabel);
    updateLabel({ id, newLabel });
  };
  useEffect(() => {
    setValue(data.label);
  }, [data]);
  return (
    <div className="flex justify-center items-center shadow-md rounded-md border-2 w-52 h-16 bg-white">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="w-24 h-8 text-center border-collapse focus:outline-none"
      />

      <Handle
        type="source"
        position={Position.Left}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
export default TextNode;
