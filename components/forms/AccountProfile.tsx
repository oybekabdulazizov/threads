'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { UserValidation } from '@/lib/validations/user.validation';
import { Button } from '../ui/button';
import * as z from 'zod';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Textarea } from '../ui/textarea';
// import { isBase64Image } from '@/lib/utils';
// import { useUploadThing } from '@/lib/uploadthing';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.actions';

interface Props {
  user: {
    idFromClerk: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export default function AccountProfile({ user, btnTitle }: Props) {
  const [file, setFile] = useState<File>();
  // const { startUpload } = useUploadThing('media');
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      image: user.image || '',
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    const fileReader = new FileReader();

    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (!file.type.includes('image')) {
          // Todo: Use toast notification
          return;
        }
        setFile(e.target.files[0]);

        fileReader.onload = async (event) => {
          const imageDataUrl = event.target?.result?.toString() || '';
          fieldChange(imageDataUrl);
        };

        fileReader.readAsDataURL(file);
      }
    } catch (error: any) {
      throw new Error(`(handleImage): ${error.message}`);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    if (!values.image.includes('res.cloudinary.com')) {
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('upload_preset', 'threads_preset');
      const data = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      ).then((res) => res.json());
      values.image = data.secure_url;
    }

    // try {
    //   const hasImageChanged = isBase64Image(blob);
    //   if (hasImageChanged) {
    //     const imgRes = await startUpload(files);
    //     if (imgRes && imgRes[0].url) {
    //       values.image = imgRes[0].url;
    //     }
    //   }
    // } catch (error: any) {
    //   throw new Error(`(onSubmit): ${error.message}`);
    // }

    await updateUser({
      userId: user.idFromClerk,
      ...values,
      path: pathname,
    });

    if (pathname === '/profile/edit') {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-8'
      >
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile photo'
                    width={95}
                    height={95}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile photo'
                    width={25}
                    height={25}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  placeholder='Upload a photo'
                  accept='image/*'
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
            <FormItem className='flex flex-col gap-2 w-full'>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2 w-full'>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Submit
        </Button>
      </form>
    </Form>
  );
}
