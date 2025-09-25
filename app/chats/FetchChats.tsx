'use server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';

export default async function FetchChats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('Conversations')
        .select('*')
        .or(`user1_id.eq.${user!.id}, user2_id.eq.${user!.id}`)
        
    if (error) {
        console.error(error)
        return
    }

    return (
        <div>
            <p>Your email is {user!.id}</p>
            <p>Total chats found {data?.length}</p>
            <div className='flex flex-col'>
                {data?.map((chat) => (
                    <Link
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className='border mt-2 px-6 py-2'>
                        {chat.id}
                    </Link>
                ))}
            </div>
        </div>
    )
}