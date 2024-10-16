"use client"

import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    error: [],
    meta: {}
};


const TransactionsPage = () => {

    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setimportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        console.log(results.data);
        setimportResults(results);
        setVariant(VARIANTS.IMPORT);

    };

    const onCancelImport = () => {
        setimportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }


    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions();

    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

    if(transactionsQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full flex items-center justify-center">
                            <LoaderIcon className="size-4 text-slate-300 animate-spin"/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    };


    if(variant === VARIANTS.IMPORT) {
        return (
            <>
                <ImportCard 
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={() => {}}
                />
            </>
        )
    }


    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transactions history
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            size="sm" 
                            onClick={newTransaction.onOpen}
                            className="w-full lg:w-auto"
                        >
                            <PlusIcon className="size-4 mr-2"/>
                            Add New
                        </Button>
                        <UploadButton onUpload={onUpload}/>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={transactions} 
                        filterKey="payee"
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteTransactions.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
 
export default TransactionsPage;