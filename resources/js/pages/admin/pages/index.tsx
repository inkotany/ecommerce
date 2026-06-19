import { usePage, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { router as inertiaRouter } from '@inertiajs/react';

export default function AdminPagesIndex() {
    const { pages } = usePage<{ pages: any[] }>().props;
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        title: '',
        slug: '',
        content: '',
        type: 'default',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/admin/pages/${editingId}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post('/admin/pages', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (page: any) => {
        setEditingId(page.id);
        setData({ title: page.title, slug: page.slug, content: page.content || '', type: page.type });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        reset();
    };

    const deletePage = (id: number) => {
        if (confirm('Are you sure you want to delete this page?')) {
            inertiaRouter.delete(`/admin/pages/${id}`);
        }
    };

    const types = [
        { value: 'default', label: 'Default' },
        { value: 'about', label: 'About' },
        { value: 'contact', label: 'Contact' },
        { value: 'terms', label: 'Terms' },
        { value: 'privacy', label: 'Privacy' },
        { value: 'faq', label: 'FAQ' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Pages</h2>
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Page
                    </Button>
                </div>

                {showForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit Page' : 'New Page'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Type</Label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            {types.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Slug</Label>
                                    <Input
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>
                                <div>
                                    <Label>Content</Label>
                                    <Textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={10}
                                        placeholder="Page content..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{page.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={page.is_active ? 'default' : 'outline'}>
                                            {page.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(page)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => deletePage(page.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {pages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No pages found</p>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}