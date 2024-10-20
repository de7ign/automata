import { useNfaService } from "@/components/nfa-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NfaResult } from "@/services/nfa-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

interface ValidationAlertDetails {
  variant: 'default' | 'destructive' // follows Alert component variant
  title: string;
  messages: string[];
}

export default function WorkspaceInputValidation() {

  const nfaService = useNfaService();

  const [validationAlertDetails, setValidationAlertDetails] = useState<ValidationAlertDetails>();

  const formSchema = z.object({
    // TODO: Add max limit to avoid comically large inputs
    inputs: z.array(z.object({ value: z.string().min(1, 'This field cannot be empty') })),
  });

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputs: [{ value: "" }] // Initial state with one empty string
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inputs",
  });

  const onSubmit = (data: FormType) => {

    const validationResult: NfaResult = nfaService.validate(data.inputs);

    if (validationResult.errors?.length > 0) {
      // fsm validity
      setValidationAlertDetails({
        variant: 'destructive',
        title: 'Invalid FSM',
        messages: validationResult.errors
      })
    } else {
      // fsm is valid, input validity

      // clear the errors
      form.clearErrors();
      let failureCount = 0;
      let totalCount = validationResult.results.length;

      // set the errors
      validationResult.results.forEach((result, index) => {
        if (result.errors.length) {
          form.setError(`inputs.${index}.value` as keyof FormType, {
            type: "manual",
            message: result.errors[0]
          })
          failureCount++;
        }
      })

      setValidationAlertDetails({
        variant: failureCount ? 'destructive' : 'default',
        title: failureCount ? `${failureCount}/${totalCount} inputs are invalid` : 'All inputs are valid',
        messages: validationResult.errors
      })
    }
  };

  return (
    <div className="m-1"> {/* margin so keyboard focus outline are not trimmed */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-col gap-2">

            {fields.map((field, index) => (
              <FormField key={field.id} control={form.control} name={`inputs.${index}.value`} render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Input {index + 1}</FormLabel> */}
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        className={form.formState.errors.inputs?.[index] ? "border-red-500" : ""}
                        placeholder={`Input ${index + 1}`}
                      />
                      <Button variant="outline" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                        <Trash2 color="red" className="h-4 w-4"></Trash2>
                      </Button>
                    </div>
                  </FormControl>
                  {/* <FormDescription>Enter a value for input {index + 1}.</FormDescription>*/}
                  <FormMessage>
                    {form.formState.errors.inputs?.[index] && (
                      <span className="text-red-500">{form.formState.errors.inputs?.[index]?.message}</span>
                    )}
                  </FormMessage>

                </FormItem>
              )} />
            ))}

            {validationAlertDetails && validationAlertDetails.messages.length > 0 && (
              <Alert variant={validationAlertDetails.variant}>
                {validationAlertDetails.variant === "default" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}

                <AlertTitle>{validationAlertDetails.title}</AlertTitle>

                <AlertDescription>
                  {validationAlertDetails.messages.length === 1 ? (
                    <>{validationAlertDetails.messages[0]}</>

                  ) : (
                    <ul>
                      {validationAlertDetails.messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>

              </Alert>
            )}

          </div>

          <div className="flex justify-between">
            <div className="space-x-2">
              {/* Type button as it's being treated as submit */}
              <Button type="button" variant="outline" onClick={() => append({ value: "" })}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>

              <Button type="button" variant="destructive" onClick={() => {
                setValidationAlertDetails(undefined);
                form.reset({ inputs: [{ value: "" }] });
              }}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>

            <Button type="submit">Validate</Button>
          </div>
        </form>
        <div>
        </div>
      </Form>

    </div>
  )
}