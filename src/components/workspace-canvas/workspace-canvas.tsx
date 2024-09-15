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
import { ATX_LAMBDA, NETWORK_DEFAULT_OPTION } from "./constants";
import { v4 as uuidv4 } from 'uuid';
import { WorkSpaceCanvasUtil } from "./workspace-canvas-util";
import EdgeLabelDialog from "../edge-label-dialog/edge-label-dialog";
import { FullItem } from "vis-data/declarations/data-interface";
import { Button } from "../ui/button";
import NodeLabelDialog from "../node-label-dialog/node-label-dialog";
import { useNetworkService } from "../network-provider";
import { getSelectedNetworkElements } from "./workspace-network-util";

export default function AutomataWorkspaceCanvas() {

  const networkService = useNetworkService();

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
  const [hasOpenEditEdgeDialog, setHasOpenEditEdgeDialog] = useState<boolean>(false);

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
        { id: '1', label: 'q0', isStart: true },
        { id: '2', label: 'q1', isFinal: true }
      ], {});

      const defaultEdges = new DataSet([
        { id: '1', from: '1', to: '2', label: 'a' },
        { id: '2', from: '2', to: '2', label: 'b' },
        { id: '3', from: '2', to: '1', label: 'a' },
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

      // Temporary disabling the key bindings,
      // will revisit, what shortcuts to assign
      // initKeyBindings();

      return () => {

        keyBinding.current?.destroy();

        networkService.destroyNetwork();
      }
    }
  }, [networkContainer, networkService]);

  function initNetworkBindings() {

    const network: Network = networkService.getNetwork();

    network.on('oncontext', (params: NetworkEventParams) => {


      const nwElements: SelectedNetworkElements | undefined = getSelectedNetworkElements(params);

      const networkNodes: NetworkNodes | undefined = networkService.getNodes();

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

        const fromNode = networkNodes?.get(nwElements.edge.from);
        const toNode = networkNodes?.get(nwElements.edge.to);

        actionContextData.current = {
          type: 'edge',
          ...nwElements?.edge,
          fromLabel: fromNode?.label || '$fromNodeLabel',
          toLabel: toNode?.label || '$toNodeLabel'
        }
        setContextMenuMode("updateEdge")
      }

    })

    network.on('doubleClick', (params: NetworkEventParams) => {

      const nwElements: SelectedNetworkElements | undefined = getSelectedNetworkElements(params);


      if (nwElements?.edge) {
        const networkNodes: NetworkNodes | undefined = networkService.getNodes();

        const fromNode = networkNodes?.get(nwElements.edge.from);
        const toNode = networkNodes?.get(nwElements.edge.to);

        actionContextData.current = {
          type: 'edge',
          ...nwElements.edge,
          fromLabel: fromNode?.label || '$fromNodeLabel',
          toLabel: toNode?.label || '$toNodeLabel'
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
      // TODO: Add type for edgeData
      addEdge: function (edgeData: any, callback: (arg0: any) => void) {


        if (edgeData?.from && edgeData.to) {

          setHasOpenAddEdgeDialog(true)

          const networkNodes: NetworkNodes | undefined = networkService.getNodes();
          const fromNode: null | FullItem<AutomataNode, "id"> | undefined = networkNodes?.get(edgeData.from as IdType);
          const toNode: null | FullItem<AutomataNode, "id"> | undefined = networkNodes?.get(edgeData.to as IdType);

          actionContextData.current = {
            type: 'edge',
            id: edgeData.id, // it will be null, if callback is not used
            from: edgeData.from,
            fromLabel: fromNode?.label || '$fromNodeLabel',
            to: edgeData.to,
            toLabel: toNode?.label || '$edgeNodeLabel',
            label: ''
          }

        } else {
          console.error("Unable to get edge data")
        }
      }
    }

    return options;
  }


  function getStartState(): IdType[] {
    const networkNodes: NetworkNodes | undefined = networkService.getNodes();

    return networkNodes?.getIds({
      filter: function (item: AutomataNode) {
        return !!item.isStart;
      }
    }) || [];
  }

  function isStartStatePresent(): boolean {
    return getStartState().length > 0;
  }

  function markHasStartStateIfStartStateIsPresent() {
    if (isStartStatePresent()) {
      setHasStartState(true);
    }
  }

  function drawArrowForStartState(ctx: CanvasRenderingContext2D): void {
    const network: Network = networkService.getNetwork();

    const startStates: IdType[] = getStartState();

    startStates.forEach(startState => {
      canvasUtil.drawArrowToLeftOfCircle(ctx, network.getPosition(startState));
    });
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
    
    if (contextData?.type === "edge" && networkEdges) {

      // Update edge
      if (contextData?.id) {
        networkEdges.update({
          ...networkEdges.get(contextData.id),
          label: label || ATX_LAMBDA
        })
      } else { // Add edge

        const edgeDetails: FullItem<Edge, "id">[] = networkEdges.get({
          filter: (item) => {
            return item.from === contextData.from && item.to === contextData.to;
          }
        })

        // Already an edge is present, merge the labels
        if (edgeDetails) {
          if (edgeDetails.length > 1) {
            console.error("Invalid network: There shouldn't be more than one transition for a pair of nodes")
          }

          if (edgeDetails[0].label === ATX_LAMBDA) {
            edgeDetails[0].label = label;
          } else if (label) {
            // Consider only if existing label is not ATX_LAMBDA and user input is NOT empty string
            // So we do not add an empty string to back of valid input
            edgeDetails[0].label += ', ' + label
          }

          networkEdges.update(edgeDetails);

        } else {
          // No existing edge, do a plain add

          networkEdges.add({
            ...contextData,
            id: crypto.randomUUID(),
            label: label || ATX_LAMBDA
          })
        }
      }

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
    setHasOpenEditEdgeDialog(true);
  }

  function handleOpenUpdateEdgeDialogChange(open: boolean): void {
    setHasOpenEditEdgeDialog(open);
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
      const networkNodes: NetworkNodes | undefined = networkService.getNodes();
      if (networkEdges && networkNodes) {
        const edgeDetails: FullItem<Edge, "id"> | null = networkEdges.get(edgeId);
        const fromNodeDetails: FullItem<AutomataNode, "id"> | null = networkNodes.get(edgeDetails?.from || '');
        const toNodeDetails: FullItem<AutomataNode, "id"> | null = networkNodes.get(edgeDetails?.to || '');
        actionContextData.current = {
          type: 'edge',
          id: edgeId,
          label: edgeDetails?.label || '',
          from: edgeDetails?.from || '',
          fromLabel: fromNodeDetails?.label || '$fromNodeLabel',
          to: edgeDetails?.to || '',
          toLabel: toNodeDetails?.label || '$toNodeLabel'
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
                  {/* <ContextMenuShortcut>ctrl + e</ContextMenuShortcut> */}
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
                  {/* <ContextMenuShortcut>select + ctrl + d</ContextMenuShortcut> */}
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
                  {/* <ContextMenuShortcut>select + D</ContextMenuShortcut> */}
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
          fromNodeLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData?.fromLabel : '$fromNodeLabel';
          }()}
          toNodeLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData?.toLabel : '$toNodeLabel';
          }()}
          open={hasOpenAddEdgeDialog}
          onOpenChange={handleOpenEdgeDialogChange}
          onSubmit={updateEdgeLabel}
        />
      )}

      {hasOpenEditEdgeDialog && (
        <EdgeLabelDialog
          dialogTitle='Update Edge'
          fromNodeLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData.fromLabel : '$fromNodeLabel';
          }()}
          toNodeLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData.toLabel : '$toNodeLabel';
          }()}
          defaultLabel={function () {
            const contextData = getActionContextData();
            return contextData?.type === "edge" ? contextData.label : '$edgeLabel';
          }()}
          open={hasOpenEditEdgeDialog}
          onOpenChange={handleOpenUpdateEdgeDialogChange}
          onSubmit={updateEdgeLabel}
        />
      )}

    </>
  )
}