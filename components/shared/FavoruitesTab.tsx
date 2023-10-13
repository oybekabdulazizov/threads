import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';
import { fetchThought } from '@/lib/actions/thought.actions';
import { calculateRelativeTimes } from '@/lib/utils';
import ReplyCard from '../cards/ReplyCard';
import { fetchUserLikedThoughts } from '@/lib/actions/like.action';
import ThoughtCard from '../cards/ThoughtCard';

interface Props {
  idUser_clerk: string;
  currentUserId_clerk: string;
}

export default async function FavouritesTab({
  idUser_clerk,
  currentUserId_clerk,
}: Props) {
  const user_db = await fetchUser(idUser_clerk);
  if (!user_db) {
    redirect('/auth/sign-in');
  }

  const favouriteThoughts = await fetchUserLikedThoughts(user_db._id);

  return (
    <section className='mt-2 flex w-full flex-col'>
      {favouriteThoughts.length > 0 ? (
        <>
          {favouriteThoughts.map((t: any, i: any) => (
            <div className='mt-4'>
              <ThoughtCard
                key={t._id}
                thoughtId={t._id}
                currentUserId_clerk={currentUserId_clerk}
                thought={t.text}
                image={t.image}
                author={t.author}
                comments={t.childrenThoughts}
                likes={t.likes}
                createdAt={t.createdAt}
              />
            </div>
          ))}
        </>
      ) : (
        <p className='no-result mt-4'>No favourites yet.</p>
      )}
    </section>
  );
}
