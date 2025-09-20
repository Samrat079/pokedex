'use client'
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.replace("/login"); // ✅ works here
        setLoading(false);
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className='bg-transparent w-full max-w-64 border-4 border-red-700 p-2 rounded'
        >
            Logout
        </button>
    );
}