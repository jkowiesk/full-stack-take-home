import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import SignOutBtn from "./signOutBtn";
import { CreditCard, GitBranch, MessageSquare, LogOut } from "lucide-react";

export function NavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="start">
        <DropdownMenuItem>
          <Link href="accounts" className="flex w-full items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage accounts
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="workflow" className="flex w-full items-center">
            <GitBranch className="mr-2 h-4 w-4" />
            Workflow
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="chat-ai" className="flex w-full items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            ChatAI
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
