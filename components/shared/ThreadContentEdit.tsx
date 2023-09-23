'use client';

import {
  CommentValidation,
  ThreadValidation,
} from '@/lib/validations/thread.validation';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { updateThread } from '@/lib/actions/thread.actions';
import { usePathname } from 'next/navigation';

interface Props {
  content: string;
  authorId: string;
  isComment: boolean | undefined;
  currentUserId: string;
  threadId: string;
}

export default function ThreadContentEdit({
  content,
  authorId,
  isComment,
  threadId,
  currentUserId,
}: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleEdit = () => setEdit(!edit);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: content || '',
      author: JSON.parse(authorId),
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await updateThread({
      threadId: JSON.parse(threadId),
      content: values.thread,
      path: pathname,
    });
    toggleEdit();

    form.reset();
  };

  return (
    <div>
      {edit ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`${
              isComment
                ? 'mt-2 flex gap-4 max-xs:flex-col items-end'
                : 'mt-3 flex flex-col justify-start gap-3'
            }`}
          >
            <FormField
              control={form.control}
              name='thread'
              render={({ field }) => (
                <FormItem
                  className={`w-full flex ${
                    isComment ? 'flex-row items-end gap-3' : 'flex-col gap-2'
                  }`}
                >
                  <FormControl
                    className={`${
                      isComment ? 'border-none bg-transparent' : ''
                    }`}
                  >
                    {isComment ? (
                      <Input
                        type='text'
                        placeholder='Comment...'
                        className='no-focus text-light-1 outline-none'
                        {...field}
                      />
                    ) : (
                      <Textarea
                        rows={5}
                        className='account-form_input no-focus'
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className={`${isComment ? 'comment-form_btn' : 'bg-primary-500'}`}
            >
              Save
            </Button>
          </form>
        </Form>
      ) : (
        <button
          className='text-light-2 mt-2 text-small-regular text-start'
          onClick={toggleEdit}
          disabled={currentUserId !== authorId}
        >
          {content}
        </button>
      )}
    </div>
  );
}