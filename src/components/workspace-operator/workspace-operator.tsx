"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PAGE_LABELS } from "./constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import WorkspaceInputValidation from "./workspace-input-validation/workspace-input-validation";
import WorkspaceExport from "./workspace-export/workspace-export";
import WorkspaceVisualizeTransition from "./workspace-visualize-transition/workspace-visualize-transition";


export default function WorkspaceOperator() {

  return (
    <Card className="lg:h-[800px] w-3/12">
      <CardHeader>
        <CardTitle>{PAGE_LABELS.title}</CardTitle>
        <CardDescription className="text-red-500">
          {PAGE_LABELS.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="string-validation">
            <AccordionTrigger>Validate input</AccordionTrigger>
            <AccordionContent>
              <WorkspaceInputValidation />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-string-validation">
            <AccordionTrigger>
              Visualize Input Transitions
            </AccordionTrigger>
            <AccordionContent>
              <WorkspaceVisualizeTransition />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="step-string-step-validation">
            <AccordionTrigger>
              Step by Step Validation
            </AccordionTrigger>
            <AccordionContent>
              Coming soon
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="export">
            <AccordionTrigger>
              Export
            </AccordionTrigger>
            <AccordionContent>
              <WorkspaceExport />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </CardContent>
    </Card>
  )
}