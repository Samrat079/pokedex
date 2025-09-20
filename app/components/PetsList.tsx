import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { currencyConvert } from '@/lib/Currency/utils'

export type PetsType = {
    id: number;
    name: string;
    price: number;
    description: string;
    breed: string;
    bday: Date;
    image: string;
};

const PetsList = (props: PetsType) => {
    return (
        < div className="flex flex-wrap justify-center w-full gap-6" >
            {props.pets?.map((pet: PetsType) => (
                <Link href={`/pet/${pet.id}`} key={pet.id}>
                    <div className="max-w-[420px] h-[440px] rounded shadow-md shadow-white overflow-hidden flex flex-col">
                        <Image
                            src={pet.image}
                            alt={pet.name}
                            width={420} // match card width
                            height={250} // fixed image height
                            sizes="350px"
                            className="w-[420px] h-[250px] object-cover" // fixed image sizing
                        />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <p className="text-lg font-semibold">{pet.name}</p>
                            <p className="text-xl font-bold text-yellow-300">{currencyConvert(pet.price)}</p>
                            <p className="line-clamp-2">{pet.description}</p>
                            <p className="text-sm text-white/40 italic">{pet.breed}</p>
                        </div>
                    </div>
                </Link>

            ))}
        </div >
    )
}

export default PetsList


