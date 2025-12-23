import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Loader2 } from 'lucide-react';
import { CompanyWithBranding, CompanyFormData } from '@/hooks/useCompanies';

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyWithBranding | null;
  onSave: (formData: CompanyFormData) => Promise<void>;
  onUploadLogo: (file: File) => Promise<string>;
  isSaving: boolean;
  isUploading: boolean;
}

const defaultFormData: CompanyFormData = {
  name: '',
  slug: '',
  contact_email: '',
  contact_phone: '',
  is_active: true,
  branding: {
    logo_url: null,
    primary_color: '#3B82F6',
    accent_color: '#10B981',
    cta_color: '#8B5CF6',
    dark_mode: false,
    font_family: null,
  },
};

const fontOptions = [
  { value: '', label: 'Default (System)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Lato', label: 'Lato' },
];

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
  onSave,
  onUploadLogo,
  isSaving,
  isUploading,
}: CompanyFormDialogProps) {
  const [formData, setFormData] = useState<CompanyFormData>(defaultFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        slug: company.slug,
        contact_email: company.contact_email || '',
        contact_phone: company.contact_phone || '',
        is_active: company.is_active,
        branding: {
          logo_url: company.branding?.logo_url || null,
          primary_color: company.branding?.primary_color || '#3B82F6',
          accent_color: company.branding?.accent_color || '#10B981',
          cta_color: company.branding?.cta_color || '#8B5CF6',
          dark_mode: company.branding?.dark_mode || false,
          font_family: company.branding?.font_family || null,
        },
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [company, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !company ? generateSlug(name) : prev.slug,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await onUploadLogo(file);
      setFormData((prev) => ({
        ...prev,
        branding: { ...prev.branding, logo_url: url },
      }));
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onOpenChange(false);
  };

  const isEditing = !!company;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Company' : 'Create Company'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update company details and branding configuration.'
                : 'Set up a new company with custom branding for their pricing page.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Acme Insurance"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/p/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      placeholder="acme-insurance"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be the URL path for their pricing page
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contact_email: e.target.value }))
                      }
                      placeholder="contact@acme.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="is_active">Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Inactive companies won't have public pricing pages
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {/* Logo Upload */}
                <div className="grid gap-2">
                  <Label>Company Logo</Label>
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      {formData.branding.logo_url ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={formData.branding.logo_url}
                            alt="Logo preview"
                            className="h-16 w-16 rounded object-contain bg-muted"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Logo uploaded</p>
                            <p className="text-xs text-muted-foreground">
                              Click remove to upload a different logo
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                branding: { ...prev.branding, logo_url: null },
                              }))
                            }
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {isUploading ? (
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            {isUploading ? 'Uploading...' : 'Click to upload logo'}
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={isUploading}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="primary_color"
                        value={formData.branding.primary_color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, primary_color: e.target.value },
                          }))
                        }
                        className="h-10 w-14 rounded border cursor-pointer"
                      />
                      <Input
                        value={formData.branding.primary_color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, primary_color: e.target.value },
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="accent_color"
                        value={formData.branding.accent_color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, accent_color: e.target.value },
                          }))
                        }
                        className="h-10 w-14 rounded border cursor-pointer"
                      />
                      <Input
                        value={formData.branding.accent_color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, accent_color: e.target.value },
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cta_color">CTA Button Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="cta_color"
                        value={formData.branding.cta_color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, cta_color: e.target.value },
                          }))
                        }
                        className="h-10 w-14 rounded border cursor-pointer"
                      />
                      <Input
                        value={formData.branding.cta_color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, cta_color: e.target.value },
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Family */}
                <div className="grid gap-2">
                  <Label htmlFor="font_family">Font Family</Label>
                  <select
                    id="font_family"
                    value={formData.branding.font_family || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, font_family: e.target.value || null },
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="dark_mode">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable dark theme for the pricing page
                    </p>
                  </div>
                  <Switch
                    id="dark_mode"
                    checked={formData.branding.dark_mode}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, dark_mode: checked },
                      }))
                    }
                  />
                </div>

                {/* Preview */}
                <div className="grid gap-2">
                  <Label>Preview</Label>
                  <Card
                    className="overflow-hidden"
                    style={{
                      backgroundColor: formData.branding.dark_mode ? '#1a1a2e' : '#ffffff',
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        {formData.branding.logo_url ? (
                          <img
                            src={formData.branding.logo_url}
                            alt="Preview"
                            className="h-8 w-8 rounded object-contain"
                          />
                        ) : (
                          <div
                            className="h-8 w-8 rounded flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: formData.branding.primary_color }}
                          >
                            {formData.name.charAt(0) || 'A'}
                          </div>
                        )}
                        <span
                          className="font-semibold"
                          style={{
                            color: formData.branding.dark_mode ? '#ffffff' : '#000000',
                            fontFamily: formData.branding.font_family || 'inherit',
                          }}
                        >
                          {formData.name || 'Company Name'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 rounded text-sm font-medium text-white"
                          style={{ backgroundColor: formData.branding.primary_color }}
                        >
                          Primary
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded text-sm font-medium text-white"
                          style={{ backgroundColor: formData.branding.accent_color }}
                        >
                          Accent
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded text-sm font-medium text-white"
                          style={{ backgroundColor: formData.branding.cta_color }}
                        >
                          CTA
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !formData.name || !formData.slug}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? (
                'Update Company'
              ) : (
                'Create Company'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
