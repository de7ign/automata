import { IdType } from "vis-network";

export interface EdgeLabelDialogProps {
  dialogTitle: string;
  defaultLabel?: string;
  disabled?: boolean;
  fromNode: IdType;
  toNode: IdType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
}