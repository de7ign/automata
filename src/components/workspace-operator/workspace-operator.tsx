"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PAGE_LABELS } from "./constants";
import nfaService from "@/services/nfa-service";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";


type ValidationType = 'single';

interface SingleValidationResults {
  type: ValidationType;
  isValid: boolean;
  errors?: string[];
}


type EnsureHasType<T> = T extends { type: ValidationType } ? T : never;

type ValidationResults = EnsureHasType<SingleValidationResults>

export default function WorkspaceOperator() {

  const [singleInput, setSingleInput] = useState<string>();
  const [validationResults, setValidationResults] = useState<ValidationResults>();

  function validateSingleInput() {
    if (!singleInput) {
      return;
    }

    const result: string[] | boolean = nfaService.validate(singleInput);
    console.log('result, ', result)

    if (Array.isArray(result)) {
      setValidationResults({
        type: "single",
        isValid: false,
        errors: result
      })
    } else {
      setValidationResults({
        type: "single",
        isValid: result
      })
    }

  }

  return (
    <Card className="lg:h-[800px] w-3/12">
      <CardHeader>
        <CardTitle>{PAGE_LABELS.title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="single-string-validation">
            <AccordionTrigger>Single input</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 m-1"> {/* m-1 is required, as the focus outline of input is cutting off */}
                <Input value={singleInput}
                  onChange={e => setSingleInput(e.target.value)}
                  placeholder="Enter a test string"></Input>
                <Button onClick={validateSingleInput}>Validate</Button>
              </div>
              {validationResults?.type === "single" && (
                <Alert variant={validationResults.isValid ? "default" : "destructive"}>
                  {validationResults.isValid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}


                  <AlertTitle>{validationResults.isValid ? "Valid" : validationResults?.errors ? "Validation Errors" : "Invalid"}</AlertTitle>

                  <AlertDescription>
                    {validationResults.errors ? (
                      validationResults.errors.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))
                    ) : (
                      <>The input string is {validationResults.isValid ? "accepted" : "not accepted"} by the FSM.</>
                    )}
                  </AlertDescription>

                  {/* {validationResults.errors ? (
                    <AlertDescription>
                      {validationResults.errors.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </AlertDescription>
                  ) : (
                    <AlertDescription>
                      The input string is {validationResults.isValid ? "accepted" : "not accepted"} by the FSM.
                    </AlertDescription>
                  )} */}

                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* <Button onClick={() => {
          setErrors(nfaService.isValidNfa());
        }}>Validate</Button>

        {errors?.map(e => (
          <p>{e}</p>
        ))} */}

      </CardContent>
    </Card>
  )
}