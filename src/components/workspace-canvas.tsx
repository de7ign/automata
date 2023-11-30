'use client'

import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer"
import { IdType, Network, Options, Position } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import keycharm, { Keycharm } from "keycharm";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

type ContextMenu = 'addNode' | 'updateNode' | null;

interface NetworkEventParams {
  edges: string[];
  event: PointerEvent;
  nodes: string[];
  pointer: {
    DOM: Position;
    canvas: Position;
  }
}

export default function AutomataWorkspaceCanvas() {

  const networkContainer = useRef<HTMLDivElement>(null);
  let network: Network
  let keyBinding: Keycharm

  const [contextMenuMode, setContextMenuMode] = useState<ContextMenu>(null);

  useEffect(() => {
    if (networkContainer.current) {
      network = new Network(networkContainer.current, data, options);

      network.on("doubleClick", (params: NetworkEventParams) => {
        addNode(params);
      });

      network.on('oncontext', (params: NetworkEventParams) => {
        const nodeId: IdType = network.getNodeAt(params.pointer.DOM)
        if (nodeId) {
          network.selectNodes([nodeId], false);
          setContextMenuMode("updateNode")
        } else {
          setContextMenuMode("addNode")
        }

      })

      keyBinding = keycharm({
        container: networkContainer.current,
        preventDefault: true
      })
    }

    // unbind as part of cleanup
    return () => {

    }
  }, [networkContainer])


  function addNode(params: any): void {
    alert('double clicked')
  }

  const nodes = new DataSet([
    { id: 1, label: 'Node x' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
  ]);

  // create an array with edges
  const edges = new DataSet([
    { id: 1, from: 1, to: 3 },
    { id: 2, from: 1, to: 2 },
    { id: 3, from: 2, to: 4 },
    { id: 4, from: 2, to: 5 }
  ]);

  // provide the data in the vis format
  const data = {
    nodes: nodes,
    edges: edges
  };

  const options: Options = {
    nodes: {
      shape: "circle",
      //   heightConstraint: {
      //     minimum: 50
      //   },
      widthConstraint: {
        minimum: 50,
        maximum: 50
      }
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1, type: "arrow" }
      },
      // by default all edges property should be this
      smooth: { enabled: true, type: "curvedCW", roundness: 0.5 }
    },
    physics: {
      enabled: false // should I enable it or add a functionality user can enable/disable physics ?
    },
    manipulation: {
      enabled: false
    },
    interaction: {
      selectConnectedEdges: false
    }
  };

  // initialize your network!

  function onContextMenuOpenChange(open: boolean): void {

    if(!open) {
      setContextMenuMode(null);
    }
  }


  return (
    <Card className="lg:h-[800px] w-9/12">
      <CardContent className="h-full p-0">
        <ContextMenu onOpenChange={onContextMenuOpenChange}>
          <ContextMenuTrigger>
            <div ref={networkContainer} className="h-full"></div>
          </ContextMenuTrigger>
          {contextMenuMode === 'addNode' && (<ContextMenuContent>
            <ContextMenuItem>Add state</ContextMenuItem>
            <ContextMenuItem>Add start state</ContextMenuItem>
            <ContextMenuItem>Add final state</ContextMenuItem>
          </ContextMenuContent>
          )}
          {contextMenuMode === 'updateNode' && (<ContextMenuContent>
            <ContextMenuItem>Edit state label</ContextMenuItem>
            <ContextMenuItem>Delete node</ContextMenuItem>
          </ContextMenuContent>
          )}
        </ContextMenu>

      </CardContent>
    </Card>
  )
}
