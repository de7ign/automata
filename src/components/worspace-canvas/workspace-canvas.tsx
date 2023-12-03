'use client'

import { forwardRef, useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer"
import { DataSetEdges, IdType, Network, Options } from "vis-network/peer"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import keycharm, { Keycharm } from "keycharm";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NetworkNodes, ContextMenuData, NetworkEventParams, ContextMenuMode } from "./types";
import { NETWORK_DEFAULT_OPTION } from "./constants";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function AutomataWorkspaceCanvas() {

  const networkContainer = useRef<HTMLDivElement>(null);
  const network = useRef<any>(null)
  const networkNodes = useRef<any>(null);
  const networkEdges = useRef<any>(null);
  const contextMenuData = useRef<ContextMenuData>(null);
  let keyBinding: Keycharm

  const [contextMenuMode, setContextMenuMode] = useState<ContextMenuMode>(null);
  // const [openAddNodeDialog, setOpenAddNodeDialog] = useState<boolean>(false);
  const [hasOpenDialog, setHasOpenDialog] = useState<boolean>(false);

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
      const data = {
        nodes: getNetworkNodes(),
        edges: getNetworkEdges()
      };

      setNetwork(new Network(networkContainer.current, data, NETWORK_DEFAULT_OPTION));

      const network: Network = getNetwork();

      network.on("doubleClick", (params: NetworkEventParams) => {
        addNode(params);
      });

      network.on('oncontext', (params: NetworkEventParams) => {
        const nodeId: IdType = network.getNodeAt(params.pointer.DOM)
        if (nodeId) {
          network.selectNodes([nodeId], false);
          contextMenuData.current = {
            nodeId: nodeId
          }
          setContextMenuMode("updateNode")
        } else {
          contextMenuData.current = {
            position: params.pointer.canvas
          }
          setContextMenuMode("addNode")
        }
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


  function addNode(params: any): void {
    alert('double clicked')
  }

  // initialize your network!

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
    if (contextMenuMode === "addNode" && contextMenuData.current?.position) {
      networkNodes.add({
        id: uuidv4(),
        label: label,
        x: contextMenuData.current.position.x,
        y: contextMenuData.current.position.y
      })
    }
  }


  function deleteNode(): void {
    const networkNodes = getNetworkNodes();
    if(contextMenuMode === "updateNode" && contextMenuData.current?.nodeId) {
      networkNodes.remove(contextMenuData.current.nodeId);
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

              <AddDialogItem
                itemTitle='Add state'
                description='Give your new state a name'
                onOpenChange={handleDialogItemOpenChange}
                onSubmit={addState}
              />

              <ContextMenuItem>Add start state</ContextMenuItem>

              <ContextMenuItem>Add final state</ContextMenuItem>
            </ContextMenuContent>
          )}

          {contextMenuMode === 'updateNode' && (<ContextMenuContent className="w-52">
            <ContextMenuItem>Edit state label</ContextMenuItem>
            <ContextMenuItem onSelect={deleteNode}>Delete node</ContextMenuItem>
          </ContextMenuContent>
          )}
        </ContextMenu>

      </CardContent>
    </Card>
  )
}


interface DialogItemProps {
  itemTitle: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
}


function AddDialogItem(props: DialogItemProps) {
  const { itemTitle, description, onOpenChange, onSubmit } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const formSchema = z.object({
    label: z.string().min(1, {
      message: 'Label is required'
    }).max(5, {
      message: 'Label must be less than 10 characters'
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: ''
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.label);
    onOpenChange(false);
  }

  function openDialog(): void {
    onOpenChange(true);
    setDialogOpen(true)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <ContextMenuItem onSelect={(e) => {
          e.preventDefault();
          openDialog()
        }}>{itemTitle}</ContextMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-[325px]">
        <DialogHeader>
          <DialogTitle>Add State</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Label</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
