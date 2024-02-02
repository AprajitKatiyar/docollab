import { useEffect, useRef, useState, useCallback } from "react";
import { Quill } from "react-quill";
import { debounce } from "lodash";
import { Slide } from "@/pages/projects/[projectId]";

type DocPreviewProps = {
  item: Slide;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragEnd: () => void;
};
const DocPreview = ({
  item,
  isSelected,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: DocPreviewProps) => {
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
        aaa
      </div>
    </div>
  );
};
export default DocPreview;
