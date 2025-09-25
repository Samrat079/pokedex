'use client'
import React, {  useLayoutEffect, useState } from 'react'
import SideBar from './SideBar'
import { BsReverseLayoutSidebarReverse } from "react-icons/bs";

type layoutProp = {
    children: React.ReactNode;
}

export type barToggleProps = {
    setBarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    barIsOpen: boolean;
}

const BodyGrid = ({ children }: layoutProp) => {
    const [barIsOpen, setBarIsOpen] = useState(false);

    useLayoutEffect(() => {
        setBarIsOpen(window.innerWidth >= 768);
    },[])

    // sizing for the main content
    const contentResize = `flex-1 ${barIsOpen && 'ml-60'} transition-all ease-out duration-300 min-h-screen overflow-y-auto`;
    const sideBarResizer = `fixed ${barIsOpen ? 'w-60' : 'w-0'} transition-all ease-out duration-300 z-20`;
    const topBarResuizer = `fixed top-0 z-10 w-full bg-white bg-opacity-10 backdrop-blur-md p-2 flex felx-col gap-6 items-center`;

    return (
        <div className="flex">
            <div className={sideBarResizer}>
                <SideBar />
            </div>
            <div className={contentResize}>

                {/* top Bar */}
                <div className={topBarResuizer}>
                    <button
                        onClick={() => setBarIsOpen(!barIsOpen)}
                        className='hover:bg-gray-400/80 p-2 text-lg rounded'
                    >
                        <BsReverseLayoutSidebarReverse />
                    </button>
                    <p>This is the top bar</p>
                </div>

                {/* main content */}
                <main className="mt-12">{children}</main>
            </div>
        </div>
    )
}

export default BodyGrid