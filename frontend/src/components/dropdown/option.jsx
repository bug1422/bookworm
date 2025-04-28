import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
const OptionDropdown = ({ options, selectedOption, onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-36 justify-between"
        >
          {selectedOption ? selectedOption[0] : ""}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            {options && (
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt[0]}
                    value={opt[0]}
                    onSelect={(curValue, v) => {
                      onSelect(curValue);
                      setOpen(false);
                    }}
                  >
                    {opt[1]}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OptionDropdown;
