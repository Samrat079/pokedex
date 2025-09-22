'use client'
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { formatDistance } from "date-fns";
import LoadSpinner from '../components/LoadSpinner';
import LogoutButton from '../components/logoutBtn';
import PetsList, { PetsType } from '../components/PetsList';
import { User } from '@supabase/supabase-js';

function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [userPets, setUserPets] = useState<PetsType[]>([])
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    const userPets = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('Pets')
        .select()
        .eq('owner_id', user.id);
      setUserPets(data ?? [])
    }
    userPets()
  }, [supabase, user])


  if (!user) { return (<LoadSpinner />); }

  const { email, aud, created_at } = user;
  // console.log(user);
  const logSince = formatDistance(new Date(created_at), new Date(), { addSuffix: true });

  return (
    <div className='flex flex-col items-center justify-center gap-6 mt-20 md:p-6'>

      {/* profile box */}
      <div className='w-full bg-gray-500/40 md:p-6 rounded'>

        {/* first box inside profile */}
        <div className='flex md:flex-row flex-col justify-between gap-6'>
          <div className=''>
            <Image
              src='https://avatar.iran.liara.run/public'
              alt='Profile picture'
              width={160}
              height={160}
              priority
            />
          </div>
          <div className='flex flex-col flex-1 gap-4 p-6 border rounded'>
            <p>email: {email}</p>
            {/* <p>user id: {id}</p> */}
            <p>Status: {aud}</p>
            <p>Logged in:{' '}{logSince}</p>
            <LogoutButton />
          </div>
        </div>
      </div>
      {userPets.length > 0 && (
        <div className=''>
          <p className='w-full text-lg font-bold'>Your Listings</p>
          <hr className='py-2' />
          <PetsList pets={userPets} />
        </div>
      )}
    </div>
  )
}

export default Profile