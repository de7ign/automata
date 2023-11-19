'use client'

import { useEffect, useRef } from "react";
import { DataSet } from "vis-data/peer"
import { Network, Options } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"


export default function AutomataWorkspaceCanvas() {

  const container = useRef<HTMLDivElement>(null);
  let network: Network

  useEffect(() => {
    if (container.current) {
      network = new Network(container.current, data, options);
    }
  }, [container])

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
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
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

  return (
    <Card className="lg:h-[800px]">
      <CardContent className="h-full p-0">
        <div ref={container} className="h-full">
        </div>
      </CardContent>
    </Card>
  )
}