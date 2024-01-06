import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import AutomataWorkspaceCanvas from "@/components/workspace-canvas"
import { PAGE_LABELS } from "./constants"

export default function AutomataWorkspace() {
  return (
    <div className="flex gap-8">

      <AutomataWorkspaceCanvas />

      <Card className="lg:h-[800px] w-3/12">
        <CardHeader>
          <CardTitle>{PAGE_LABELS.title}</CardTitle>
          <CardDescription>{PAGE_LABELS.description}</CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          Some content
        </CardContent>
      </Card>
    </div>

  )
}
