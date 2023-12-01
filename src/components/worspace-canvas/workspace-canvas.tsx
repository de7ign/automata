'use client'

import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer"
import { DataSetEdges, IdType, Network, Options } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import keycharm, { Keycharm } from "keycharm";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NetworkNodes, ContextMenuData, NetworkEventParams } from "./types";
import { NETWORK_DEFAULT_OPTION } from "./constants";

export default function AutomataWorkspaceCanvas() {

  const networkContainer = useRef<HTMLDivElement>(null);
  const network = useRef<any>(null)
  const networkNodes = useRef<any>(null);
  const networkEdges = useRef<any>(null)

  function getNetwork(): Network {
    return network.current
  }

  function setNetwork(networkInstance: Network): void {
    network.current = networkInstance;
  }

  function setNetworkNodes(nodeInstance: DataSet<NetworkNodes>): void {
    networkNodes.current = nodeInstance;
  }

  function getNetworkNodes(): DataSet<NetworkNodes> {
    return networkNodes.current;
  }

  function setNetworkEdges(edgeInstance: DataSetEdges): void {
    networkEdges.current = edgeInstance;
  }

  function getNetworkEdges(): DataSetEdges {
    return networkEdges.current;
  }

  let keyBinding: Keycharm

  const [contextMenuData, setcontextMenuData] = useState<ContextMenuData>(null);

  useEffect(() => {
    if (networkContainer.current) {

      setNetworkNodes(new DataSet([
        { id: '1', label: 'Node x' },
        { id: '2', label: 'Node 2' },
        { id: '3', label: 'Node 3' },
        { id: '4', label: 'Node 4' },
        { id: '5', label: 'Node 5' }
      ], {}))

      setNetworkEdges(new DataSet([
        { id: 1, from: 1, to: 3 },
        { id: 2, from: 1, to: 2 },
        { id: 3, from: 2, to: 4 },
        { id: 4, from: 2, to: 5 }
      ], {}))


      // provide the data in the vis format
      const data = {
        nodes: getNetworkNodes(),
        edges: getNetworkEdges()
      };

      setNetwork(new Network(networkContainer.current, data, NETWORK_DEFAULT_OPTION));

      const network: Network = getNetwork();

      network.on("doubleClick", (params: NetworkEventParams) => {
        addNode(params);
      });

      network.on('oncontext', (params: NetworkEventParams) => {
        const nodeId: IdType = network.getNodeAt(params.pointer.DOM)
        if (nodeId) {
          network.selectNodes([nodeId], false);
          setcontextMenuData({
            mode: "updateNode",
            nodeId: nodeId
          })
        } else {
          setcontextMenuData({
            mode: "addNode",
            position: params.pointer.canvas
          })
        }
      })

      keyBinding = keycharm({
        container: networkContainer.current,
        preventDefault: true
      })
    }

    // unbind as part of cleanup
    return () => {
      const network: Network = getNetwork();
      network.destroy();
    }
  }, [networkContainer])


  function addNode(params: any): void {
    alert('double clicked')
  }

  // initialize your network!

  function onContextMenuOpenChange(open: boolean): void {

    if (!open) {
      // setcontextMenuData(null);
    }
  }

  function addState(): void {
    const networkNodes = getNetworkNodes();
    if (contextMenuData?.mode === "addNode") {
      networkNodes.add({
        id: 77,
        label: "new",
        x: contextMenuData.position.x,
        y: contextMenuData.position.y
      })
    }
  }


  return (
    <Card className="lg:h-[800px] w-9/12">
      <CardContent className="h-full p-0">
        <ContextMenu onOpenChange={onContextMenuOpenChange}>
          <ContextMenuTrigger>
            <div ref={networkContainer} className="h-full"></div>
          </ContextMenuTrigger>
          {contextMenuData?.mode === 'addNode' && (<ContextMenuContent className="w-52">
            <ContextMenuItem onSelect={() => addState()}>Add state</ContextMenuItem>
            <ContextMenuItem>Add start state</ContextMenuItem>
            <ContextMenuItem>Add final state</ContextMenuItem>
          </ContextMenuContent>
          )}
          {contextMenuData?.mode === 'updateNode' && (<ContextMenuContent className="w-52">
            <ContextMenuItem>Edit state label</ContextMenuItem>
            <ContextMenuItem>Delete node</ContextMenuItem>
          </ContextMenuContent>
          )}
        </ContextMenu>

      </CardContent>
    </Card>
  )
}
