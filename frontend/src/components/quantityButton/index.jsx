import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

const QuantityButton = ({ quantity = 0, className = "" }) => {
  return (
    <div className={cn("flex items-center justify-between bg-gray-200 w-fit", className)}>
      <MinusIcon className="hover:bg-gray-800 w-10 h-10"/>
      <div className="mx-4 text-xl">{quantity}</div>
      <PlusIcon className="hover:bg-gray-800 w-10 h-10"/>
    </div>
  );
};

export default QuantityButton