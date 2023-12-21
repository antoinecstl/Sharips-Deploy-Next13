import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchClass, fetchClassbyID, fetchDocbyClass } from "@/lib/actions/thread.actions";
import SearchDocCard from "@/components/cards/SearchDocCard";

async function Page({ params }: { params: { id: string} }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const classInfo = await fetchClassbyID(params.id)

  const fullclassname = (`${classInfo.codematiere}-${classInfo.title}`);
  console.log(fullclassname)
  const docs = await fetchDocbyClass(fullclassname);
  console.log(docs)
  
  return (
    <section>
      <h1 className="text-white text-heading3-bold mb-6">
        {fullclassname}
      </h1>
      {docs && docs.length > 0 ? (
        docs.map(doc => (
          <SearchDocCard
            key={doc.id}
            id={doc.id} 
            matiere={doc.matiere} 
            content={doc.text} 
            title={doc.title} 
            author={doc.author} 
            createdAt={doc.createdAt}
          />
        ))
      ) : (
        <p className="text-white">Cette matière n'a pas de document.</p>
      )}
    </section>
  );
}

export default Page;
