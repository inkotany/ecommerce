import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useForm, router } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Shield, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
    {
        value: 'customer',
        label: 'Shopper',
        description: 'Browse and buy products from our marketplace',
        icon: ShoppingBag,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
        value: 'seller',
        label: 'Seller',
        description: 'Sell your products and grow your business',
        icon: Store,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
        value: 'admin',
        label: 'Admin',
        description: 'Manage the platform and oversee operations',
        icon: Shield,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
];

export default function Register() {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<string>('customer');
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        setData('role', selectedRole);
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('role', selectedRole);
        post('/register', {
            onSuccess: () => {
                router.visit('/dashboard');
            },
            onError: (err) => {
                console.error('Registration errors:', err);
            },
        });
    };

    const handleBack = () => {
        setStep(1);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <AuthLayout>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Logo />
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-1.5 w-16 rounded-full transition-colors duration-300',
                                step >= i ? 'bg-primary' : 'bg-muted'
                            )}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait" custom={step}>
                    <motion.div
                        key={step}
                        custom={step}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold">Join Shamie</h1>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        How do you want to use the platform?
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => handleRoleSelect(role.value)}
                                            className={cn(
                                                'flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200',
                                                selectedRole === role.value
                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                    : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                                            )}
                                        >
                                            <div className={cn(
                                                'flex h-12 w-12 items-center justify-center rounded-xl',
                                                role.bgColor
                                            )}>
                                                <role.icon className={cn('h-6 w-6', role.color)} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">{role.label}</div>
                                                <div className="mt-0.5 text-sm text-muted-foreground">
                                                    {role.description}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                                                selectedRole === role.value
                                                    ? 'border-primary bg-primary'
                                                    : 'border-muted-foreground/30'
                                            )}>
                                                {selectedRole === role.value && (
                                                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleContinue}
                                    className="w-full"
                                    size="lg"
                                >
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-6">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>
                                            <div>
                                                <h2 className="text-lg font-semibold">
                                                    {roles.find(r => r.value === selectedRole)?.label} Account
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Create your account details
                                                </p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    required
                                                    autoFocus
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-500">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-500">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password">Password</Label>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                />
                                                {errors.password && (
                                                    <p className="text-sm text-red-500">{errors.password}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    type="password"
                                                    required
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                />
                                                {errors.password_confirmation && (
                                                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                                )}
                                            </div>

                                            <input type="hidden" name="role" value={selectedRole} />
                                            <input type="hidden" name="role" value={data.role} />

                                            <Button
                                                type="submit"
                                                className="w-full mt-6"
                                                disabled={processing}
                                            >
                                                {processing ? 'Creating account...' : 'Create account'}
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="underline underline-offset-4 text-primary">
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}