'use client'

import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer"
import { DataSetEdges, Edge, IdType, Network, Options, Position } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import keycharm, { Keycharm } from "keycharm";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NetworkNodes, ContextMenuData, NetworkEventParams, ContextMenuMode, AddNodeContextData, UpdateNodeContextData, UpdateEdgeContextData, AddEdgeContextData } from "./types";
import { NETWORK_DEFAULT_OPTION } from "./constants";
import { v4 as uuidv4 } from 'uuid';
import { WorkSpaceCanvasUtil } from "./workspace-canvas-util";
import NodeLabelDialogItem from "@/components/workspace-canvas-node-label-dialog";
import EdgeLabelDialogItem from "../workspace-canvas-edge-label-dialog/workspace-canvas-edge-label-dialog";
import { FullItem } from "vis-data/declarations/data-interface";
import { Button } from "../ui/button";

export default function AutomataWorkspaceCanvas() {

  const canvasUtil = new WorkSpaceCanvasUtil();

  const networkContainer = useRef<HTMLDivElement>(null);
  const network = useRef<any>(null);
  const networkNodes = useRef<any>(null);
  const networkEdges = useRef<any>(null);
  const contextMenuData = useRef<ContextMenuData>(null);
  let keyBinding: Keycharm;

  const [contextMenuMode, setContextMenuMode] = useState<ContextMenuMode>(null);
  const [hasOpenDialog, setHasOpenDialog] = useState<boolean>(false);
  const [hasOpenEdgeDialog, setHasOpenEdgeDialog] = useState<boolean>(false);
  const [hasOpenEditEdgeDialog, setHashEditEdgeDialog] = useState<boolean>(false);
  const [hasStartState, setHasStartState] = useState<boolean>(false);
  const [isEdgeCreationMode, setIsEdgeCreationMode] = useState<boolean>(false);

  function getNetwork(): Network {
    return network.current;
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
        { id: 1, from: 1, to: 3, label: 'asd' },
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

      setNetwork(new Network(networkContainer.current, data, customizeNetworkOption(NETWORK_DEFAULT_OPTION)));

      // TODO: Similar is used in beforeDrawing, prolly we can extract as method
      // Check while initializing if we have the a start state, then make the hasStartState as true
      markHasStartStateIfStartStateIsPresent();

      const network: Network = getNetwork();

      network.on('oncontext', (params: NetworkEventParams) => {
        const nodeId: IdType = network.getNodeAt(params.pointer.DOM);
        const edgeId: IdType = network.getEdgeAt(params.pointer.DOM);
        // console.log('edges ', network.getEdgeAt(params.pointer.DOM));

        // if both are undefined then, pointer is in empty canvas
        // launch context menu for adding node and edges
        if (!nodeId && !edgeId) {
          contextMenuData.current = {
            position: params.pointer.canvas
          }
          setContextMenuMode("addNodeAndEdge")
        } else if (nodeId) {
          // node found, launch context menu for updating node
          network.selectNodes([nodeId], false);
          contextMenuData.current = {
            nodeId: nodeId,
            label: networkNodes.get(nodeId)?.label || ''
          }
          setContextMenuMode("updateNode")
        } else if (edgeId) {
          // edge found, launch context menu for updating edge
          network.selectEdges([edgeId])
          const networkEdges = getNetworkEdges();
          const edgeDetails: FullItem<Edge, "id"> | null = networkEdges.get(edgeId);
          contextMenuData.current = {
            id: edgeId,
            label: edgeDetails?.label || '',
            from: edgeDetails?.from || '',
            to: edgeDetails?.to || ''
          }
          setContextMenuMode("updateEdge")
        }
      })

      network.on('doubleClick', (params: NetworkEventParams) => {
        const edgeId: IdType = network.getEdgeAt(params.pointer.DOM);

        if (edgeId) {
          network.selectEdges([edgeId])
          const networkEdges = getNetworkEdges();
          const edgeDetails: FullItem<Edge, "id"> | null = networkEdges.get(edgeId);
          contextMenuData.current = {
            id: edgeId,
            label: edgeDetails?.label || '',
            from: edgeDetails?.from || '',
            to: edgeDetails?.to || ''
          }
          launchUpdateEdgeModal();
        }
      })

      network.on('beforeDrawing', (ctx) => {
        console.log(ctx);
        drawArrowForStartState(ctx);
        drawOuterCircleForFinalStates(ctx);
      })

      keyBinding = keycharm({
        // container: networkContainer.current,
        preventDefault: true
      })


      // Delete bindings
      keyBinding.bind('d', () => {
        bindCaseInsensitiveShortcutForD();
      })

      keyBinding.bind('e', () => {
        enableDrawEdgeMode();
      })
    }

    // unbind as part of cleanup
    return () => {

      // destroy keybindings
      keyBinding.destroy();

      // destroy networks
      const network: Network = getNetwork();
      network.destroy();
    }
  }, [networkContainer])


  function customizeNetworkOption(defaultOption: Options): Options {
    const options: Options = structuredClone(defaultOption)
    options.manipulation = {
      ...options.manipulation,
      addEdge: function (edgeData: any, callback: (arg0: any) => void) {

        console.log('inside the add edge and the data ', edgeData);

        if (edgeData?.from && edgeData.to) {
          callback(edgeData)
          console.log('after callback edgedata ', edgeData);

          contextMenuData.current = {
            id: edgeData.id,
            from: edgeData.from,
            to: edgeData.to
          }
          setHasOpenEdgeDialog(true)
        } else {
          console.error("Unable to get edge data")
        }
      }
    }

    return options;
  }


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
    if (contextMenuMode === "addNodeAndEdge" && contextData?.position) {
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

    if (contextMenuMode === 'addNodeAndEdge' && contextData?.position) {
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

    if (contextMenuMode === 'addNodeAndEdge' && contextData?.position) {
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
    if (contextData?.nodeId) {
      networkNodes.remove(contextData.nodeId);
    }
  }

  function handleOpenEdgeDialogChange(open: boolean) {
    setHasOpenEdgeDialog(open);
    onContextMenuOpenChange(open);
    setIsEdgeCreationMode(false);
  }

  function enableDrawEdgeMode(): void {
    const network = getNetwork();

    network.addEdgeMode();
    setIsEdgeCreationMode(true);

    // setHasOpenEdgeDialog(true)
  }

  function updateEdgeLabel(label: string): void {
    const networkEdges = getNetworkEdges();

    const contextData: AddEdgeContextData | UpdateEdgeContextData = getContextData<AddEdgeContextData | UpdateEdgeContextData>();
    console.log('context data in update edge label ', contextData)
    if (contextData?.id) {
      networkEdges.update({
        ...networkEdges.get(contextData.id),
        label: label
      })
    }

  }

  function deleteEdge(): void {
    const networkEdges = getNetworkEdges();
    const contextData: UpdateEdgeContextData = getContextData<UpdateEdgeContextData>();
    if (contextData?.id) {
      networkEdges.remove(contextData.id);
    }
  }

  function launchUpdateEdgeModal(): void {
    setHashEditEdgeDialog(true);
  }

  function handleOpenUpdateEdgeDialogChange(open: boolean) {
    setHashEditEdgeDialog(open);
    onContextMenuOpenChange(open);
  }

  function bindCaseInsensitiveShortcutForD() {
    checkSelectedNodeAndDelete();
    checkSelectedEdgeAndDelete();
  }

  function checkSelectedNodeAndDelete() {
    const selectedNodes: IdType[] = getNetwork().getSelectedNodes();
    if (selectedNodes.length) {
      const nodeId = selectedNodes[0];
      const networkNodes: DataSet<NetworkNodes> = getNetworkNodes();
      contextMenuData.current = {
        nodeId: nodeId,
        label: networkNodes.get(nodeId)?.label || ''
      }
      deleteNode();
    }
  }

  function checkSelectedEdgeAndDelete() {
    const selectedEdges: IdType[] = getNetwork().getSelectedEdges();
    if (selectedEdges.length) {
      const edgeId = selectedEdges[0];
      const networkEdges = getNetworkEdges();
      const edgeDetails: FullItem<Edge, "id"> | null = networkEdges.get(edgeId);
      contextMenuData.current = {
        id: edgeId,
        label: edgeDetails?.label || '',
        from: edgeDetails?.from || '',
        to: edgeDetails?.to || ''
      }
      deleteEdge();
    }
  }


  return (
    <>
      <Card className="lg:h-[800px] w-9/12">
        <CardContent className="h-full p-0">
          <ContextMenu onOpenChange={onContextMenuOpenChange}>

            {isEdgeCreationMode && (
              <div className="bg-sky-500 rounded-t-sm p-1 flex justify-between items-baseline text-sm">
                <div>
                  You're now in edge creation mode, click-drag from one state to another!
                </div>
                <Button variant="outline" className="bg-transparent" onClick={() => {
                  const network: Network = getNetwork();
                  network.disableEditMode();
                  setIsEdgeCreationMode(false);
                }}>Cancel</Button>
              </div>
            )}

            <ContextMenuTrigger asChild>
              <div ref={networkContainer} className="h-full"></div>
            </ContextMenuTrigger>

            {contextMenuMode === 'addNodeAndEdge' && (
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

                <ContextMenuItem onSelect={enableDrawEdgeMode}>
                  Draw edge
                  <ContextMenuShortcut>E</ContextMenuShortcut>
                </ContextMenuItem>

              </ContextMenuContent>
            )}

            {contextMenuMode === 'updateNode' && (
              <ContextMenuContent className="w-52">

                <NodeLabelDialogItem
                  itemTitle='Edit state label'
                  dialogTitle='Edit state label'
                  dialogDescription='Provide a updated name'
                  defaultLabel={getContextData<UpdateNodeContextData>().label}
                  onOpenChange={handleDialogItemOpenChange}
                  onSubmit={editState}
                />


                <ContextMenuItem onSelect={deleteNode}>
                  Delete node
                  <ContextMenuShortcut>select + D</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            )}

            {contextMenuMode === 'updateEdge' && (
              <ContextMenuContent className="w-52">

                <ContextMenuItem onSelect={(event) => {
                  event.preventDefault();
                  launchUpdateEdgeModal();
                }}>Update edge</ContextMenuItem>

                <ContextMenuItem onSelect={deleteEdge}>
                  Delete edge
                  <ContextMenuShortcut>select + D</ContextMenuShortcut>
                </ContextMenuItem>

              </ContextMenuContent>
            )}

          </ContextMenu>

        </CardContent>
      </Card>


      {hasOpenEdgeDialog && (
        <EdgeLabelDialogItem
          dialogTitle='Add Edge'
          fromNode={getContextData<AddEdgeContextData>()?.from}
          toNode={getContextData<AddEdgeContextData>()?.to}
          open={hasOpenEdgeDialog}
          onOpenChange={handleOpenEdgeDialogChange}
          onSubmit={updateEdgeLabel}
        />
      )}

      {hasOpenEditEdgeDialog && (
        <EdgeLabelDialogItem
          dialogTitle='Update Edge'
          fromNode={getContextData<UpdateEdgeContextData>()?.from?.toString()}
          toNode={getContextData<UpdateEdgeContextData>()?.to?.toString()}
          defaultLabel={getContextData<UpdateEdgeContextData>()?.label}
          open={hasOpenEditEdgeDialog}
          onOpenChange={handleOpenUpdateEdgeDialogChange}
          onSubmit={updateEdgeLabel}
        />
      )}

    </>
  )
}
