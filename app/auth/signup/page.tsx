'use client'
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
    const router = useRouter();
    const supabase = createClient();
    const [status, setStatus] = useState({ emoji: '', text: '' });

    const signUpWithPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        setStatus({ emoji: '⏳', text: 'Please wait...' })
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const userName = formData.get('username') as string;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    userName,
                }
            }
        })

        if (!error) {
            router.push(`/`);
            return;
        }
        setStatus({ emoji: '❌', text: `error: ${error!.message}` });
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <form
                onSubmit={signUpWithPassword}
                className='rounded shadow-md shadow-white border p-6 w-full max-w-80 grid gap-4'>
                <p className='text-lg'>SignUp with password</p>
                <div>
                    <p className='text-sm'>Email</p>
                    <input
                        type='email'
                        name='email'
                        alt='add email id'
                        placeholder='example@example.com'
                        className='bg-transparent focus:outline-none w-full'
                    />
                    <p className='text-sm'>Username</p>
                    <input
                        type='text'
                        name='username'
                        alt='add username'
                        placeholder='AnyStrike'
                        className='bg-transparent focus:outline-none w-full'
                    />
                    <p className='text-sm pt-2'>Password</p>
                    <input
                        type='password'
                        name='password'
                        alt='add password'
                        placeholder='Enter your password'
                        className='bg-transparent focus:outline-none w-full'
                    />
                </div>
                <div className='grid gap-3'>
                    <p>
                        <span>{status.emoji} </span>
                        <span className='text-sm italic'> {status.text}</span>
                    </p>
                    <button
                        type='submit'
                        className='bg-blue-600/80 rounded-md'>
                        Login
                    </button>
                    <p className='text-sm text-white/60 italic'>
                        Already a member?{' '}
                        <Link href={'/auth/singin'} className='text-blue-500 underline'>
                            SignIn
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Page