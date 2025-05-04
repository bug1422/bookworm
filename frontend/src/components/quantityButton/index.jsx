import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

const QuantityButton = ({
  quantity = 0,
  className = "",
  onIncrease,
  onDecrease,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "select-none flex items-center justify-between bg-indigo-100 px-2 py-1 rounded w-full",
        className
      )}
    >
      <MinusIcon
        onClick={onDecrease}
        className="cursor-pointer hover:bg-indigo-800 w-8 h-8 sm:w-6 sm:h-6 rounded"
      />
      <div className="mx-2 text-lg sm:text-base">{quantity}</div>
      <PlusIcon
        onClick={onIncrease}
        className="cursor-pointer hover:bg-indigo-800 w-8 h-8 sm:w-6 sm:h-6 rounded"
      />
    </div>
  );
};

export default QuantityButton;
