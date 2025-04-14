import BookCard from "@/component/card/book";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const FeaturedBookSection = () => {
  const [mode, setMode] = useState(0);

  return (
    <div className="flex flex-col gap-4 items-center w-full xl:my-16">
      <div className="xl:text-3xl">Featured Books</div>
      <div className="grid grid-cols-2">
        <Button
          variant={mode == 0 ? "primary" : "secondary"}
          onClick={() => {
            setMode(0);
          }}
        >
          Recommended
        </Button>
        <Button
          variant={mode == 1 ? "primary" : "secondary"}
          onClick={() => {
            setMode(1);
          }}
        >
          Popular
        </Button>
      </div>
      <div className="border-1 border-gray-200 p-6 px-50 w-full xl:gap-8 grid grid-cols-4">
        {Array(8).fill(0).map((v) => (
          <BookCard />
        ))}
      </div>
    </div>
  );
};

export default FeaturedBookSection;
