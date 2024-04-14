export interface EdgeLabelDialogProps {
  dialogTitle: string;
  defaultLabel?: string;
  disabled?: boolean;
  fromNode: string;
  toNode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
}