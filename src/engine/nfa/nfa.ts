import { DataSet } from "vis-data/peer/esm/vis-data";
import { v4 as randomUUID } from "uuid";

import { LAMBDA } from "../../constants";

/*
NODE Data Model
    {
      id: "1",        - string
      label: "start", - string
      final: true,    - boolean (optional field, absence of field will be treated as false)
      x: -184,        - number
      y: -41          - number
    }

EDGE Data Model
    {
      id: "1",                                      - string
      from: "1",                                    - string
      to: "2",                                      - string
      label: "1",                                   - string
      smooth: { type: "curvedCW", roundness: 0.2 }  - object (curve functions) (optional field, absence of field will result in straight line)
    },
 */

export interface automataData {
  nodes: DataSet<any, any>;
  edges: DataSet<any, any>;
}

export interface nfaResponse {
  valid: boolean;
  accepted?: boolean;
  acceptedNodeLabels?: Array<string>;
}

/**
 * Method check if the given data is of type automataData or not
 *
 * @param data
 * @return boolean
 */
function isAutomataData(data: any): boolean {
  if ("nodes" in data && "edges" in data) {
    if (data.nodes instanceof DataSet && data.edges instanceof DataSet) {
      return true;
    }
  }
  return false;
}

/**
 * Do pre processing of network as required
 * 1. add extra edges if any multi length labels are found.
 * 2. add extra edges if there are multi label edges
 *
 * case 1:
 *  input:
 *  1. q1 --a,b--> q2
 *  output:
 *  1. q1 --a--> q2
 *  2. q1 --b--> q2
 *
 * case 2:
 *  input:
 *  1. q1 --ab--> q2
 *  output:
 *  1. q1 --a--> qx (new node)
 *  2. qx --b--> q2
 *
 * @param nodes
 * @param edges
 */
function preProcess(nodes: Array<any>, edges: Array<any>) {
  const edgesLength = edges.length;
  for (let edgeIndex = 0; edgeIndex < edgesLength; ) {
    const edge = edges[edgeIndex];
    const edgeLabelArray = edge.label.split(",");
    const edgeTo = edge.to;

    /**
     * Process edges only with
     * 1. more than one labels are there separated by comma
     * 2. if only one label but more than one characters.
     *
     * e.g
     * ['a']      => don't process
     * ['a', 'b'] => process
     * ['ab']     => process
     */
    if (edgeLabelArray.length > 1 || edgeLabelArray[0].length > 1) {
      /**
       * Iterate over edges array consisting of multiple labels or label with more than 1 character.
       */
      for (
        let edgeLabelArrayIndex = 0;
        edgeLabelArrayIndex < edgeLabelArray.length;
        edgeLabelArrayIndex += 1
      ) {
        const edgeLabel = edgeLabelArray[edgeLabelArrayIndex].trim();
        let previousTo = edge.from;

        /**
         * Iterate over each character of edge and create a new edge.
         */
        for (
          let edgeLabelIndex = 0;
          edgeLabelIndex < edgeLabel.length;
          edgeLabelIndex += 1
        ) {
          // add new edges
          const newEdge = {
            id: randomUUID(),
            from: "",
            to: "",
            label: ""
          };
          newEdge.from = previousTo;
          if (edgeLabelIndex + 1 === edgeLabel.length) {
            newEdge.to = edgeTo;
          } else {
            newEdge.to = randomUUID();
            previousTo = newEdge.to;
          }
          newEdge.label = edgeLabel.charAt(edgeLabelIndex);
          edges.push(newEdge);
        }
      }
      edges.splice(edgeIndex, 1);
    } else {
      edgeIndex += 1;
    }
  }
}

function generateResponse(valid: boolean): nfaResponse;
function generateResponse(valid: boolean, accepted: boolean): nfaResponse;
function generateResponse(
  valid: boolean,
  accepted: boolean,
  acceptedNodeLabel: Array<string>
): nfaResponse;

/**
 * Generate response object
 *
 * @param valid
 * @param accepted
 * @param acceptedNodeLabels
 */
function generateResponse(
  valid: boolean,
  accepted?: boolean,
  acceptedNodeLabels?: Array<string>
): nfaResponse {
  if (accepted === undefined && acceptedNodeLabels === undefined) {
    return {
      valid
    };
  }

  if (acceptedNodeLabels === undefined) {
    return {
      valid,
      accepted
    };
  }

  return {
    valid,
    accepted,
    acceptedNodeLabels
  };
}

/**
 * Method accepts Automaton DataSet and input string.
 *
 * Returns an object with following keys
 *
 * valid : key denotes if the given network is a valid NFA
 *
 * accepted : key denotes if for the given input string the network(NFA) accepts it
 *
 * acceptedNodeLabels : array of labels of final nodes which accepted the input string
 *
 * @param inputString - string to check if it's a valid string
 * @param data - The automaton details. It should be in the form of <pre>{ "nodes": nodes; "edges": edges }</pre>
 * @return dfaResponse - <pre>{valid: boolean, accepted: boolean, acceptedNodeLabels: Array<string>}</pre>
 * @throws TypeError
 */
function computeNFA(inputString: string, data: automataData): nfaResponse {
  if (isAutomataData(data)) {
    /**
     * TODO:
     * 1. DataSet schema validation
     */

    const nodes = data.nodes.get();
    const edges = data.edges.get();

    preProcess(nodes, edges);

    const nodesLength = nodes.length;
    const edgesLength = edges.length;

    const isValid = true;
    if (!isValid) return generateResponse(isValid);

    const inputStringLength = inputString.length;
    let currentNodes = ["1"];
    let proxyNodes = [];

    for (let inputIndex = 0; inputIndex < inputStringLength; inputIndex += 1) {
      const inputChar = inputString[inputIndex];
      for (let edgeIndex = 0; edgeIndex < edgesLength; edgeIndex += 1) {
        const edge = edges[edgeIndex];

        if (
          currentNodes.indexOf(edge.from) !== -1 &&
          (edge.label === LAMBDA || edge.label === inputChar)
        ) {
          proxyNodes.push(edge.to);
        }
      }
      if (!proxyNodes.length) {
        return generateResponse(isValid, false);
      }
      currentNodes = proxyNodes;
      proxyNodes = [];
    }

    /**
     * traverse the nodes to check if the nodes we end up on after processing the input are final nodes or not
     */
    const acceptedNodes: Array<string> = [];
    for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += 1) {
      const node = nodes[nodeIndex];
      if (currentNodes.indexOf(node.id) !== -1 && node.final) {
        acceptedNodes.push(node.label);
      }
    }

    if (acceptedNodes.length) {
      return generateResponse(isValid, true, acceptedNodes);
    }

    return generateResponse(isValid, false);
  }
  throw new TypeError("function only accepts Dataset");
}

export default computeNFA;
