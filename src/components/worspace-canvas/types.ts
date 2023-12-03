import { Position, IdType, Node } from "vis-network";


export type ContextMenuMode = 'addNode' | 'updateNode' | null;

interface AddNodeContextMenu {
  position: Position;
}
interface UpdateNodeContextMenu {
  nodeId: IdType;
}

export type ContextMenuData = Partial<AddNodeContextMenu> & Partial<UpdateNodeContextMenu> | null;

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
