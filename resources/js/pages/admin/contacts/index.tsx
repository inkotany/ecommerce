import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, Trash2, Search, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminContactsIndex() {
    const { messages } = usePage<{ messages: { data: any[]; links: any[] } }>().props;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Contact Messages', href: '/admin/contacts' }]}>
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Contact Messages</h1>
                        <p className="text-muted-foreground mt-1">
                            View and manage messages from your customers
                        </p>
                    </div>
                </div>

                {messages.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Inbox className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                            <p className="text-muted-foreground text-center">
                                Contact messages from customers will appear here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {messages.data.map((message: any) => (
                            <Card key={message.id} className={cn(
                                'transition-all',
                                !message.is_read && 'border-l-4 border-l-primary'
                            )}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-full',
                                                message.is_read ? 'bg-muted' : 'bg-primary/10'
                                            )}>
                                                <Mail className={cn(
                                                    'h-5 w-5',
                                                    message.is_read ? 'text-muted-foreground' : 'text-primary'
                                                )} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={cn(
                                                        'font-semibold',
                                                        !message.is_read && 'text-primary'
                                                    )}>
                                                        {message.name}
                                                    </h3>
                                                    {!message.is_read && (
                                                        <Badge variant="default" className="text-xs">New</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{message.email}</p>
                                                <p className="font-medium mt-2">{message.subject}</p>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {message.message}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                    <span>{formatDate(message.created_at)}</span>
                                                    {message.phone && <span>Phone: {message.phone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/contacts/${message.id}`}>
                                                <Button variant="ghost" size="icon" title="View message">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                title="Delete message"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this message?')) {
                                                        router.delete(`/admin/contacts/${message.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {messages.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {messages.links.map((link: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={cn(
                                                'px-4 py-2 rounded-md text-sm',
                                                link.active ? 'bg-primary text-primary-foreground' : 'bg-background border hover:bg-accent',
                                                !link.url && 'opacity-50 cursor-not-allowed'
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}