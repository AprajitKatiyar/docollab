import React, { useCallback, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
const initialNodes = [
  { id: "1", position: { x: 300, y: 200 }, data: { label: "1" } },
  { id: "2", position: { x: 300, y: 400 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
const getNodeId = () => `randomnode_${+new Date()}`;

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
    const handleConnectionChanges = (changes: any) => {
      setEdges((oldEdges) => addEdge(changes, oldEdges));
    };
    const handleNewNodeChanges = (newNode: any) => {
      setNodes((nodes) => nodes.concat(newNode));
    };

    socket && socket.on("receive-node-changes", handleNodeChanges);
    socket && socket.on("receive-edge-changes", handleEdgeChanges);
    socket && socket.on("receive-connection-changes", handleConnectionChanges);
    socket && socket.on("receive-newnode-changes", handleNewNodeChanges);

    return () => {
      socket && socket.off("receive-node-changes", handleNodeChanges);
      socket && socket.off("receive-edge-changes", handleEdgeChanges);
      socket &&
        socket.off("receive-connection-changes", handleConnectionChanges);
      socket && socket.off("receive-newnode-changes", handleNewNodeChanges);
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
    (changes: any) => {
      setEdges((oldEdges) => addEdge(changes, oldEdges));
      if (socket != null) {
        socket.emit("connection-changes", changes);
      }
    },
    [setEdges]
  );
  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: "Added node" },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    socket.emit("newnode-changes", newNode);
  }, [setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Panel position="top-center">
        <button
          className="col-span-7 border-2  rounded-md bg-[#8F48EB]  text-white font-semibold  hover:bg-[#7f4ec0] m-2"
          onClick={onAdd}
        >
          <IoMdAdd size="40" />
        </button>
      </Panel>
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
    </ReactFlow>
  );
}
