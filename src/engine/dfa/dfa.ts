import { DataSet } from "vis-data/peer/esm/vis-data";
import { v4 as randomUUID } from "uuid";

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

export interface dfaResponse {
  valid: boolean;
  accepted: boolean;
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
 * 1. add extra edges if any multi length label is found.
 *
 * @param nodes
 * @param edges
 */
function preProcess(nodes: Array<any>, edges: Array<any>) {
  const edgesLength = edges.length;

  for (let edgeIndex = 0; edgeIndex < edgesLength; edgeIndex += 1) {
    const edge = edges[edgeIndex];
    if (edge.label.length > 1) {
      const { label } = edge;
      const labelLength = label.length;
      const edgeTo = edge.to;
      edge.to = randomUUID();
      edge.label = label.charAt(0);
      let previousTo = edge.to;
      for (let labelIndex = 1; labelIndex < labelLength; labelIndex += 1) {
        // add new edges
        const newEdge = {
          id: randomUUID(),
          from: "",
          to: "",
          label: ""
        };
        newEdge.from = previousTo;
        if (labelIndex + 1 === labelLength) {
          newEdge.to = edgeTo;
        } else {
          newEdge.to = randomUUID();
          previousTo = newEdge.to;
        }
        newEdge.label = label.charAt(labelIndex);
        edges.push(newEdge);
      }
    }
  }
}

/**
 * returns true if every edge are unique i.e unique from and label combination
 *
 * @param edges
 * @return boolean
 */
function isUniqueEdges(edges: Array<any>): boolean {
  const edgesLength = edges.length;
  for (let edgeIndex = 0; edgeIndex < edgesLength; edgeIndex += 1) {
    const edge = edges[edgeIndex];
    for (
      let searchIndex = edgeIndex + 1;
      searchIndex < edgesLength;
      searchIndex += 1
    ) {
      const searchEdge = edges[searchIndex];
      if (edge.from === searchEdge.from && edge.label === searchEdge.label) {
        return false;
      }
    }
  }
  return true;
}

/**
 * checks if network is valid DFA
 *
 * @param nodes
 * @param edges
 * @return boolean
 */
function isValidDFA(nodes: Array<any>, edges: Array<any>): boolean {
  /**
   * DFA edges should be deterministic.
   * For a given state and given input alphabet there should be only one edge
   */
  return isUniqueEdges(edges);
}

/**
 * Generate response object
 *
 * @param valid
 * @param accepted
 */
function generateResponse(valid: boolean, accepted: boolean): dfaResponse {
  const response = {
    valid: false,
    accepted: false
  };

  response.valid = valid;
  response.accepted = accepted;

  return response;
}

/**
 * Method accepts Automaton DataSet and input string.
 *
 * Returns an object with following keys
 *
 * valid : key denotes if the given network is a valid DFA
 *
 * accepted : key denotes if for the given input the network(DFA) accepts it
 *
 * @param inputString - string to check if it's a valid string
 * @param data - The automaton details. It should be in the form of <pre>{ "nodes": nodes; "edges": edges }</pre>
 * @return dfaResponse - <pre>{valid: boolean, accepted: boolean}</pre>
 * @throws TypeError
 */
function computeDFA(inputString: string, data: automataData): dfaResponse {
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

    const isValid = isValidDFA(nodes, edges);
    if (!isValid) return generateResponse(isValid, false);

    const inputStringLength = inputString.length;
    let currentNode = "1";

    for (let inputIndex = 0; inputIndex < inputStringLength; inputIndex += 1) {
      const inputChar = inputString[inputIndex];
      /**
       *  let suppose for the given input alphabet we don't have a valid edge with the given node.
       *  we shouldn't be traversing further
       */
      let toContinueSearch = false;
      for (let edgeIndex = 0; edgeIndex < edgesLength; edgeIndex += 1) {
        const edge = edges[edgeIndex];
        if (edge.from === currentNode && edge.label === inputChar) {
          currentNode = edge.to;
          toContinueSearch = true;
          break;
        }
      }
      if (!toContinueSearch) {
        return generateResponse(isValid, false);
      }
    }

    /**
     * traverse the nodes to check if the node we end up on is final node or not
     */
    for (let index = 0; index < nodesLength; index += 1) {
      const node = nodes[index];
      if (node.id === currentNode && node.final) {
        return generateResponse(isValid, true);
      }
    }
    return generateResponse(isValid, false);
  }
  throw new TypeError("function only accepts Dataset");
}

export default computeDFA;
