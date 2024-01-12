import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function ReactFlowEditor({ socket }: { socket: any }) {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  useEffect(() => {
    if (socket == null) {
      return;
    }
    const handleNodeChanges = (changes: any) => {
      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
    };
    const handleEdgeChanges = (changes: any) => {
      setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
    };
    socket && socket.on("receive-node-changes", handleNodeChanges);
    socket && socket.on("receive-edge-changes", handleEdgeChanges);

    return () => {
      socket && socket.off("receive-node-changes", handleNodeChanges);
      socket && socket.off("receive-edge-changes", handleEdgeChanges);
    };
  }, [socket]);

  const onNodesChange = (changes: any) => {
    setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
    if (socket != null) {
      socket.emit("node-changes", changes);
    }
    console.log("Node changes", changes);
  };
  const onEdgesChange = (changes: any) => {
    setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
    if (socket != null) {
      socket.emit("edge-changes", changes);
    }
    console.log("Edge changes", changes);
  };
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
    </ReactFlow>
  );
}
