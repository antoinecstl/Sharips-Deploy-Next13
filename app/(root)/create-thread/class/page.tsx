
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import Newclass from "@/components/forms/Newclass";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className='head-text'>Ajouter une matière</h1>

      <Newclass userId={userInfo._id} userCom={userInfo.communitie} />
    </>
  );
}

export default Page;
