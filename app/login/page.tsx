'use client'
import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const Login = () => {
    const router = useRouter();
    const [status, setStatus] = useState({
        emoji: '',
        text: ''
    })

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        setStatus({emoji:'⏳', text: 'Please wait...'})
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const emailId = formData.get('email') as string;

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email: emailId
        })

        if (!error) {
            router.push(`/login/verify?email=${encodeURIComponent(emailId)}`);
            return;
        }
        setStatus({emoji:'❌', text: `error: ${error!.message}`})
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <form
                onSubmit={handleLogin}
                className='rounded shadow-md shadow-white border p-6 w-full max-w-80 grid gap-4'>
                <p className='text-lg'>Login with OTP</p>
                <div>
                    <p className='text-sm'>Email</p>
                    <input
                        type='email'
                        name='email'
                        alt='add email id'
                        placeholder='example@example.com'
                        className='bg-transparent focus:outline-none'
                    />
                </div>
                <div className='grid gap-3'>
                    <p>
                        <span>{status.emoji}</span>
                        <span className='text-sm italic'> {status.text}</span>
                    </p>
                    <button
                        type='submit'
                        className='bg-blue-600/80 rounded'>
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login