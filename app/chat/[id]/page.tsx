'use client'
import LoadSpinner from '@/app/components/LoadSpinner';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const supabase = createClient();
    const params = useParams()
    const id = params.id
    const [chats, setChats] = useState(null)
    const [user, setUser] = useState(null)

    const [sellerID, buyerID] = id.split('_');


    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            // Check if room exists first
            const { data: existingRoom } = await supabase
                .from('ChatRooms')
                .select('id')
                .eq('id', id)
                .maybeSingle();

            if (!existingRoom) {
                const { error: insertError } = await supabase
                    .from('ChatRooms')
                    .insert({
                        id,
                        buyer_id: buyerID,
                        seller_id: sellerID,
                        messages: []
                    });
                if (insertError) console.error(insertError);
            }


            // Fetch existing messages
            const { data: chatroom, error } = await supabase
                .from('ChatRooms')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error) console.error(error);
            setChats(chatroom?.messages || []);
        })();
    }, [buyerID, sellerID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const msg = (new FormData(form).get('msg box') as string)?.trim(); // Make sure input name="msg"
        form.reset();
        if (!msg) return;

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) return;

        const isSeller = userId === sellerID;
        const newMessage = { seller: isSeller, content: msg };

        try {
            // Fetch latest messages from DB
            const { data: chatroom, error: fetchError } = await supabase
                .from('ChatRooms')
                .select('messages')
                .eq('id', id)
                .maybeSingle();

            if (fetchError) throw fetchError;

            const updatedMessages = [...(chatroom?.messages || []), newMessage];

            // Update DB
            const { data: updatedChat, error: updateError } = await supabase
                .from('ChatRooms')
                .update({ messages: updatedMessages })
                .eq('id', id)
                .select()
                .maybeSingle();

            if (updateError) throw updateError;

            // Update local state
            setChats(updatedChat?.messages || []);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };


    if (!chats) return <LoadSpinner />

    return (
        <div className='h-screen flex flex-col gap-6 items-center justify-center'>
            <div className='w-full max-w-4xl flex flex-col items-center gap-2 p-6 overflow-y-scroll'>
                {chats.map((chat, index) => (
                    <div
                        key={index}
                        className={chat.seller ?
                            'bg-gray-400/70 rounded-md ml-auto px-6 py-4' :
                            'bg-blue-400/70 rounded-md mr-auto px-6 py-4'}
                    >{chat.content}
                    </div>
                ))}
            </div>
            <form
                onSubmit={handleSubmit}
                className='fixed bottom-10 w-full flex flex-col gap-4 items-center'
            >
                {/* <label className='flex gap-2'>
                    <input
                        name='role'
                        id='role'
                        type='checkbox'
                        className='p-2'
                    />
                    Are you buyer?
                </label> */}
                <input
                    name='msg box'
                    alt='msg box'
                    placeholder='what da dawg doing'
                    className='px-6 py-4 rounded-lg w-full max-w-2xl'
                />
            </form>
        </div>
    )
}

export default page