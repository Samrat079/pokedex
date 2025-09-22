'use client'
import { createClient } from '@/lib/supabase/client'
import { BsCloudUpload } from "react-icons/bs";
import React, { FormEvent, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im';
import Image from 'next/image';

const Page = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)
  const supabase = createClient();

  // file preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // show preview instantly
    }
  };

  // upload function
  const addPets = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form); // form data for upload
    const formDataObj = Object.fromEntries(formData.entries()) // formData into obj to destructure 

    const { name, breed, family, price, bday, description } = formDataObj;

    let imgUrl = '';

    if (file && file.size > 0) {
      const fileExtention = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExtention}`
      const { error } = await supabase.storage
        .from('Pets')
        .upload(`images/${fileName}`, file)

      if (error) {
        console.log(error)
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('Pets')
        .getPublicUrl(`images/${fileName}`);

      imgUrl = publicUrlData.publicUrl;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const id = user?.id; // safe optional chaining

    const { error } = await supabase
      .from('Pets')
      .insert({ name, breed, family, price, bday, description, owner_id: id, image: imgUrl })
      .select()

    if (error) { console.log(error) }
    // console.log(data)
    // console.log(file, preview)
    form.reset()
    setLoading(false)
  }

  return (
    <div className='flex flex-col gap-6 items-center justify-center md:p-6'>
      <form
        className='flex flex-col gap-6 w-full border rounded shadow-md shadow-white p-6'
        onSubmit={addPets}
      >
        <div className="flex items-center justify-center">
          <label
            htmlFor="file-upload"
            className="w-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-blue-400/20 hover:bg-blue-400/40 transition relative overflow-hidden"
          >
            {/* Show preview inside box */}
            {preview ? (
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover rounded-lg opacity-50"
                style={{ objectFit: 'cover', opacity: 0.8 }}
                sizes="100vw"
              />
            ) : (
              // default text
              < div className="w-full text-white text-lg relative flex flex-col items-center">
                <BsCloudUpload size={30} />
                <p>Drag or Browse file here</p>
                <p className='italic text-white/80 text-sm'>accepts .jpg, .png file formats</p>
              </div>
            )}
          </label>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* name */}
        <input
          type='text'
          name='name'
          placeholder='name'
          required
          className='p-4 rounded-md'
        />
        {/* breed */}
        <input
          type='text'
          name='breed'
          placeholder='breed'
          required
          className='p-4 rounded-md'
        />
        {/* family */}
        <input
          type='text'
          name='family'
          placeholder='family'
          required
          className='p-4 rounded-md'
        />
        {/* description */}
        <textarea
          name='description'
          placeholder='description'
          required
          className='p-4 rounded-md'
        />
        {/* price */}
        <input
          type='number'
          name='price'
          step='0.1'
          min='0'
          placeholder='price'
          required
          className='p-4 rounded-md'
        />
        {/* birthday */}
        <input
          type='date'
          name='bday'
          placeholder='birthday'
          required
          className='p-4 rounded-md'
        />
        <button
          className='p-4 rounded-md hover:bg-blue-400/80 bg-blue-400/40 md:col-span-2'
          disabled={loading}
        >
          {loading ? <ImSpinner2 size={32} className='animate-spin mx-auto' /> : 'Submit'}
        </button>
        <p></p>
      </form >
    </div >
  )
}

export default Page