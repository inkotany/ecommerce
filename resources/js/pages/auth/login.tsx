import { useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import Logo from '@/components/logo';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Link } from '@inertiajs/react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Logo />
                    <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue
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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink href="/forgot-password" className="text-sm">
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', !!checked)}
                                    />
                                    <span className="text-sm">Remember me</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                                aria-busy={processing}
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/register" className="underline underline-offset-4 text-primary">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}