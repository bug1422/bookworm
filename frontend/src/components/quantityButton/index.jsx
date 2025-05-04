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
        "select-none flex items-center justify-between bg-indigo-100 rounded w-fit gap-3",
        className
      )}
    >
      <MinusIcon
        onClick={onDecrease}
        size={35}
        className="cursor-pointer hover:bg-indigo-800 rounded"
      />
      <div className="mx-2 text-lg sm:text-base">{quantity}</div>
      <PlusIcon
        onClick={onIncrease}
        size={35}
        className="cursor-pointer hover:bg-indigo-800 rounded"
      />
    </div>
  );
};

export default QuantityButton;
