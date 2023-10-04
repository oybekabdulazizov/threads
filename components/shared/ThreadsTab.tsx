import { fetchUserThoughts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThoughtCard from '../cards/ThoughtCard';

interface Props {
  currentUserId_clerk: string;
  // idUser_clerk: string;
  authorId: string;
  accountType: string;
}

export default async function ThoughtsTab({
  currentUserId_clerk,
  // idUser_clerk,
  authorId,
  accountType,
}: Props) {
  const result = await fetchUserThoughts(JSON.parse(authorId));
  if (!result || result.errorCode === 404) redirect('/');

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {result.thoughts.length > 0 ? (
        <>
          {result.thoughts.map((thought: any) => (
            <ThoughtCard
              key={thought._id}
              thoughtId={thought._id}
              currentUserId_clerk={currentUserId_clerk}
              content={thought.text}
              author={
                accountType === 'User'
                  ? {
                      name: result.name,
                      image: result.image,
                      idUser_clerk: result.id,
                      _id: result._id,
                    }
                  : {
                      name: thought.author.name,
                      image: thought.author.image,
                      idUser_clerk: thought.author.id,
                      _id: thought.author._id,
                    }
              }
              createdAt={thought.createdAt}
              comments={thought.childrenThoughts}
              likes={thought.likes}
            />
          ))}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No thoughts yet.</p>
      )}
    </section>
  );
}
