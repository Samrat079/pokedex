'use client'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js';
import { useParams } from 'next/navigation'
import { LuSend } from "react-icons/lu";
import React, { useEffect, useState } from 'react'

interface Message {
    id: number;
    conversation_id: number;
    sender_id: string;
    body: string;
}

const Page = () => {
    const supabase = createClient()
    const params = useParams();
    const { id } = params;
    const [messages, setMessages] = useState<Message[]>([])
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        fetchUser();
    }, [supabase.auth]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('Messages')
                .select('*')
                .eq('conversation_id', Number(id))
                .order('created_at', { ascending: true })

            if (error) {
                console.log('error:', error)
            } else {
                // console.log('data is: ', data)
                setMessages(data || [])
            }
        }
        fetchMessages()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const text = formData.get('msg') as string;
        console.log('Message to send:', text);

        if (!text) return;

        const { data, error } = await supabase
            .from('Messages') // make sure table name is lowercase
            .insert({
                conversation_id: Number(id), // convert to number if needed
                sender_id: user!.id,
                body: text, // correct column name
            })
            .select()
            .single(); // get the inserted row

        if (error) {
            console.error('Error sending message:', error);
        } else {
            // console.log('Message sent:', data);
            setMessages((prev) => [...prev, data]); // optional: update local state immediately
        }
        form.reset();
    };


    return (
        <div className="w-full flex flex-col items-center h-screen">
            {/* Messages container */}
            <div className="flex-1 w-full overflow-y-auto pt-4 px-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`w-fit max-w-md px-4 py-2 rounded-2xl text-white mb-2 ${msg.sender_id === user?.id
                            ? "ml-auto bg-blue-400/80 text-right"
                            : "mr-auto bg-gray-800 text-left"}`}
                    >
                        <p className="break-words">{msg.body}</p>
                    </div>
                ))}
            </div>

            {/* Input form */}
            <form
                onSubmit={handleSubmit}
                className="w-full md:mb-8 flex items-center max-w-2xl">
                <input
                    name="msg"
                    id="msg"
                    className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-400/80 rounded-full"
                >
                    <LuSend size={28} />
                </button>
            </form>
        </div>
    )
}

export default Page