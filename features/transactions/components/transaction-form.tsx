

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

import { TransactionsSchema } from "@/prisma/zod";
import { Trash2Icon } from "lucide-react";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmoutInput } from "@/components/amount-input";
import { convertAmountToMillUnits } from "@/lib/utils";



const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
});
const apiSchema = TransactionsSchema.omit({
    id: true
});


type FormValues = z.infer<typeof formSchema>;
type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values: ApiFormValues) => void,
    onDelete?: () => void,
    disabled?: boolean,
    accountOptions: { label: string, value: string}[],
    categoryOptions: { label: string, value: string}[],
    onCreateAccount: (name: string) => void,
    onCreateCategory: (name: string) => void
}



export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount)
        const amountInMillUnits = convertAmountToMillUnits(amount);

        onSubmit({
            date: values.date,
            accountId: values.accountId,
            categoryId: values.categoryId || null,
            payee: values.payee,
            amount: amountInMillUnits,
            notes: values.notes || null,
        });
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                <FormField 
                    name="date"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker 
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="accountId"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Account
                            </FormLabel>
                            <FormControl>
                                <Select 
                                    placeholder="Select an account"
                                    options={accountOptions}
                                    onCreate={onCreateAccount}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="categoryId"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                            <FormControl>
                                <Select 
                                    placeholder="Select a category"
                                    options={categoryOptions}
                                    onCreate={onCreateCategory}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="payee"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Payee
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    disabled={disabled}
                                    placeholder="Add a payee"
                                    {...field}
                                />                                
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="amount"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Amount
                            </FormLabel>
                            <FormControl>
                                <AmoutInput 
                                    {...field}
                                    disabled={disabled}
                                    placeholder="0.00"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="notes"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Notes
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="Optional notes"
                                    disabled={disabled}
                                />                                
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button
                    className="w-full"
                    disabled={disabled}
                >
                    {id ? "Save changes" : "Create transaction"}
                </Button>
                {!!id && <Button
                    type="button"
                    className="w-full items-center"
                    disabled={disabled}
                    variant="destructive"
                    onClick={handleDelete}
                >
                    <Trash2Icon className="size-4 mr-2"/>
                    Delete transaction
                </Button>}
            </form>
        </Form>
    )
}