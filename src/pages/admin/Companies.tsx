import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Plus, AlertCircle } from 'lucide-react';
import { useCompanies, CompanyWithBranding, CompanyFormData } from '@/hooks/useCompanies';
import { CompaniesTable } from '@/components/admin/CompaniesTable';
import { CompanyFormDialog } from '@/components/admin/CompanyFormDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Companies() {
  const {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    uploadLogo,
    isCreating,
    isUpdating,
    isDeleting,
    isUploading,
  } = useCompanies();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyWithBranding | null>(null);

  const handleCreate = () => {
    setEditingCompany(null);
    setDialogOpen(true);
  };

  const handleEdit = (company: CompanyWithBranding) => {
    setEditingCompany(company);
    setDialogOpen(true);
  };

  const handleSave = async (formData: CompanyFormData) => {
    if (editingCompany) {
      await updateCompany({ id: editingCompany.id, formData });
    } else {
      await createCompany(formData);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCompany(id);
  };

  return (
    <AdminLayout title="Companies & Pages" description="Manage your white-label pricing pages">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Companies
            </CardTitle>
            <CardDescription>
              Create and manage companies with their unique pricing pages
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load companies: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <CompaniesTable
              companies={companies}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        </CardContent>
      </Card>

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editingCompany}
        onSave={handleSave}
        onUploadLogo={uploadLogo}
        isSaving={isCreating || isUpdating}
        isUploading={isUploading}
      />
    </AdminLayout>
  );
}
