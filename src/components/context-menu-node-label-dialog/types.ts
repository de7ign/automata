
export interface ContextMenuItemNodeLabelDialogProps {
  itemTitle: string;
  dialogTitle: string;
  dialogDescription: string;
  defaultLabel?: string;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
}
