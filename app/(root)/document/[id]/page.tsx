import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchDocbyId } from "@/lib/actions/thread.actions";
import DocumentCard from "@/components/cards/DocumentCard";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const docInfo = await fetchDocbyId(params.id)
  return (
    <section>
        <DocumentCard
            id={docInfo.id}
            matiere={docInfo.matiere}
            title={docInfo.title}
            content={docInfo.text}
            author={docInfo.author}
            createdAt={docInfo.createdAt}        
            url={docInfo.document}
        />
    </section>
  );
}
export default Page;
