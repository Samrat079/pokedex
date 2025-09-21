'use client'
import { createClient } from '@/lib/supabase/client';
import React, { FormEvent, useState } from 'react'

const Login = () => {
    const [status, setStatus] = useState({
        emoji: '',
        text: ''
    })

    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const emailId = formData.get('email') as string;
        setStatus({ emoji: '🚀', text: 'Please wait' })

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email: emailId,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: `${window.location.origin}`
            }
        })

        console.log(window.location.origin);

        setStatus( error
            ? { emoji: '❌', text: `error: ${error}`}
            : { emoji: '✅', text: 'Please check your email for magic link' }
        )

        if(!error) form.reset();
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <form
                onSubmit={submitHandler}
                className='rounded shadow-md shadow-white border p-6 w-full max-w-80 grid gap-4'>
                <p className='text-lg'>Login or SignUp</p>
                <div>
                    <p className='text-sm'>Email</p>
                    <input
                        type='email'
                        name='email'
                        alt='add email id'
                        placeholder='example@example.com'
                        className='bg-black focus:outline-none'
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