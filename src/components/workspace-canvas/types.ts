import { Position, IdType, Node } from "vis-network";
import { string } from "zod";


export type ContextMenuMode = 'addNodeAndEdge' | 'updateNode' | 'updateEdge' | null;

export interface AddNodeContextData {
  position: Position;
}

export interface AddEdgeContextData {
  id: string;
  from: string;
  to: string;
}

export interface UpdateNodeContextData {
  nodeId: IdType;
  label: string;
}

export interface UpdateEdgeContextData {
  edgeId: IdType;
}

export type ContextMenuData = AddNodeContextData | AddEdgeContextData | UpdateNodeContextData | UpdateEdgeContextData | null;

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
