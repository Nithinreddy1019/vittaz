

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { CategoryForm } from "./category-form";
import { CategoriesSchema } from "@/prisma/zod";
import * as z from "zod";
import { useCreateCategory } from "../api/use-create-category";
import { useNewCategory } from "../hooks/use-new-category";


const formSchema = CategoriesSchema.pick({
    name: true
});
type FormValues = z.infer<typeof formSchema>;


export const NewCategorySheet = () => {

    const { isOpen, onClose } = useNewCategory();
    const mutation = useCreateCategory();

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
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm 
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                />
            </SheetContent>
        </Sheet>
    )
}