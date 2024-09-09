import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import AutomataWorkspaceCanvas from "@/components/workspace-canvas"
import WorkspaceOperator from "../workspace-operator"

export default function AutomataWorkspace() {
  return (
    <div className="flex gap-8">

      <AutomataWorkspaceCanvas />

      <WorkspaceOperator />
    </div>

  )
}
