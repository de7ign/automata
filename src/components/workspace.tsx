import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AutomataWorkspaceCanvas from "./workspace-canvas"

export default function AutomataWorkspace() {
  return (
    <div className="flex gap-8">

      <AutomataWorkspaceCanvas/>

      <Card className="lg:h-[800px] w-3/12">
        <CardHeader>
          <CardTitle>Operator</CardTitle>
          <CardDescription>Toolbar to interact with state machine</CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          Some content
        </CardContent>
      </Card>
    </div>

  )
}
