

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
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { LoaderIcon } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";


const formSchema = AccountsSchema.pick({
    name: true
});
type FormValues = z.infer<typeof formSchema>;


export const EditAccountSheet = () => {

    const { isOpen, onClose, id } = useOpenAccount();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this."
    )

    const accountQuery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);

    const isLoading = accountQuery.isLoading;
    const isPending = editMutation.isPending || deleteMutation.isPending;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : { 
        name: "" 
    }

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
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
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}