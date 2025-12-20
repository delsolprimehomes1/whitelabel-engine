import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function Companies() {
  return (
    <AdminLayout title="Companies & Pages" description="Manage your white-label pricing pages">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Companies
          </CardTitle>
          <CardDescription>
            Create and manage companies with their unique pricing pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Company management will be implemented in Phase 2
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
