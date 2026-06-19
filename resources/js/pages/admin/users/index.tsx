import { usePage, router, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { router as inertiaRouter } from '@inertiajs/react';

const roleColors: Record<string, string> = {
    admin: 'bg-red-500',
    seller: 'bg-blue-500',
    customer: 'bg-green-500',
};

export default function AdminUsersIndex() {
    const { users, filters } = usePage<{ users: { data: any[] }; filters: any }>().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: roleFilter });
    };

    const handleRoleFilter = (role: string) => {
        setRoleFilter(role);
        router.get('/admin/users', { search, role: role || undefined });
    };

    const deleteUser = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            inertiaRouter.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Users</h2>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <Input
                                type="search"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button type="submit" variant="secondary">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                            <Select value={roleFilter} onValueChange={handleRoleFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="seller">Seller</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={roleColors[user.role] || 'bg-gray-500', 'text-white'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/users/${user.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {users.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No users found</p>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}