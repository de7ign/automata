export interface EdgeLabelDialogProps {
  dialogTitle: string;
  defaultLabel?: string;
  disabled?: boolean;
  fromNodeLabel: string;
  toNodeLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
}