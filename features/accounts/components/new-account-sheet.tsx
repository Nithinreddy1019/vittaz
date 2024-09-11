

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountForm } from "./account-form";
import { AccountsSchema } from "@/prisma/zod";
import * as z from "zod";
import { useCreateAccount } from "../api/use-create-account";


const formSchema = AccountsSchema.pick({
    name: true
});
type FormValues = z.infer<typeof formSchema>;


export const NewAccountSheet = () => {

    const { isOpen, onClose } = useNewAccount();
    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm 
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                />
            </SheetContent>
        </Sheet>
    )
}