import { Edge, IdType, Network } from "vis-network";
import networkService from "@/services/network-service";
import { NetworkEventParams, SelectedNetworkElements, NetworkNodes, NetworkEdges } from "./types";
import { FullItem } from "vis-data/declarations/data-interface";

export function getSelectedNetworkElements(params: NetworkEventParams): SelectedNetworkElements | undefined {

  const network: Network = networkService.getNetwork();
  const networkNodes: NetworkNodes | undefined = networkService.getNodes();
  const networkEdges: NetworkEdges | undefined = networkService.getEdges();

  const nodeId: IdType = network.getNodeAt(params.pointer.DOM);
  const edgeId: IdType = network.getEdgeAt(params.pointer.DOM);

  // if both are undefined then, pointer is in empty canvas
  // launch context menu for adding node and edges
  if (!nodeId && !edgeId) {
    return {
      position: params.pointer.canvas,
      params
    }
  } else if (nodeId) {
    // node found, launch context menu for updating node
    network.selectNodes([nodeId], false);
    return {
      node: {
        id: nodeId,
        label: networkNodes?.get(nodeId)?.label || ''
      },
      params
    }
  } else if (edgeId) {
    // edge found, launch context menu for updating edge
    network.selectEdges([edgeId])
    const edgeDetails: FullItem<Edge, "id"> | null | undefined = networkEdges?.get(edgeId);
    return {
      edge: {
        id: edgeId,
        label: edgeDetails?.label || '',
        from: edgeDetails?.from || '',
        to: edgeDetails?.to || ''
      },
      params
    }
  }

  return undefined;
}