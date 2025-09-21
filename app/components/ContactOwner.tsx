'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import React from 'react'

type ContactOwnerProps = {
    owner_id: string
}

const ContactOwner: React.FC<ContactOwnerProps> = ({ owner_id }) => {
    const router = useRouter()
    const supabase = createClient()

    const handleClick = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        // lower ID goes to user1, higher to user2
        const [lowerID, higherID] =
            user!.id < owner_id
                ? [user!.id, owner_id]
                : [owner_id, user!.id];

        let conversationId: number;

        // check for existing conversation
        const { data, error } = await supabase
            .from('Conversations')
            .select('*')
            .eq('user1_id', lowerID)
            .eq('user2_id', higherID);

        if (error) {
            console.error('Error checking conversation:', error);
            return;
        }

        if (data && data.length > 0) {
            // existing conversation
            conversationId = data[0].id;
        } else {
            // create new conversation
            const { data: newConvo, error: insertError } = await supabase
                .from('Conversations')
                .insert({ user1_id: lowerID, user2_id: higherID })
                .select()
                .single();

            if (insertError) {
                console.error('Error creating conversation:', insertError);
                return;
            }

            conversationId = newConvo.id;
        }

        // redirect to chat id
        router.push(`/chat/${conversationId}`);
    };

    return (
        <button
            className='text-center rounded-md w-full shadow-md shadow-green-700 active:bg-green-600 px-4 py-2'
            onClick={handleClick}
        >
            Contact Owner
        </button>
    )
}

export default ContactOwner