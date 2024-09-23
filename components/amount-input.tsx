
import CurrencyInput from "react-currency-input-field";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { InfoIcon, MinusCircleIcon, PlusCircleIcon } from "lucide-react";



type Props = {
    value: string,
    onChange: (value: string | undefined) => void,
    placeholder?: string,
    disabled?: boolean
};

export const AmoutInput = ({
    value,
    onChange,
    placeholder,
    disabled
}: Props) => {

    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    const onReverseValue = () => {
        if(!value) return;

        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    };

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onReverseValue}
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 absolute top-1 left-1 rounded-md p-2 flex items-center justify-center transition", isIncome && "bg-emerald-500 hover:bg-emerald-600", isExpense && "bg-rose-600 hover:bg-rose-600"
                            )}
                        >
                            {!parsedValue && (<InfoIcon className="size-3 text-white"/>)}
                            {isIncome && (<PlusCircleIcon className="size-3 text-white"/>)}
                            {isExpense && (<MinusCircleIcon className="size-3 text-white"/>)}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* change currency to rupee */}
            <CurrencyInput 
                prefix="$"
                className="pl-10 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
            />
            <p className="text-xs text-muted-foreground mt-2">
                {isIncome && "This will count as an income"}
                {isExpense && "This will count as an expense"}
            </p>
        </div>
    )
}