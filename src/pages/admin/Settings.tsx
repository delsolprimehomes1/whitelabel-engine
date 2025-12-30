import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, UserPlus, Trash2, Loader2, Mail, CheckCircle, Clock } from 'lucide-react';
import { useAdminInvites } from '@/hooks/useAdminInvites';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

export default function Settings() {
  const [newEmail, setNewEmail] = useState('');
  const { pendingInvites, usedInvites, currentAdmins, isLoading, isAdding, addInvite, removeInvite } = useAdminInvites();
  const { user } = useAuth();

  const handleAddInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addInvite(newEmail);
    if (success) {
      setNewEmail('');
    }
  };

  return (
    <AdminLayout title="Settings" description="Configure system settings">
      <div className="space-y-6">
        {/* Admin Access Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Admin Access Management
            </CardTitle>
            <CardDescription>
              Add email addresses to grant admin access when they sign up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add new invite form */}
            <form onSubmit={handleAddInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isAdding || !newEmail.trim()}>
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </>
                )}
              </Button>
            </form>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Pending Invites */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Pending Invites
                  </h3>
                  {pendingInvites.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No pending invites</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingInvites.map((invite) => (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{invite.email}</span>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              Added {format(new Date(invite.created_at), 'MMM d, yyyy')}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeInvite(invite.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Used Invites / Current Admins */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    Current Admins
                  </h3>
                  <div className="space-y-2">
                    {/* Show current user */}
                    {user && (
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.email}</span>
                          <Badge variant="default">You</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">Active</span>
                      </div>
                    )}
                    {/* Show admins who joined via invites */}
                    {usedInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{invite.email}</span>
                          <Badge variant="outline">Invited</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Joined {invite.used_at ? format(new Date(invite.used_at), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Other Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Other Settings
            </CardTitle>
            <CardDescription>
              Configure Stripe, storage, and other settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Additional settings will be implemented as needed
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
