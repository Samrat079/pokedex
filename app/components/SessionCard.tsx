import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const SessionCard = () => {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => sub.subscription.unsubscribe();
    }, [supabase]);

    return (
        <Link
            href={'/profile'}
            className='py-4 px-6 flex flex-row gap-2 justify-center items-center bg-black/20'
        >
            <Image
                src='https://avatar.iran.liara.run/public'
                alt='Profile picture'
                width={52}
                height={52}
            />
            
            <p className='text-gray-400/50 italic text-sm line-clamp-2'>
                {user ? 'Logged in as: ' + user.email : 'Welcome Guest'}
            </p>
        </Link>
    )
}

export default SessionCard