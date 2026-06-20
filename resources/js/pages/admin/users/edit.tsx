import { usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminUsersEdit() {
    const { user } = usePage<{ user: any }>().props;

    const { data, setData, put, processing } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-2xl">
                <Link href="/admin/users" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Users
                </Link>

                <h2 className="text-2xl font-bold">Edit User</h2>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Name *</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Role *</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="seller">Seller</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Link href="/admin/users">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}