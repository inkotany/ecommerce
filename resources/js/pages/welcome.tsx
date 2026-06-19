import { Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props;
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome</h1>
                {auth.user ? (
                    <Link href="/" className="text-primary underline">Go to Store</Link>
                ) : (
                    <div className="flex gap-4 justify-center mt-4">
                        <Link href="/login" className="text-primary underline">Login</Link>
                        <Link href="/register" className="text-primary underline">Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
}