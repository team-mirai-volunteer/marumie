"use client";
import "client-only";
import { useState } from "react";
import { UserRole } from "@prisma/client";
import { Button, Input, Card } from "../ui";

interface User {
  id: string;
  authId: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface UserManagementProps {
  users: User[];
}

export default function UserManagement({
  users: initialUsers,
}: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, role: newRole, updatedAt: new Date() }
              : user,
          ),
        );
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating user role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);

    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      if (response.ok) {
        alert(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        // Refresh the user list to show pending invitations
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to send invitation: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Error sending invitation");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Invite User Form */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Invite New User</h2>
        <form onSubmit={handleInviteUser} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              disabled={isInviting}
              required
            />
          </div>
          <Button type="submit" disabled={isInviting || !inviteEmail.trim()}>
            {isInviting ? "Sending..." : "Send Invitation"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <table className="min-w-full divide-y divide-primary-border">
          <thead className="bg-primary-hover">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-muted uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-muted uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-muted uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-primary-panel divide-y divide-primary-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-900 text-red-200"
                        : "bg-green-900 text-green-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-muted">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as UserRole)
                    }
                    disabled={isLoading}
                    className="bg-primary-input text-white border border-primary-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-primary-muted">
            No users found
          </div>
        )}
      </Card>
    </div>
  );
}
