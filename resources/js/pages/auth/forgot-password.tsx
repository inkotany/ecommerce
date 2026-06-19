import { Form, Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import Logo from '@/components/logo';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Logo />
                    <h1 className="text-2xl font-bold">Forgot your password?</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {status && (
                    <div
                        role="alert"
                        className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center text-sm font-medium text-green-700 dark:text-green-400"
                    >
                        {status}
                    </div>
                )}

                <Card>
                    <CardContent className="pt-6">
                        <Form {...email.form()}>
                            {({ processing, errors }) => (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? 'Sending...' : 'Email password reset link'}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <TextLink href={login()} className="underline underline-offset-4">
                        Sign in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}