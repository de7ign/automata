import { DataSet } from "vis-data/peer/esm/vis-data";

export interface automataData {
  nodes: DataSet<any, any>;
  edges: DataSet<any, any>;
}

/**
 * Method check if the given data is of type automataData or not
 *
 * @param data
 * @return boolean
 */
function isAutomataData(data: any) {
  if ("nodes" in data && "edges" in data) {
    if (data.nodes instanceof DataSet && data.edges instanceof DataSet) {
      return true;
    }
  }
  return false;
}

/**
 * Method accepts Automaton DataSet and input string.
 * Returns true or false based on if the automaton accepts the input string
 *
 * @param inputString - string to check if it's a valid string
 * @param data - The automaton details. It should be in the form of <pre>{ "nodes": nodes; "edges": edges }</pre>
 * @return boolean - true if automaton accepts the input string false otherwise
 * @throws TypeError
 */
function computeDFA(inputString: string, data: automataData): boolean {
  if (isAutomataData(data)) {
    const nodes = data.nodes.get();
    const nodesLength = nodes.length;
    const edges = data.edges.get();
    const edgesLength = edges.length;
    const inputStringLength = inputString.length;
    let currentNode = "1";

    /**
     * TODO:
     * 1. DataSet schema validation
     */

    for (let inputIndex = 0; inputIndex < inputStringLength; inputIndex += 1) {
      const inputChar = inputString[inputIndex];
      /**
       *  let suppose for this inputChar we don't have a valid edge with the given currentNode.
       *  It's trivial we shouldn't be traversing further
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
        return false;
      }
    }

    /**
     * traverse the nodes to check if the node we end up on is final node or not
     */
    for (let index = 0; index < nodesLength; index += 1) {
      const node = nodes[index];
      if (node.id === currentNode && node.final) {
        return true;
      }
    }
    return false;
  }
  throw new TypeError("function only accepts Dataset");
}

export default computeDFA;
