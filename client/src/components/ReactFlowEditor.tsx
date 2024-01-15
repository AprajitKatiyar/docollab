import React, { useCallback, useEffect, useState, useMemo } from "react";
import { IoMdAdd } from "react-icons/io";
import TextNode from "./TextNode";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
const initialNodes = [
  { id: "1", position: { x: 300, y: 200 }, data: { label: "1" } },
  { id: "2", position: { x: 300, y: 400 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
const getNodeId = () => `randomnode_${+new Date()}`;

function Flow({ socket }: { socket: any }) {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const { setViewport } = useReactFlow();

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
    const handeNodeLabelChanges = (id: string, newLabel: string) => {
      udpateNodes(id, newLabel);
    };

    socket && socket.on("receive-node-changes", handleNodeChanges);
    socket && socket.on("receive-edge-changes", handleEdgeChanges);
    socket && socket.on("receive-connection-changes", handleConnectionChanges);
    socket && socket.on("receive-newnode-changes", handleNewNodeChanges);
    socket && socket.on("receive-nodelabel-changes", handeNodeLabelChanges);

    return () => {
      socket && socket.off("receive-node-changes", handleNodeChanges);
      socket && socket.off("receive-edge-changes", handleEdgeChanges);
      socket &&
        socket.off("receive-connection-changes", handleConnectionChanges);
      socket && socket.off("receive-newnode-changes", handleNewNodeChanges);
      socket && socket.off("receive-nodelabel-changes", handeNodeLabelChanges);
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
      type: "custom",
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    socket.emit("newnode-changes", newNode);
  }, [setNodes]);
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
    [setNodes]
  );
  const updateLabel = ({ id, newLabel }: any) => {
    //console.log(`Node ${id} label is updated with ${newLabel}`);
    udpateNodes(id, newLabel);
    if (socket && socket.connected) {
      socket.emit("nodelabel-changes", id, newLabel);
    }
  };
  const nodeTypes = useMemo(() => {
    return {
      custom: (props: any) => <TextNode {...props} updateLabel={updateLabel} />,
    };
  }, []);
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem("save", JSON.stringify(flow));
    }
  }, [rfInstance]);
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const savedFlow = localStorage.getItem("save");

      if (savedFlow !== null) {
        const flow = JSON.parse(savedFlow);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onInit={setRfInstance}
    >
      <Panel position="top-center">
        <button
          className="col-span-7 border-2  rounded-md bg-[#8F48EB]  text-white font-semibold  hover:bg-[#7f4ec0] m-2"
          onClick={onAdd}
        >
          <IoMdAdd size="40" />
        </button>
        <button onClick={onSave}>Save</button>
        <button onClick={onRestore}>Restore</button>
      </Panel>
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
    </ReactFlow>
  );
}
function ReactFlowEditor({ socket }: { socket: any }) {
  return (
    <ReactFlowProvider>
      <Flow socket={socket} />
    </ReactFlowProvider>
  );
}
export default ReactFlowEditor;
