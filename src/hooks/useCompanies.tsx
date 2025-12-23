import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Company {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandingConfig {
  id: string;
  company_id: string;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  cta_color: string;
  dark_mode: boolean;
  font_family: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyWithBranding extends Company {
  branding?: BrandingConfig | null;
}

export interface CompanyFormData {
  name: string;
  slug: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
  branding: {
    logo_url: string | null;
    primary_color: string;
    accent_color: string;
    cta_color: string;
    dark_mode: boolean;
    font_family: string | null;
  };
}

export function useCompanies() {
  const queryClient = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<CompanyWithBranding[]> => {
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (companiesError) throw companiesError;

      const { data: brandingConfigs, error: brandingError } = await supabase
        .from('branding_configs')
        .select('*');

      if (brandingError) throw brandingError;

      return companies.map((company) => ({
        ...company,
        branding: brandingConfigs?.find((b) => b.company_id === company.id) || null,
      }));
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (formData: CompanyFormData) => {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          slug: formData.slug,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          is_active: formData.is_active,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      const { error: brandingError } = await supabase.from('branding_configs').insert({
        company_id: company.id,
        logo_url: formData.branding.logo_url,
        primary_color: formData.branding.primary_color,
        accent_color: formData.branding.accent_color,
        cta_color: formData.branding.cta_color,
        dark_mode: formData.branding.dark_mode,
        font_family: formData.branding.font_family,
      });

      if (brandingError) throw brandingError;

      return company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create company: ${error.message}`);
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: CompanyFormData }) => {
      const { error: companyError } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          slug: formData.slug,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          is_active: formData.is_active,
        })
        .eq('id', id);

      if (companyError) throw companyError;

      const { data: existingBranding } = await supabase
        .from('branding_configs')
        .select('id')
        .eq('company_id', id)
        .single();

      if (existingBranding) {
        const { error: brandingError } = await supabase
          .from('branding_configs')
          .update({
            logo_url: formData.branding.logo_url,
            primary_color: formData.branding.primary_color,
            accent_color: formData.branding.accent_color,
            cta_color: formData.branding.cta_color,
            dark_mode: formData.branding.dark_mode,
            font_family: formData.branding.font_family,
          })
          .eq('company_id', id);

        if (brandingError) throw brandingError;
      } else {
        const { error: brandingError } = await supabase.from('branding_configs').insert({
          company_id: id,
          logo_url: formData.branding.logo_url,
          primary_color: formData.branding.primary_color,
          accent_color: formData.branding.accent_color,
          cta_color: formData.branding.cta_color,
          dark_mode: formData.branding.dark_mode,
          font_family: formData.branding.font_family,
        });

        if (brandingError) throw brandingError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update company: ${error.message}`);
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete branding config first (if exists)
      await supabase.from('branding_configs').delete().eq('company_id', id);

      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete company: ${error.message}`);
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('company-logos').getPublicUrl(fileName);
      return data.publicUrl;
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload logo: ${error.message}`);
    },
  });

  return {
    companies: companiesQuery.data ?? [],
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
    createCompany: createCompanyMutation.mutateAsync,
    updateCompany: updateCompanyMutation.mutateAsync,
    deleteCompany: deleteCompanyMutation.mutateAsync,
    uploadLogo: uploadLogoMutation.mutateAsync,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending,
    isUploading: uploadLogoMutation.isPending,
  };
}
