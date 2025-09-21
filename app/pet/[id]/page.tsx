import ContactOwner from "@/app/components/ContactOwner";
import { currencyConvert } from "@/lib/Currency/utils";
import { createClient } from "@/lib/supabase/server";
import calculateAge from "calculate-age";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const supabase = await createClient()
    const { id } = await params;
    const { data: pet } = await supabase
        .from("Pets")
        .select("*")
        .eq("id", id)
        .single();

    const { data: { user } } = await supabase
        .auth
        .getUser()

    return (
        <div className='flex flex-col min-h-screen md:items-center md:justify-center'>
            <div className='flex flex-col md:flex-row gap-4 p-6 max-w-6xl items-center'>

                {/* the Image */}
                <div className="w-full max-w-lg">
                    <Image
                        src={pet.image}
                        alt={pet.name}
                        width={423}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>

                {/* Info about the pet */}
                <div className="p-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className='font-bold text-2xl'>{pet.name}</p>
                        <p className='text-xl font-bold text-yellow-300'>{currencyConvert(pet.price)}</p>
                        <p>{pet.description}</p>
                        <p className='px-4 py-1 max-w-fit shadow-md shadow-yellow-400/70 rounded-md'>{pet.family}</p>
                        <p className='px-4 py-1 max-w-fit shadow-md shadow-gray-400/70 rounded-md'>{pet.breed}</p>
                        <p>Age: {calculateAge(pet.bday).getString()}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        {user && user.id === pet.owner_id ? (
                            <Link href={`/profile/`} className="text-center rounded-md w-full shadow-md shadow-yellow-500/90 active:bg-yellow-500/90 px-4 py-2">
                                Edit
                            </Link>
                        ) : (
                            <ContactOwner owner_id={pet.owner_id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page