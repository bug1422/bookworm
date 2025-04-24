import { cn } from "@/lib/utils";

const SkeletonLoader = ({width = "12", height = "4", className}) => {
  return <div className={cn(`animate-pulse h-${height} w-${width} bg-gray-300 rounded-md`, className)}></div>;
};

export default SkeletonLoader;
