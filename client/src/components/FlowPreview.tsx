import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Slide } from "@/pages/projects/[projectId]";
import TextNode from "./TextNode";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
type FlowPreviewProps = {
  item: Slide;
  isSelected: boolean;
  socket: any;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragEnd: () => void;
};
function Flow({
  item,
  isSelected,
  socket,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: FlowPreviewProps) {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const { setViewport } = useReactFlow();
  const defaultViewport = { x: 0, y: 0, zoom: 0.25 };
  const getData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/flows/getFlow/" + item.id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const savedFlow = await response.json();
        if (savedFlow !== null) {
          const flow = JSON.parse(savedFlow.flow.data);

          if (flow) {
            const { x = 0, y = 0, zoom = 0.25 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
          }
        }
      } else {
        throw new Error("Error while fetching flow");
      }
    } catch (error) {
      console.log("Error while fetching flow");
    }
  };
  useEffect(() => {
    setNodes([]);
    setEdges([]);
    getData();
  }, [item]);
  useEffect(() => {
    if (socket == null) {
      return;
    }
    const handleNodeChanges = (changes: any, receivedFlowId: string) => {
      if (receivedFlowId == item.id)
        setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
    };
    const handleEdgeChanges = (changes: any, receivedFlowId: string) => {
      if (receivedFlowId == item.id)
        setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
    };
    const handleConnectionChanges = (changes: any, receivedFlowId: string) => {
      if (receivedFlowId == item.id)
        setEdges((oldEdges) => addEdge(changes, oldEdges));
    };
    const handleNewNodeChanges = (newNode: any, receivedFlowId: string) => {
      if (receivedFlowId == item.id) setNodes((nodes) => nodes.concat(newNode));
    };
    const handeNodeLabelChanges = (
      id: string,
      newLabel: string,
      receivedFlowId: string
    ) => {
      if (receivedFlowId == item.id) udpateNodes(id, newLabel);
    };

    socket && socket.on("receive-node-preview-changes", handleNodeChanges);
    socket && socket.on("receive-edge-preview-changes", handleEdgeChanges);
    socket &&
      socket.on("receive-connection-preview-changes", handleConnectionChanges);
    socket &&
      socket.on("receive-newnode-preview-changes", handleNewNodeChanges);
    socket &&
      socket.on("receive-nodelabel-preview-changes", handeNodeLabelChanges);

    return () => {
      socket && socket.off("receive-node-preview-changes", handleNodeChanges);
      socket && socket.off("receive-edge-preview-changes", handleEdgeChanges);
      socket &&
        socket.off(
          "receive-connection-preview-changes",
          handleConnectionChanges
        );
      socket &&
        socket.off("receive-newnode-preview-changes", handleNewNodeChanges);
      socket &&
        socket.off("receive-nodelabel-preview-changes", handeNodeLabelChanges);
    };
  }, [socket, item]);
  const udpateNodes = useCallback(
    (id: string, newLabel: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                },
              }
            : node
        )
      );
    },
    [setNodes, item, rfInstance]
  );
  const updateLabel = ({ id, newLabel }: any) => {
    udpateNodes(id, newLabel);
  };
  const nodeTypes = useMemo(() => {
    return {
      custom: (props: any) => <TextNode {...props} updateLabel={updateLabel} />,
    };
  }, [item]);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={setRfInstance}
      defaultViewport={defaultViewport}
      fitView={true}
    >
      <Background gap={12} size={1} />
    </ReactFlow>
  );
}
function FlowPreview({
  item,
  isSelected,
  socket,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: FlowPreviewProps) {
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
        <ReactFlowProvider>
          <Flow
            socket={socket}
            item={item}
            isSelected={isSelected}
            onClick={onClick}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
export default FlowPreview;
