import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, ArrowLeft, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminContactShow() {
    const { message } = usePage<{ message: any }>().props;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Contact Messages', href: '/admin/contacts' },
            { title: 'View Message', href: `/admin/contacts/${message.id}` },
        ]}>
            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <Link href="/admin/contacts">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to messages
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-full',
                                        message.is_read ? 'bg-muted' : 'bg-primary/10'
                                    )}>
                                        <Mail className={cn(
                                            'h-6 w-6',
                                            message.is_read ? 'text-muted-foreground' : 'text-primary'
                                        )} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{message.subject}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            {message.is_read ? (
                                                <Badge variant="secondary" className="text-xs">Read</Badge>
                                            ) : (
                                                <Badge variant="default" className="text-xs">Unread</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="whitespace-pre-wrap">{message.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Sender Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{message.name}</div>
                                        <a 
                                            href={`mailto:${message.email}`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {message.email}
                                        </a>
                                    </div>
                                </div>

                                {message.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Phone</div>
                                            <a 
                                                href={`tel:${message.phone}`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {message.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Sent</div>
                                        <div>{formatDate(message.created_at)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Time</div>
                                        <div>{formatTime(message.created_at)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Reply via Email
                            </Button>
                            <Button 
                                variant="destructive"
                                className="w-full"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this message?')) {
                                        router.delete(`/admin/contacts/${message.id}`, {
                                            onSuccess: () => router.visit('/admin/contacts')
                                        });
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Message
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}