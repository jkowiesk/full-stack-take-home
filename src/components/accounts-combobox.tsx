"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { UserAccount } from "@prisma/client";

type Props = {
  accounts: UserAccount[];
  onAccountSelect: (accountId: string) => void;
  selectedAccountId?: string;
};

export default function AccountsCombobox({
  accounts,
  onAccountSelect,
  selectedAccountId,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedAccountId ?? "");

  // Get the selected account name for display
  const selectedAccountName = React.useMemo(() => {
    if (!value) return null;
    return accounts.find((account) => account.id === value)?.name;
  }, [value, accounts]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedAccountName ?? "Select account..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search accounts..." className="h-9" />
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.id}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    onAccountSelect(newValue ?? "");
                    setOpen(false);
                  }}
                >
                  {account.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === account.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
