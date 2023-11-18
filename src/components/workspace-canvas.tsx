'use client'

import { useEffect, useRef } from "react";
import { DataSet, } from "vis-data/peer"
import { Network } from "vis-network/peer"

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

    const options = {};

    // initialize your network!

    return (
        <div ref={container}>
        </div>
    )
}