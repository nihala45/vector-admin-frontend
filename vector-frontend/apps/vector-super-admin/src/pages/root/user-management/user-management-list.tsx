"use client";

import { CustomDataTable } from "../../../../components/common/data-table/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@repo/ui/components/button";
import { MoreHorizontal } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";

import { useState } from "react";
import { useAuthStore } from "../../../store/AuthStore";

import { useBlockOrUnblockUsers } from "../../../apis/users/Mutations";
import { useGetUsers } from "../../../apis/users/Queries";

// ---------- Types ----------
export type User = {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Blocked";
};

// ---------- Table Columns ----------
const UserTableColumns = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "User",
      cell: ({ row }) => {
        const { username } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{username}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "id",
      header: "User ID",
    },

    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },

    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-md text-sm font-medium ${
              status === "Active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },

    // ---- Actions ----
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const mutateBlock = useBlockOrUnblockUsers();
        const [open, setOpen] = useState(false);

        const handleToggleBlock = () => {
          mutateBlock.mutate(
            {
              id: user.id,
              isBlocked: user.status === "Active",
            },
            {
              onSuccess: () => setOpen(false),
            }
          );
        };

        return (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(user.id))}
              >
                Copy ID
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user.status === "Active" ? "Block User" : "Unblock User"}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {user.status === "Active"
                        ? "Block this user?"
                        : "Unblock this user?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.status === "Active"
                        ? "This user will lose access immediately."
                        : "This user will regain access immediately."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleToggleBlock}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {user.status === "Active" ? "Block" : "Unblock"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

// ---------- Main Component ----------
export default function UserManagementListing() {
  const { data:users } = useGetUsers();
  console.log("User Data:", users);

  // Correct Mapping Based on Your API
 const mappedData: User[] =
  users?.results?.map((u: any) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    phoneNumber: String(u.phone),
    status: u.is_active ? "Active" : "Blocked",
  })) ?? [];
  return (
    <div className="bg-white">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-600">
            Manage your users and their access status
          </p>
        </div>
      </div>

      <CustomDataTable
        columns={UserTableColumns()}
        data={mappedData}
        exportFileName="users.csv"
      />
    </div>
  );
}
