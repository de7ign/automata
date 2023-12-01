import { Position, IdType, Node } from "vis-network";


interface AddNodeContextMenu {
    mode: 'addNode';
    position: Position;
}
interface UpdateNodeContextMenu {
    mode: 'updateNode';
    nodeId: IdType;
}

export type ContextMenuData = AddNodeContextMenu | UpdateNodeContextMenu | null;

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
