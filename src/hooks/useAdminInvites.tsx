import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminInvite {
  id: string;
  email: string;
  invited_by: string | null;
  created_at: string;
  used_at: string | null;
  is_used: boolean;
}

interface CurrentAdmin {
  user_id: string;
  email: string;
  created_at: string;
}

export function useAdminInvites() {
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [currentAdmins, setCurrentAdmins] = useState<CurrentAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchInvites = useCallback(async () => {
    const { data, error } = await supabase
      .from('admin_invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invites:', error);
      return;
    }

    setInvites(data || []);
  }, []);

  const fetchCurrentAdmins = useCallback(async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id, created_at')
      .eq('role', 'admin');

    if (error) {
      console.error('Error fetching admins:', error);
      return;
    }

    // We can't directly query auth.users, but we can show user_ids
    // In a real app, you'd have a profiles table to get emails
    const admins: CurrentAdmin[] = (data || []).map(role => ({
      user_id: role.user_id,
      email: '', // Would come from profiles table
      created_at: role.created_at
    }));

    setCurrentAdmins(admins);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchInvites(), fetchCurrentAdmins()]);
    setIsLoading(false);
  }, [fetchInvites, fetchCurrentAdmins]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addInvite = async (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return false;
    }

    setIsAdding(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('admin_invites')
      .insert({
        email: trimmedEmail,
        invited_by: user?.id || null
      });

    setIsAdding(false);

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already invited',
          description: 'This email has already been invited',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add invite',
          variant: 'destructive'
        });
      }
      return false;
    }

    toast({
      title: 'Invite added',
      description: `${trimmedEmail} will receive admin access upon signup`
    });

    await fetchInvites();
    return true;
  };

  const removeInvite = async (id: string) => {
    const { error } = await supabase
      .from('admin_invites')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove invite',
        variant: 'destructive'
      });
      return false;
    }

    toast({
      title: 'Invite removed',
      description: 'The admin invite has been removed'
    });

    await fetchInvites();
    return true;
  };

  const pendingInvites = invites.filter(i => !i.is_used);
  const usedInvites = invites.filter(i => i.is_used);

  return {
    invites,
    pendingInvites,
    usedInvites,
    currentAdmins,
    isLoading,
    isAdding,
    addInvite,
    removeInvite,
    refresh: loadData
  };
}
