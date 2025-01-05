import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { DataSetEdges, DataSetNodes, IdType, Network } from "vis-network/peer";
import { NETWORK_VISUALIZE_OPTION } from "./constants";
import { useNfaService } from "@/components/nfa-provider";
import { NfaResult, NfaTraceResult } from "@/services/nfa-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AutomataNode, NetworkNodes } from "@/components/workspace-canvas/types";
import { WorkSpaceCanvasUtil } from "@/components/workspace-canvas/workspace-canvas-util";

const formSchema = z.object({
  label: z.string().min(1, {
    message: 'This field cannot be empty'
  }),
})

type FormSchema = z.infer<typeof formSchema>;

interface ValidationAlertDetails {
  variant: 'default' | 'destructive' // follows Alert component variant
  title: string;
  messages: string[];
}

export default function WorkspaceVisualizeTransition() {

  const nfaService = useNfaService();

  const [openTransitionDialog, setOpenTransitionDialog] = useState(false);

  const [validationAlertDetails, setValidationAlertDetails] = useState<ValidationAlertDetails>();


  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: ''
    },
  })

  function handleSubmit(values: FormSchema) {
    // TODO: Trim spaces
    const errors: string[] = nfaService.isValidNfa();

    if (errors.length) {
      setValidationAlertDetails({
        variant: 'destructive',
        title: 'Invalid FSM',
        messages: errors
      })
    } else {
      setOpenTransitionDialog(true);
    }
  }


  return (
    <>
      <div className="m-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input to visualize</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Input String" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.label && (
                      <span className="text-red-500">{form.formState.errors.label.message}</span>
                    )}
                  </FormMessage>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Visualize</Button>
          </form>
        </Form>

        {validationAlertDetails && (
          <Alert variant={validationAlertDetails.variant}>
            {validationAlertDetails.variant === "default" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}

            <AlertTitle>{validationAlertDetails.title}</AlertTitle>

            {validationAlertDetails.messages.length > 0 && (
              <AlertDescription>
                <ul>
                  {validationAlertDetails.messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </AlertDescription>
            )}

          </Alert>
        )}
      </div>

      <TransitionDialog form={form} openTransitionDialog={openTransitionDialog} setOpenTransitionDialog={setOpenTransitionDialog} />
    </>
  )
}

interface TransitionDialogProps {
  openTransitionDialog: boolean;
  setOpenTransitionDialog: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<FormSchema>;
}

const TransitionDialog: React.FC<TransitionDialogProps> = ({ openTransitionDialog, setOpenTransitionDialog, form }) => {
  const nfaService = useNfaService();
  const networkContainerRef = useRef<HTMLDivElement | null>(null);
  const network = useRef<Network | null>(null);
  const canvasUtil = new WorkSpaceCanvasUtil();
  let data: {
    nodes: DataSetNodes;
    edges: DataSetEdges;
  } | undefined;

  function drawArrowForStartState(ctx: CanvasRenderingContext2D): void {

    const networkNodes = data?.nodes;

    const startStates: IdType[] = networkNodes?.getIds({
      filter: function (item: AutomataNode) {
        return !!item.isStart;
      }
    }) || [];

    startStates.forEach(startState => {
      const position = network.current?.getPosition(startState);
      if (position) {
        canvasUtil.drawArrowToLeftOfCircle(ctx, position);
      }
    });
  }


  function drawOuterCircleForFinalStates(ctx: CanvasRenderingContext2D): void {
    const networkNodes: NetworkNodes | undefined = data?.nodes;

    const items: IdType[] | undefined = networkNodes?.getIds({
      filter: function (item: AutomataNode) {
        return !!item.isFinal;
      }
    })

    if (items) {
      // TODO: Add type
      const nodeIdToPositions = network.current?.getPositions(items);
      const positions = [];

      for (let nodeId in nodeIdToPositions) {
        positions.push(nodeIdToPositions[nodeId])
      }

      if (positions && Array.isArray(positions)) {
        canvasUtil.drawOuterCircle(ctx, positions);
      }
    }
  }

  useEffect(() => {
    if (openTransitionDialog && networkContainerRef.current) {
      const networkContainer = networkContainerRef.current;

      const input = [{
        value: form.getValues().label
      }]

      const traceResult: NfaResult<NfaTraceResult> = nfaService.traceTransitions(input);

      data = traceResult.results[0].result;

      network.current = new Network(networkContainer, data, NETWORK_VISUALIZE_OPTION);

      network.current.on('beforeDrawing', (ctx: CanvasRenderingContext2D) => {
        drawArrowForStartState(ctx);
        drawOuterCircleForFinalStates(ctx);
      })

      setTimeout(() => {
        network.current?.fit({
          minZoomLevel: 1,
          maxZoomLevel: 1,
          animation: true
        })
      }, 500);
    }

    return () => {
      if (network.current) {
        network.current.destroy();
        network.current = null;
        networkContainerRef.current = null;
      }
    };
  }, [openTransitionDialog]);

  const dismissDialog = () => setOpenTransitionDialog(false);

  if (!openTransitionDialog) return null;

  return (

    <Dialog open={openTransitionDialog} onOpenChange={setOpenTransitionDialog}>
      <DialogContent className="h-[90vh] max-w-none w-11/12">
        <DialogHeader>
          <DialogTitle>Transition Graph</DialogTitle>
          <DialogDescription>
            Here you can see how your state machine works for your input
            string <b>&ldquo;{form.getValues().label}&rdquo;</b>
          </DialogDescription>
        </DialogHeader>
        <div ref={networkContainerRef} className="h-full overflow-auto border-2 border-blue-100">
        </div>
        <DialogFooter>
          <Button onClick={dismissDialog}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};