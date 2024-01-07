import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchNewClass, fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import MatiereCard from "@/components/cards/MatiereCard";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const resultpost = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    4
  );

  const resultmat = await fetchNewClass(
    searchParams.page ? +searchParams.page : 1,
    4
  );


  return (
    <main>
      <h1 className='head-text text-left mb-10'>Bienvenue dans la bibliothèque Sharips</h1>

      <h1 className='text-heading3-semibold text-white text-left underline'>Dernières Contributions :</h1>

      <section className='mt-4 grid sm:grid-cols-2 gap-4 rounded-2xl p-4'>
        {resultpost.posts.length === 0 ? (
          <p className='no-result'>No Document found</p>
        ) : (
          <>
            {resultpost.posts.map((post) => (
              <ThreadCard
                id={post.id}
                matiere={post.matiere}
                title={post.title}
                content={post.text}
                author={post.author}
                createdAt={post.createdAt}
              />
            ))}
          </>
        )}
      </section>

      <h1 className='text-heading3-semibold text-white text-left underline mt-6'>Nouvelles matières :</h1>
      <section className='mt-4 grid sm:grid-cols-2 gap-4 rounded-2xl p-4'>
        {resultmat.matiere.length === 0 ? (
          <p className='no-result'>No Matiere found</p>
        ) : (
          <>
            {resultmat.matiere.map((mat) => (
              <MatiereCard
                id={mat.id}
                title={mat.title}
                codematiere={mat.codematiere}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}

export default Home;
