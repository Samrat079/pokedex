import Link from 'next/link'
import React from 'react'
import SessionCard from './SessionCard';

const SideBar = () => {
    const pages = [
        { name: "Home", Link: "/" },
        { name: "Profile", Link: "/profile" },
        { name: "Want to be a owner?", Link: "/addpets" },
        // { name: 'Chat', Link: '/chat/34'}
    ];

    const sideBarStyle = 'h-screen bg-gray-200/10 overflow-hidden shadow-[inset_-14px_0px_16px_0px_rgba(0,0,0,0.5)] shadow-gray-400/20 flex flex-col justify-between';

    return (
        <aside className={sideBarStyle}>
            <div className='px-6 py-4'>
                <p className='font-bold text-3xl'>PokeDex</p>
                <nav className='grid gap-2 py-6'>
                    {pages.map((page, index) => (
                        <Link key={index} href={page.Link}>{page.name}</Link>
                    ))}
                </nav>
            </div>
            {/* this is the bottom card for user */}
            <SessionCard />
        </aside>
    )
}

export default SideBar