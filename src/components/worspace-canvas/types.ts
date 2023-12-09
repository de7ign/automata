import { Position, IdType, Node } from "vis-network";


export type ContextMenuMode = 'addNode' | 'updateNode' | null;

export interface AddNodeContextData {
  position: Position;
}
export interface UpdateNodeContextData {
  nodeId: IdType;
  label: string;
}

export type ContextMenuData = AddNodeContextData | UpdateNodeContextData | null;

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
