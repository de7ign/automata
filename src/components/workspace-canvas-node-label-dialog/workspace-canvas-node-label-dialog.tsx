import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { ContextMenuItem } from "@/components/ui/context-menu";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { formLabels, pageLabels } from "./constants"
import { NodeLabelDialogItemProps } from "./types";

export default function NodeLabelDialogItem(props: NodeLabelDialogItemProps) {
  const { itemTitle, dialogTitle, dialogDescription, defaultLabel, disabled, onOpenChange, onSubmit } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const formSchema = z.object({
    label: z.string().min(1, {
      message: formLabels.label.error.min
    }).max(5, {
      message: formLabels.label.error.max
    }),
  })

  const _defaultLabel: string = defaultLabel || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: _defaultLabel
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

  function dismiss(open: boolean): void {
    setDialogOpen(open);
    if(!open) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={dismiss}>
      <DialogTrigger asChild>
        <ContextMenuItem disabled={disabled} onSelect={(e) => {
          e.preventDefault();
          openDialog()
        }}>{itemTitle}</ContextMenuItem>
      </DialogTrigger>
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
              <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{pageLabels.save}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}