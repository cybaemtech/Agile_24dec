import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InactivateIcon, ActivateIcon, InactiveIcon } from "./user-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiRequest } from "@/lib/api-config";
import { queryClient } from "@/lib/queryClient";

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  email: string;
  fullName: string;
  username: string;
  isActive: boolean;
  role: string;
  avatarUrl: string | null;
}

export const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [inactivatingUserId, setInactivatingUserId] = useState<number | null>(null);

  const { data: users = [], refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ['/users'],
    enabled: isOpen,
    queryFn: async () => {
      try {
        return await apiGet('/users');
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
  });

  const inactivateMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest('PATCH', `/users/${userId}`, { isActive: false });
    },
    onSuccess: () => {
      refetchUsers();
      queryClient.invalidateQueries({ queryKey: ['/users'] });
      queryClient.invalidateQueries({ queryKey: ['/users/all'] });
      setInactivatingUserId(null);
      toast({
        title: "Success",
        description: "User inactivated successfully",
      });
    },
    onError: (error: any) => {
      setInactivatingUserId(null);
      toast({
        title: "Error",
        description: error.message || "Failed to inactivate user",
        variant: "destructive",
      });
    },
  });

  const handleInactivateUser = (userId: number) => {
    setInactivatingUserId(userId);
    inactivateMutation.mutate(userId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Team - All Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-neutral-600 mb-4">
            All users in the system. You can inactivate a user to deny their access to all projects.
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback>
                      {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                {user.isActive ? (
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={inactivatingUserId === user.id}
                    onClick={() => handleInactivateUser(user.id)}
                    title="Inactivate user"
                  >
                    <InactivateIcon />
                  </Button>
                ) : (
                  <span title="Inactive user">
                    <InactiveIcon />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
