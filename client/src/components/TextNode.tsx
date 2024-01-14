import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

function TextNode({ data, id, socket }: any) {
  const [value, setValue] = useState(data.label);
  const handleInputChange = (e: any) => {
    const newLabel = e.target.value;
    data.label = newLabel;
  };
  return (
    <div>
      <input type="text" value={value} onChange={handleInputChange} />
    </div>
  );
}
export default TextNode;
