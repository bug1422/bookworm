import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

const QuantityButton = ({ quantity = 0, className = "", onIncrease, onDecrease, onChange }) => {
  return (
    <div className={cn("select-none flex items-center justify-between bg-gray-200 w-fit", className)}>
      <MinusIcon onClick={() => {
        onDecrease()
      }} className="cursor-pointer hover:bg-gray-800 w-10 h-10"/>
      <div className="mx-4 text-xl">{quantity}</div>
      <PlusIcon onClick={() => {
        onIncrease()
      }} className="cursor-pointer hover:bg-gray-800 w-10 h-10"/>
    </div>
  );
};

export default QuantityButton