'use server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';

export default async function FetchChats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const id = user.id;

    const { data, error } = await supabase
        .from('Conversations')
        .select('*')
        .or(`user1_id.eq.${id}, user2_id.eq.${id}`)

    console.log(data);

    return (
        <div>
            <p>Your email is {id}</p>
            <p>Total chats found {data.length}</p>
            <div className='flex flex-col'>
                {data.map((chat) => (
                    <Link 
                    href={`/chat/${chat.id}`}
                    className='border mt-2 px-6 py-2'>
                        {chat.id}
                    </Link>
                ))}
            </div>
        </div>
    )
}