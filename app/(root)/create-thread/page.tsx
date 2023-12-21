
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import Link from "next/link";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <><p className='mt-4 text-heading3-bold sm:text-heading2-bold ml-6 text-white underline decoration-primary-500'>Ajoute ta pierre à l'édifice !</p>
      <main className="mt-10 grid grid-rows-2 items-center gap-8">
      <Link href="/create-thread/doc" className="bg-slate-900/80 rounded-xl hover:border hover:border-primary-500 hover:scale-105 transition duration-800">
        <div className="my-6 ">
          <p className='text-heading3-bold ml-6 text-white'>Nouveau document</p>
          <p className='mt-4 text-base mx-6 text-white'>Uploader un nouveau document (Travaux Pratique, Partiel, Devoir, Fiche de note)</p>
        </div>
      </Link>
      <Link href="/create-thread/class" className="bg-slate-900/80 rounded-xl hover:border hover:border-primary-500 hover:scale-105 transition duration-800">
        <div className="my-6">
          <p className='text-heading3-bold ml-6 text-white'>Ajouter une matière</p>
          <p className='mt-4 text-base mx-6 text-white'>Créer une nouvelle matière au sein de la bibliothèque</p>
        </div>
      </Link>
    </main></>
  );
} 

export default Page;
