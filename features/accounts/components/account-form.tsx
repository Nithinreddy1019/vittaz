

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form, 
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField
} from "@/components/ui/form";

import { AccountsSchema } from "@/prisma/zod";
import { Trash2Icon } from "lucide-react";



const formSchema = AccountsSchema.pick({
    name: true
});
type FormValues = z.infer<typeof formSchema>;

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values: FormValues) => void,
    onDelete?: () => void,
    disabled?: boolean
}



export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                <FormField 
                    name="name"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    disabled={disabled}
                                    placeholder="e,g, Cash, Credit Card, Bank"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-full"
                    disabled={disabled}
                >
                    {id ? "Save changes" : "Create account"}
                </Button>
                {!!id && <Button
                    type="button"
                    className="w-full items-center"
                    disabled={disabled}
                    variant="destructive"
                    onClick={handleDelete}
                >
                    <Trash2Icon className="size-4 mr-2"/>
                    Delete account
                </Button>}
            </form>
        </Form>
    )
}