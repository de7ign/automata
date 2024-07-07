'use client'

import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer"
import { Data, Edge, IdType, Network, Options } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import keycharm, { Keycharm } from "keycharm";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import {
  AutomataNode,
  ActionContextData,
  NetworkEventParams,
  ContextMenuMode,
  NodeAddUpdateMode,
  NetworkNodes,
  NetworkEdges,
  SelectedNetworkElements
} from "./types";
import { NETWORK_DEFAULT_OPTION } from "./constants";
import { v4 as uuidv4 } from 'uuid';
import { WorkSpaceCanvasUtil } from "./workspace-canvas-util";
import EdgeLabelDialog from "../edge-label-dialog/edge-label-dialog";
import { FullItem } from "vis-data/declarations/data-interface";
import { Button } from "../ui/button";
import NodeLabelDialog from "../node-label-dialog/node-label-dialog";
import networkService from "@/services/network-service";
import { getSelectedNetworkElements } from "./workspace-network-util";

export default function AutomataWorkspaceCanvas() {

  const canvasUtil = new WorkSpaceCanvasUtil();

  const networkContainer = useRef<HTMLDivElement>(null);
  const actionContextData = useRef<ActionContextData>(null);
  const keyBinding = useRef<Keycharm | null>(null);

  const nodeAddUpdateMode = useRef<any>(null);

  const [contextMenuMode, setContextMenuMode] = useState<ContextMenuMode>(null);

  // Node dialogs
  const [hasOpenAddNodeDialog, setHasOpenAddNodeDialog] = useState<boolean>(false);

  // Edge dialogs
  const [hasOpenAddEdgeDialog, setHasOpenAddEdgeDialog] = useState<boolean>(false);
  const [hasOpenEditEdgeDialog, setHashEditEdgeDialog] = useState<boolean>(false);

  const [hasStartState, setHasStartState] = useState<boolean>(false);
  const [isEdgeCreationMode, setIsEdgeCreationMode] = useState<boolean>(false);


  function getActionContextData(): ActionContextData {
    return actionContextData.current;
  }

  function getNodeAddUpdateMode(): NodeAddUpdateMode {
    return nodeAddUpdateMode.current;
  }

  function setNodeAddUpdateMode(mode: NodeAddUpdateMode): void {
    nodeAddUpdateMode.current = mode;
  }

  useEffect(() => {
    if (networkContainer.current != null) {

      const defaultNodes = new DataSet([
        { id: '1', label: 'Node x' },
        { id: '2', label: 'Node 2' },
        { id: '3', label: 'Node 3' },
        { id: '4', label: 'Node 4' },
        { id: '5', label: 'Node 5' }
      ], {});

      const defaultEdges = new DataSet([
        { id: 1, from: 1, to: 3, label: 'asd' },
        { id: 2, from: 1, to: 2 },
        { id: 3, from: 2, to: 4 },
        { id: 4, from: 2, to: 5 }
      ], {})

      const data: Data = {
        nodes: defaultNodes,
        edges: defaultEdges
      };

      networkService.createNetwork(networkContainer.current, customizeNetworkOption(NETWORK_DEFAULT_OPTION), data);

      initNetworkBindings();

      keyBinding.current = keycharm({
        preventDefault: true
      });

      initKeyBindings();

      return () => {

        keyBinding.current?.destroy();

        networkService.destroyNetwork();
      }
    }
  }, [networkContainer]);

  function initNetworkBindings() {

    const network: Network = networkService.getNetwork();

    network.on('oncontext', (params: NetworkEventParams) => {


      const nwElements: SelectedNetworkElements | undefined = getSelectedNetworkElements(params);

      if (!nwElements?.node && !nwElements?.edge) {
        actionContextData.current = {
          type: 'empty',
          position: params.pointer.canvas
        };

        setContextMenuMode("addNodeAndEdge");
      } else if (nwElements?.node) {
        // node found, launch context menu for updating node
        actionContextData.current = {
          type: 'node',
          ...nwElements.node
        }

        setContextMenuMode("updateNode")
      } else if (nwElements?.edge) {
        // edge found, launch context menu for updating edge

        actionContextData.current = {
          type: 'edge',
          ...nwElements?.edge
        }
        setContextMenuMode("updateEdge")
      }

    })

    network.on('doubleClick', (params: NetworkEventParams) => {

      const nwElements: SelectedNetworkElements | undefined = getSelectedNetworkElements(params);

      if (nwElements?.edge) {
        actionContextData.current = {
          type: 'edge',
          ...nwElements.edge
        }
        launchUpdateEdgeModal();
      }
    })

    network.on('beforeDrawing', (ctx: CanvasRenderingContext2D) => {
      drawArrowForStartState(ctx);
      drawOuterCircleForFinalStates(ctx);
    })
  }

  function initKeyBindings() {
    // Delete bindings
    keyBinding.current?.bind('d', (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        bindCaseInsensitiveShortcutForD();
      }
    })

    // Edit bindings
    keyBinding.current?.bind('e', (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        toggleDrawEdgeMode();
      }
    })
  }

  function customizeNetworkOption(defaultOption: Options): Options {
    const options: Options = structuredClone(defaultOption)
    options.manipulation = {
      ...options.manipulation,
      addEdge: function (edgeData: any, callback: (arg0: any) => void) {


        if (edgeData?.from && edgeData.to) {
          callback(edgeData)

          actionContextData.current = {
            type: 'edge',
            id: edgeData.id,
            from: edgeData.from,
            to: edgeData.to,
            label: ''
          }
          setHasOpenAddEdgeDialog(true)
        } else {
          console.error("Unable to get edge data")
        }
      }
    }

    return options;
  }


  function getStartState(): IdType | undefined {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();

    const item: IdType[] | undefined = networkNodes?.getIds({
      filter: function (item: AutomataNode) {
        return !!item.isStart;
      }
    })

    if (item?.length === 1) {
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

  function drawArrowForStartState(ctx: CanvasRenderingContext2D): void {
    const network: Network = networkService.getNetwork();

    const startStateItem = getStartState();

    if (startStateItem) {
      canvasUtil.drawArrowToLeftOfCircle(ctx, network.getPosition(startStateItem));
    }
  }

  function drawOuterCircleForFinalStates(ctx: CanvasRenderingContext2D): void {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();

    const items: IdType[] | undefined = networkNodes?.getIds({
      filter: function (item: AutomataNode) {
        return !!item.isFinal;
      }
    })

    if (items) {
      // TODO: Add type
      const nodeIdToPositions = networkService.getNetwork().getPositions(items);
      const positions = [];

      for (let nodeId in nodeIdToPositions) {
        positions.push(nodeIdToPositions[nodeId])
      }

      if (positions && Array.isArray(positions)) {
        canvasUtil.drawOuterCircle(ctx, positions);
      }
    }
  }


  function onContextMenuOpenChange(open: boolean): void {
    if (!open) {
      setContextMenuMode(null);
    }
  }

  function addState(label: string): void {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();
    const contextData: ActionContextData = getActionContextData();
    if (contextData?.type === "empty" && contextData?.position) {
      networkNodes?.add({
        id: uuidv4(),
        label: label,
        x: contextData.position.x,
        y: contextData.position.y
      })
    }
  }


  function addStartState(label: string): void {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();
    const contextData: ActionContextData = getActionContextData();

    if (contextData?.type === "empty" && contextData?.position) {
      networkNodes?.add({
        id: uuidv4(),
        label: label,
        x: contextData.position.x,
        y: contextData.position.y,
        isStart: true
      })
    }
  }

  function addFinalState(label: string): void {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();
    const contextData: ActionContextData = getActionContextData();

    if (contextData?.type === "empty" && contextData?.position && networkNodes) {
      networkNodes.add({
        id: uuidv4(),
        label: label,
        x: contextData.position.x,
        y: contextData.position.y,
        isFinal: true
      })
    }
  }

  function updateStateLabel(label: string): void {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();
    const contextData: ActionContextData = getActionContextData();

    if (contextData?.type === "node" && contextData?.id && networkNodes) {
      networkNodes.update({
        ...networkNodes.get(contextData.id),
        label: label
      })
    }
  }


  function deleteNode(): void {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();
    const contextData: ActionContextData = getActionContextData();

    if (contextData?.type === "node" && contextData?.id && networkNodes) {
      networkNodes.remove(contextData.id);
    }
  }

  // TODO: Update the method name
  function handleOpenEdgeDialogChange(open: boolean): void {
    setHasOpenAddEdgeDialog(open);
    onContextMenuOpenChange(open);
    setIsEdgeCreationMode(false);
  }

  function toggleDrawEdgeMode(): void {
    setIsEdgeCreationMode(isEdgeCreationMode => !isEdgeCreationMode);
  }

  useEffect(() => {
    const network: Network = networkService.getNetwork();

    if (isEdgeCreationMode) {
      network.addEdgeMode();
    } else {
      network.disableEditMode();
    }
  }, [isEdgeCreationMode])


  function updateEdgeLabel(label: string): void {
    const networkEdges: NetworkEdges | undefined = networkService.getEdges();

    const contextData: ActionContextData = getActionContextData();

    if (contextData?.type === "edge" && contextData?.id && networkEdges) {
      networkEdges.update({
        ...networkEdges.get(contextData.id),
        label: label
      })
    }

  }

  function deleteEdge(): void {
    const networkEdges: NetworkEdges | undefined = networkService.getEdges();
    const contextData: ActionContextData = getActionContextData();

    if (contextData?.type === "edge" && contextData?.id && networkEdges) {
      networkEdges.remove(contextData.id);
    }
  }

  function launchUpdateEdgeModal(): void {
    setHashEditEdgeDialog(true);
  }

  function handleOpenUpdateEdgeDialogChange(open: boolean): void {
    setHashEditEdgeDialog(open);
    onContextMenuOpenChange(open);
  }

  function bindCaseInsensitiveShortcutForD(): void {
    checkSelectedNodeAndDelete();
    checkSelectedEdgeAndDelete();
  }

  // TODO: onClick will set context data, no need to set it here, just check the type and delete
  function checkSelectedNodeAndDelete(): void {
    const selectedNodes: IdType[] = networkService.getNetwork().getSelectedNodes();
    if (selectedNodes.length) {
      const nodeId = selectedNodes[0];
      const networkNodes: NetworkNodes | undefined = networkService.getNodes();
      if (networkNodes) {
        actionContextData.current = {
          type: 'node',
          id: nodeId,
          label: networkNodes.get(nodeId)?.label || ''
        }
      }

      deleteNode();
    }
  }

  // TODO: onClick will set context data, no need to set it here, just check the type and delete
  function checkSelectedEdgeAndDelete(): void {
    const selectedEdges: IdType[] = networkService.getNetwork().getSelectedEdges();

    if (selectedEdges.length) {
      const edgeId = selectedEdges[0];
      const networkEdges: NetworkEdges | undefined = networkService.getEdges();
      if (networkEdges) {
        const edgeDetails: FullItem<Edge, "id"> | null = networkEdges.get(edgeId);
        actionContextData.current = {
          type: 'edge',
          id: edgeId,
          label: edgeDetails?.label || '',
          from: edgeDetails?.from || '',
          to: edgeDetails?.to || ''
        }
      }

      deleteEdge();
    }
  }


  function handleOpenNodeDialogChange(open: boolean): void {
    setHasOpenAddNodeDialog(open);
    onContextMenuOpenChange(open);
  }

  function launchNodeAddUpdateDialog(type: NodeAddUpdateMode): void {
    // set mode
    setNodeAddUpdateMode(type);

    // launch modal
    setHasOpenAddNodeDialog(true);

  }


  return (
    <>
      <Card className="lg:h-[800px] w-9/12">
        <CardContent className="h-full p-0">
          <ContextMenu onOpenChange={onContextMenuOpenChange}>

            {isEdgeCreationMode && (
              <div className="bg-sky-500 rounded-t-sm p-1 flex justify-between items-baseline text-sm">
                <div>
                  You&apos;re now in edge creation mode, click-drag from one state to another!
                </div>
                <Button variant="outline" className="bg-transparent"
                  onClick={() => setIsEdgeCreationMode(false)}>Cancel</Button>
              </div>
            )}

            <ContextMenuTrigger asChild>
              <div ref={networkContainer} className="h-full"></div>
            </ContextMenuTrigger>

            {contextMenuMode === 'addNodeAndEdge' && (
              <ContextMenuContent className="w-60">

                <ContextMenuItem onSelect={() => {
                  launchNodeAddUpdateDialog("normalAdd")
                }}>
                  Add state
                </ContextMenuItem>

                <ContextMenuItem onSelect={() => {
                  launchNodeAddUpdateDialog("startAdd")
                }}>
                  Add start state
                </ContextMenuItem>

                <ContextMenuItem onSelect={() => {
                  launchNodeAddUpdateDialog("finalAdd")
                }}>
                  Add final state
                </ContextMenuItem>

                <ContextMenuItem onSelect={() => setIsEdgeCreationMode(true)}>
                  Draw edge
                  <ContextMenuShortcut>ctrl + e</ContextMenuShortcut>
                </ContextMenuItem>

              </ContextMenuContent>
            )}

            {contextMenuMode === 'updateNode' && (
              <ContextMenuContent className="w-60">

                <ContextMenuItem onSelect={() => {
                  launchNodeAddUpdateDialog("update")
                }}>
                  Edit state label
                </ContextMenuItem>

                <ContextMenuItem onSelect={deleteNode}>
                  Delete node
                  <ContextMenuShortcut>select + ctrl + d</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            )}

            {contextMenuMode === 'updateEdge' && (
              <ContextMenuContent className="w-60">

                <ContextMenuItem onSelect={launchUpdateEdgeModal}>
                  Update edge
                </ContextMenuItem>

                <ContextMenuItem onSelect={deleteEdge}>
                  Delete edge
                  <ContextMenuShortcut>select + D</ContextMenuShortcut>
                </ContextMenuItem>

              </ContextMenuContent>
            )}

          </ContextMenu>

        </CardContent>
      </Card>

      {/* State related dialog box */}

      {/* TODO: Revisit if we can get rid of getNodeAndUpdateMode() and rely actionContextData */}
      {hasOpenAddNodeDialog && getNodeAddUpdateMode() === 'normalAdd' && (
        <NodeLabelDialog
          dialogTitle='Add state'
          dialogDescription='Give your new state a name!'
          open={hasOpenAddNodeDialog}
          onOpenChange={handleOpenNodeDialogChange}
          onSubmit={addState}
        ></NodeLabelDialog>
      )}

      {hasOpenAddNodeDialog && getNodeAddUpdateMode() === 'startAdd' && (
        <NodeLabelDialog
          dialogTitle='Add start state'
          dialogDescription='Give your new state a name!'
          open={hasOpenAddNodeDialog}
          onOpenChange={handleOpenNodeDialogChange}
          onSubmit={addStartState}
        ></NodeLabelDialog>
      )}

      {hasOpenAddNodeDialog && getNodeAddUpdateMode() === 'finalAdd' && (
        <NodeLabelDialog
          dialogTitle='Add final state'
          dialogDescription='Give your new state a name!'
          open={hasOpenAddNodeDialog}
          onOpenChange={handleOpenNodeDialogChange}
          onSubmit={addFinalState}
        ></NodeLabelDialog>
      )}

      {hasOpenAddNodeDialog && getNodeAddUpdateMode() === 'update' && (
        <NodeLabelDialog
          dialogTitle='Edit state label'
          dialogDescription='Provide a updated name'
          defaultLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "node" ? contextData.label : ''
          }()}
          open={hasOpenAddNodeDialog}
          onOpenChange={handleOpenNodeDialogChange}
          onSubmit={updateStateLabel}
        ></NodeLabelDialog>
      )}

      {/* Edge related dialog box */}

      {hasOpenAddEdgeDialog && (
        <EdgeLabelDialog
          dialogTitle='Add Edge'
          fromNode={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData?.from : '';
          }()}
          toNode={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData?.to : '';
          }()}
          open={hasOpenAddEdgeDialog}
          onOpenChange={handleOpenEdgeDialogChange}
          onSubmit={updateEdgeLabel}
        />
      )}

      {hasOpenEditEdgeDialog && (
        <EdgeLabelDialog
          dialogTitle='Update Edge'
          fromNode={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData.from : '';
          }()}
          toNode={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData.to : '';
          }()}
          defaultLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData.label : '';
          }()}
          open={hasOpenEditEdgeDialog}
          onOpenChange={handleOpenUpdateEdgeDialogChange}
          onSubmit={updateEdgeLabel}
        />
      )}

    </>
  )
}