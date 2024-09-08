import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { EdgeLabelDialogProps } from "./types";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { formLabels, pageLabels } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";


export default function EdgeLabelDialog(props: EdgeLabelDialogProps) {

  const { dialogTitle, open, fromNodeLabel, toNodeLabel, onOpenChange, onSubmit, defaultLabel } = props;

  const _defaultLabel: string = defaultLabel || '';

  /**
   * Reject strings like this "a, a"
   * 
   * @param data 
   * @returns 
   */
  const allStringsUnique = (data: string) => {
    const dataArray = data.split(',');
    const dataSet: Set<string> = new Set();

    for(let i = 0; i < dataArray.length; i++) {
      const dataValue = dataArray[i].trim();
      if (dataSet.has(dataValue)) {
        return false;
      }
      dataSet.add(dataValue);
    }

    return true;
  }

  /**
   * Reject strings like this "a, a a"
   * 
   * @param data 
   * @returns 
   */
  const allStringsWithNoWhiteSpace = (data: string) => {
    const dataArray = data.split(',');

    for(let i = 0; i < dataArray.length; i++) {
      const dataValue = dataArray[i].trim();
      if (dataValue.includes(' ')) {
        return false;
      }
    }

    return true;
  }

  const formSchema = z.object({
    label: z.string()
      .refine(allStringsUnique, { message: formLabels.label.error.allStringsUnique })
      .refine(allStringsWithNoWhiteSpace, { message: formLabels.label.error.allStringsUnique })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: _defaultLabel
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.label?.trim());
    onOpenChange(false);
    form.reset();
  }

  function cancel() {
    form.reset();
    onOpenChange(false)
  }

  function dismiss(value: boolean) {
    if (!value) {
      form.reset();
    }
    onOpenChange(value)
  }  

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="max-w-l">

        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Provide a label name for the edge from <b>{fromNodeLabel}</b> to <b>{toNodeLabel}</b></DialogDescription>
        </DialogHeader>

        <div className="text-sm">You can provide multiple labels separated by commas</div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formLabels.label.label}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={formLabels.label.placeholder}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inside form so the submit can work */}
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={cancel}>Cancel</Button>
              <Button type="submit">{pageLabels.save}</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}