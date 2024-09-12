

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { AccountForm } from "./account-form";
import { AccountsSchema } from "@/prisma/zod";
import * as z from "zod";
import { useCreateAccount } from "../api/use-create-account";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { LoaderIcon } from "lucide-react";


const formSchema = AccountsSchema.pick({
    name: true
});
type FormValues = z.infer<typeof formSchema>;


export const EditAccountSheet = () => {

    const { isOpen, onClose, id } = useOpenAccount();

    const accountQuery = useGetAccount(id);
    const mutation = useCreateAccount();

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : { 
        name: "" 
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit your existing account.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoaderIcon className="size-4 animate-spin text-muted-foreground"/>
                    </div>
                ): (
                    <AccountForm 
                        id={id}
                        onSubmit={onSubmit}
                        disabled={mutation.isPending}
                        defaultValues={defaultValues}
                    />
                )}
            </SheetContent>
        </Sheet>
    )
}