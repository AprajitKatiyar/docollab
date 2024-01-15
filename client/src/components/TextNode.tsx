import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

function TextNode({ data, id, updateLabel }: any) {
  //console.log("inside textnode", data.label);
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
    <div>
      <input type="text" value={value} onChange={handleInputChange} />
    </div>
  );
}
export default TextNode;
