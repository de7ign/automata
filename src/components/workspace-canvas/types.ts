import { Position, IdType, Node } from "vis-network";


export type ContextMenuMode = 'addNodeAndEdge' | 'updateNode' | 'updateEdge' | null;

export interface AddNodeAndEdgeContextData {
  position: Position;
}

export interface UpdateNodeContextData {
  nodeId: IdType;
  label: string;
}

export interface UpdateEdgeContextData {
  edgeId: IdType;
}

export type ContextMenuData = AddNodeAndEdgeContextData | UpdateNodeContextData | UpdateEdgeContextData | null;

export interface NetworkEventParams {
  edges: string[];
  event: PointerEvent;
  nodes: string[];
  pointer: {
    DOM: Position;
    canvas: Position;
  };
}

export interface NetworkNodes extends Node {
  isFinal?: boolean;
  isStart?: boolean;
}
