export interface NodeLabelDialogProps {
  dialogTitle: string;
  defaultLabel?: string;
  dialogDescription: string;
  disabled?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
}