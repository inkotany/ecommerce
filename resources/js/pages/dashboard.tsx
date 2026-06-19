import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard() {
    useEffect(() => {
        router.visit('/');
    }, []);
    return null;
}