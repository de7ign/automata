import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { NodeLabelDialogProps } from "./types";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function NodeLabelDialog(props: NodeLabelDialogProps) {

  const { dialogTitle, open, dialogDescription, onOpenChange, onSubmit, defaultLabel } = props;

  const _defaultLabel: string = defaultLabel || '';

  const formSchema = z.object({
    label: z.string().min(1, {
      message: formLabels.label.error.min
    }).max(5, {
      message: formLabels.label.error.max
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: _defaultLabel
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.label);
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
      <DialogContent className="max-w-[325px]">

        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formLabels.label.label}</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder={formLabels.label.placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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