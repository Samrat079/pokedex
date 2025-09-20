import React from 'react'
import { ImSpinner2 } from 'react-icons/im'

const LoadSpinner = () => {
    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <ImSpinner2 size={64} className='animate-spin' />
        </div>
    )
}

export default LoadSpinner