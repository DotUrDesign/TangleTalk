"use client";

import * as z from "zod"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod';
import { UserValidation } from "@/lib/validations/user";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { isBase64Image } from "@/lib/utils";
import {useUploadThing} from '@/lib/uploadthing';
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";


/*

In this file, we are going to use "shadcn". "shadcn" is a beautifully designed componeents that you can copy and paste into your apps. 
-> Accessible
-> Customizable
-> Open source

*/

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({user, btnTitle} : Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    }
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();   // prevents a browser reload...

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {

    // this will pass the data to the backend...

    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);  // The purpose of this function is to check if the provided data (in this case, the image data stored in the values.profile_photo field) is in the format of a base64-encoded image. Base64 encoding is a method used to represent binary data, such as images, in ASCII characters, making it suitable for data transmission over text-based protocols like HTTP.

    // this happens when the image is reuploaded...
    if (hasImageChanged) {
      const imgRes = await startUpload(files);


      // fileUrl is deprecated here. Use "url" instead of "fileUrl"...
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    // Update user profile -->
    

    /* Pro tip : Always accept the parameters within the curly braces(i.e., destructuring format) as it makes our code less error prone as we should not be concerned about the order we are accepting the parameters as we are passing the entire object and whilea accepting we are destructuring it. The order of "AccountProfile.tsx" and "userActions.ts" parameters can be in any order. */
    await updateUser({
      name: values.name,
      path: pathname,
      username: values.username,
      userId: user.id,
      bio: values.bio,
      image: values.profile_photo,
    });

    if (pathname === "/profile/edit") {
      router.back(); // simply we want to go back after editing...
    } else {
      router.push("/");  // going from onboarding page to home page...
    }
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        
      <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

          
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              {/* The "FormMessage" helps in showing up the error. */}
              <FormMessage />  
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              {/* The "FormMessage" helps in showing up the error. */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              {/* The "FormMessage" helps in showing up the error. */}
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  )
}

export default AccountProfile;