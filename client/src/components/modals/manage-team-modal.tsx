import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onInactivateUser: (userId: number) => void;
  inactivatingUserId?: number | null;
}

export const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
  users,
  onInactivateUser,
  inactivatingUserId,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-neutral-600 mb-2">
            All users in the system. You can inactivate a user to deny their access to all projects.
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-xs text-gray-400">{user.fullName}</div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={inactivatingUserId === user.id || !user.isActive}
                  onClick={() => onInactivateUser(user.id)}
                >
                  {!user.isActive ? 'Inactive' : inactivatingUserId === user.id ? 'Inactivating...' : 'Inactivate'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
