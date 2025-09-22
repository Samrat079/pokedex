'use client'
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || '';
    const [status, setStatus] = useState({ emoji: '📬', text: 'Check your email for OTP' })

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        setStatus({ emoji: '⏳', text: 'Please wait...' })
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const otp = formData.get('otp') as string;

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email',
        })

        if (!error) {
            router.push(`/`);
            return;
        }
        setStatus({emoji:'❌', text: `error: ${error.message}`})
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <form
                onSubmit={submitHandler}
                className='rounded shadow-md shadow-white border p-6 w-full max-w-80 grid gap-4'>
                <p className='text-lg'>Enter OTP</p>
                <div>
                    <p className='text-sm'>OTP</p>
                    <input
                        type='number'
                        name='otp'
                        alt='verify otp'
                        placeholder='345678'
                        className='bg-transparent focus:outline-none'
                    />
                </div>
                <div className='grid gap-3'>
                    <p>
                        <span>{status.emoji} </span>
                        <span className='text-sm italic'> {status.text}</span>
                    </p>
                    <button
                        type='submit'
                        className='bg-blue-600/80 rounded'>
                        Verify
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Page