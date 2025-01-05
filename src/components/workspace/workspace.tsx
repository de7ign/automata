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
