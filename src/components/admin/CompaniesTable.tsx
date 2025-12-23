import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Copy, LayoutList } from 'lucide-react';
import { CompanyWithBranding } from '@/hooks/useCompanies';
import { PageLeadsDialog } from './PageLeadsDialog';
import { toast } from 'sonner';

interface CompaniesTableProps {
  companies: CompanyWithBranding[];
  onEdit: (company: CompanyWithBranding) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function CompaniesTable({ companies, onEdit, onDelete, isDeleting }: CompaniesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pageLeadsCompany, setPageLeadsCompany] = useState<CompanyWithBranding | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const copySlugUrl = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Branding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No companies yet. Create your first company to get started.
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {company.branding?.logo_url ? (
                        <img
                          src={company.branding.logo_url}
                          alt={company.name}
                          className="h-8 w-8 rounded object-contain bg-muted"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">/p/{company.slug}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copySlugUrl(company.slug)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {company.contact_email && <div>{company.contact_email}</div>}
                      {company.contact_phone && (
                        <div className="text-muted-foreground">{company.contact_phone}</div>
                      )}
                      {!company.contact_email && !company.contact_phone && (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {company.branding && (
                        <>
                          <div
                            className="h-5 w-5 rounded border"
                            style={{ backgroundColor: company.branding.primary_color }}
                            title="Primary"
                          />
                          <div
                            className="h-5 w-5 rounded border"
                            style={{ backgroundColor: company.branding.accent_color }}
                            title="Accent"
                          />
                          <div
                            className="h-5 w-5 rounded border"
                            style={{ backgroundColor: company.branding.cta_color }}
                            title="CTA"
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.is_active ? 'default' : 'secondary'}>
                      {company.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(`/p/${company.slug}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Page
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(company)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPageLeadsCompany(company)}>
                          <LayoutList className="h-4 w-4 mr-2" />
                          Manage Products
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(company.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this company? This will also delete all associated
              branding and page configurations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageLeadsDialog
        company={pageLeadsCompany}
        open={!!pageLeadsCompany}
        onOpenChange={(open) => !open && setPageLeadsCompany(null)}
      />
    </>
  );
}
