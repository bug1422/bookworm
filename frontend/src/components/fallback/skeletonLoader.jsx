import { cn } from "@/lib/utils";

const convertToStyle = (value) =>{
  if (value.includes("/")) {
    const [num, denom] = value.split("/").map(Number);
    if (!isNaN(num) && !isNaN(denom)) {
      return `${(num / denom) * 100}%`
    }
  } else if (value.includes("%")) {
    return value
  } else if (!isNaN(parseInt(value))) {
    return `${parseInt(value) / 4}rem`
  } else {
    return value
  }
}

const SkeletonLoader = ({ width = "12", height = "4", className = "" }) => {
  const getStyle = () => {
    let style = {};
    style = {
      "width": convertToStyle(width), 
      "height": convertToStyle(height), 
    }
    return style;
  };
  return (
    <div
      style={getStyle()}
      className={cn(`animate-pulse bg-gray-300 rounded-md`, className)}
    ></div>
  );
};

export default SkeletonLoader;
