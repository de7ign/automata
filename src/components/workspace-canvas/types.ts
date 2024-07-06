import {Position, IdType, Node} from "vis-network";
import {string} from "zod";


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
  id: IdType;
  from: IdType;
  to: IdType;
  label: string;
}

export type ContextMenuData =
  AddNodeContextData
  | AddEdgeContextData
  | UpdateNodeContextData
  | UpdateEdgeContextData
  | null;

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

export type NodeAddUpdateMode = 'normalAdd' | 'startAdd' | 'finalAdd' | 'update';

export interface NodeDetail {
  nodeId: IdType;
  label: string;
}

export interface EdgeDetail {
  id: IdType;
  from: IdType;
  to: IdType;
  label: string;
}

export interface SelectedNetworkElements {
  position?: Position;
  node?: NodeDetail;
  edge?: EdgeDetail;
  params: NetworkEventParams;
}