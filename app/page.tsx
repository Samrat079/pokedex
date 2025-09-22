'use client'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';
import { CiSearch } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { petSearch } from '@/lib/supabase/PetSearch';
import LoadSpinner from './components/LoadSpinner';
import PetsList, { PetsType } from './components/PetsList';

const Page = () => {
    const [pets, setPets] = useState<PetsType[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true)
    const [debouncedQuery] = useDebounce(query, 500);

    useEffect(() => {
        const petsFetch = async () => {
            setLoading(true)
            const result = await petSearch(debouncedQuery)
            setPets(result)
            setLoading(false)
        }
        petsFetch()
    }, [debouncedQuery])

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    return (
        <div className='flex flex-col items-center justify-center pt-12'>
            <div className='w-full max-w-lg rounded-full overflow-hidden border my-2 flex flex-row gap-2'>
                <input
                    value={query}
                    placeholder='german shepherd...'
                    onChange={searchHandler}
                    className='w-full bg-transparent px-6 py-2 focus:outline-none'
                />
                <button onClick={() => setQuery('')}>
                    <RxCross1 size={24} />
                </button>
                <button className='px-6 py-2 bg-gray-200/40 border'>
                    <CiSearch size={24} />
                </button>
            </div>
            <div className=''>
                {loading ? <LoadSpinner /> : <></>}
                <PetsList pets={pets} />
            </div>
        </div>
    )
}

export default Page