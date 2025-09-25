import React from 'react'
import FetchChats from './FetchChats'

const Page = async () => {
    return (
        <div className='flex flex-col items-center'>
            <p>This is chat page</p>
            <FetchChats />
        </div>
    )
}

export default Page