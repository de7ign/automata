'use client'

import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer"
import { DataSetEdges, IdType, Network, Position } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import keycharm, { Keycharm } from "keycharm";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NetworkNodes, ContextMenuData, NetworkEventParams, ContextMenuMode, AddNodeContextData, UpdateNodeContextData } from "./types";
import { NETWORK_DEFAULT_OPTION } from "./constants";
import { v4 as uuidv4 } from 'uuid';
import { WorkSpaceCanvasUtil } from "./workspace-canvas-util";
import NodeLabelDialogItem from "@/components/workspace-canvas-node-label-dialog";

export default function AutomataWorkspaceCanvas() {

  const canvasUtil = new WorkSpaceCanvasUtil();

  const networkContainer = useRef<HTMLDivElement>(null);
  const network = useRef<any>(null)
  const networkNodes = useRef<any>(null);
  const networkEdges = useRef<any>(null);
  const contextMenuData = useRef<ContextMenuData>(null);
  let keyBinding: Keycharm

  const [contextMenuMode, setContextMenuMode] = useState<ContextMenuMode>(null);
  const [hasOpenDialog, setHasOpenDialog] = useState<boolean>(false);
  const [hasStartState, setHasStartState] = useState<boolean>(false);

  function getNetwork(): Network {
    return network.current
  }

  function setNetwork(networkInstance: Network): void {
    network.current = networkInstance;
  }

  function setNetworkNodes(nodeInstance: DataSet<NetworkNodes>): void {
    networkNodes.current = nodeInstance;
  }

  function getNetworkNodes(): DataSet<NetworkNodes> {
    return networkNodes.current;
  }

  function setNetworkEdges(edgeInstance: DataSetEdges): void {
    networkEdges.current = edgeInstance;
  }

  function getNetworkEdges(): DataSetEdges {
    return networkEdges.current;
  }

  function getContextData<T>(): T {
    return contextMenuData.current as T;
  }

  // initialize your network!
  useEffect(() => {
    if (networkContainer.current) {

      setNetworkNodes(new DataSet([
        { id: '1', label: 'Node x' },
        { id: '2', label: 'Node 2' },
        { id: '3', label: 'Node 3' },
        { id: '4', label: 'Node 4' },
        { id: '5', label: 'Node 5' }
      ], {}))

      setNetworkEdges(new DataSet([
        { id: 1, from: 1, to: 3 },
        { id: 2, from: 1, to: 2 },
        { id: 3, from: 2, to: 4 },
        { id: 4, from: 2, to: 5 }
      ], {}))


      // provide the data in the vis format
      const networkNodes: DataSet<NetworkNodes> = getNetworkNodes();

      networkNodes.on('add', function (event, properties, senderId) {
        console.log('event:', event, 'properties:', properties, 'senderId:', senderId);

        // Check if start state is added then set the state variable to true
        markHasStartStateIfStartStateIsPresent();

      });

      networkNodes.on('remove', function (event, properties, senderId) {
        console.log('event:', event, 'properties:', properties, 'senderId:', senderId);

        // Check if star state is removed then set the state variable to false
        const isStartStateRemoved = properties?.oldData.some((item: NetworkNodes) => item.isStart);

        if (isStartStateRemoved) {
          setHasStartState(false);
        }

      });

      const data = {
        nodes: networkNodes,
        edges: getNetworkEdges()
      };

      setNetwork(new Network(networkContainer.current, data, NETWORK_DEFAULT_OPTION));

      // TODO: Similar is used in beforeDrawing, prolly we can extract as method
      // Check while initializing if we have the a start state, then make the hasStartState as true
      markHasStartStateIfStartStateIsPresent();

      const network: Network = getNetwork();

      network.on('oncontext', (params: NetworkEventParams) => {
        const nodeId: IdType = network.getNodeAt(params.pointer.DOM)
        if (nodeId) {
          network.selectNodes([nodeId], false);
          contextMenuData.current = {
            nodeId: nodeId,
            label: networkNodes.get(nodeId)?.label || ''
          }
          setContextMenuMode("updateNode")
        } else {
          contextMenuData.current = {
            position: params.pointer.canvas
          }
          setContextMenuMode("addNode")
        }
      })

      network.on('beforeDrawing', (ctx) => {
        console.log(ctx);
        drawArrowForStartState(ctx);
        drawOuterCircleForFinalStates(ctx);
      })

      keyBinding = keycharm({
        container: networkContainer.current,
        preventDefault: true
      })
    }

    // unbind as part of cleanup
    return () => {
      const network: Network = getNetwork();
      network.destroy();
    }
  }, [networkContainer])


  function getStartState(): IdType | undefined {
    const networkNodes: DataSet<NetworkNodes> = getNetworkNodes();

    const item: IdType[] = networkNodes.getIds({
      filter: function (item: NetworkNodes) {
        return !!item.isStart;
      }
    })

    if (item.length === 1) {
      return item[0];
    }
    return undefined;
  }

  function isStartStatePresent(): boolean {
    return !!getStartState();
  }

  function markHasStartStateIfStartStateIsPresent() {
    if (isStartStatePresent()) {
      setHasStartState(true);
    }
  }

  function drawArrowForStartState(ctx: CanvasRenderingContext2D) {
    const network: Network = getNetwork();

    const startStateItem = getStartState();

    if (startStateItem) {
      canvasUtil.drawArrowToLeftOfCircle(ctx, network.getPosition(startStateItem));
    }
  }

  function drawOuterCircleForFinalStates(ctx: CanvasRenderingContext2D) {
    const networkNodes: DataSet<NetworkNodes> = getNetworkNodes();

    const items: IdType[] = networkNodes.getIds({
      filter: function (item: NetworkNodes) {
        return !!item.isFinal;
      }
    })

    const nodeIdToPositions = getNetwork().getPositions(items);
    const positions = [];

    for (let nodeId in nodeIdToPositions) {
      positions.push(nodeIdToPositions[nodeId])
    }

    if (positions && Array.isArray(positions)) {
      canvasUtil.drawOuterCircle(ctx, positions);
    }
  }


  function onContextMenuOpenChange(open: boolean): void {
    if (!open) {
      setContextMenuMode(null);
    }
  }

  function handleDialogItemOpenChange(open: boolean): void {
    setHasOpenDialog(open);
    onContextMenuOpenChange(open);
  }

  function addState(label: string): void {
    const networkNodes = getNetworkNodes();
    const contextData: AddNodeContextData = getContextData<AddNodeContextData>();
    if (contextMenuMode === "addNode" && contextData?.position) {
      networkNodes.add({
        id: uuidv4(),
        label: label,
        x: contextData.position.x,
        y: contextData.position.y
      })
    }
  }


  function addStartState(label: string): void {
    const networkNodes = getNetworkNodes();
    const contextData: AddNodeContextData = getContextData<AddNodeContextData>();

    if (contextMenuMode === 'addNode' && contextData?.position) {
      networkNodes.add({
        id: uuidv4(),
        label: label,
        x: contextData.position.x,
        y: contextData.position.y,
        isStart: true
      })
    }
  }

  function addFinalState(label: string): void {
    const networkNodes = getNetworkNodes();
    const contextData: AddNodeContextData = getContextData<AddNodeContextData>();

    if (contextMenuMode === 'addNode' && contextData?.position) {
      networkNodes.add({
        id: uuidv4(),
        label: label,
        x: contextData.position.x,
        y: contextData.position.y,
        isFinal: true
      })
    }
  }


  function editState(label: string): void {
    const networkNodes = getNetworkNodes();
    const contextData: UpdateNodeContextData = getContextData<UpdateNodeContextData>();
    if (contextMenuMode === "updateNode" && contextData?.nodeId) {
      networkNodes.update({
        ...networkNodes.get(contextData.nodeId),
        label: label
      })
    }
  }


  function deleteNode(): void {
    const networkNodes = getNetworkNodes();
    const contextData: UpdateNodeContextData = getContextData<UpdateNodeContextData>();
    if (contextMenuMode === "updateNode" && contextData?.nodeId) {
      networkNodes.remove(contextData.nodeId);
    }
  }


  return (
    <Card className="lg:h-[800px] w-9/12">
      <CardContent className="h-full p-0">
        <ContextMenu onOpenChange={onContextMenuOpenChange}>
          <ContextMenuTrigger asChild>
            <div ref={networkContainer} className="h-full"></div>
          </ContextMenuTrigger>

          {contextMenuMode === 'addNode' && (
            <ContextMenuContent className="w-52" hidden={hasOpenDialog}>

              <NodeLabelDialogItem
                itemTitle='Add state'
                dialogTitle='Add state'
                dialogDescription='Give your new state a name'
                onOpenChange={handleDialogItemOpenChange}
                onSubmit={addState}
              />

              <NodeLabelDialogItem
                itemTitle='Add start state'
                dialogTitle='Add start state'
                disabled={hasStartState}
                dialogDescription='Give your new state a name'
                onOpenChange={handleDialogItemOpenChange}
                onSubmit={addStartState}
              />

              <NodeLabelDialogItem
                itemTitle='Add final state'
                dialogTitle='Add final state'
                dialogDescription='Give your new state a name'
                onOpenChange={handleDialogItemOpenChange}
                onSubmit={addFinalState}
              />

            </ContextMenuContent>
          )}

          {contextMenuMode === 'updateNode' && (<ContextMenuContent className="w-52">
            <NodeLabelDialogItem
              itemTitle='Edit state label'
              dialogTitle='Edit state label'
              dialogDescription='Provide a updated name'
              defaultLabel={getContextData<UpdateNodeContextData>().label}
              onOpenChange={handleDialogItemOpenChange}
              onSubmit={editState}
            />
            <ContextMenuItem onSelect={deleteNode}>Delete node</ContextMenuItem>
          </ContextMenuContent>
          )}
        </ContextMenu>

      </CardContent>
    </Card>
  )
}
