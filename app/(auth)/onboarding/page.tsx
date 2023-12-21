import { currentUser, SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();
  if (!user) return null; 

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/");
  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    Lastname: userInfo ? userInfo?.lastname : user.lastName ?? "",
    firstname: userInfo ? userInfo?.firstname : user.firstName ?? "", 
  };

  return (
    <main className='flex justify-center'>
      <div className='flex text-white absolute top-5 right-5 m-4'>
        <SignOutButton>
          <div className='flex cursor-pointer space-x-2 hover:opacity-50'>
            <p className="text-base-medium font-light">Abandonner</p>
            <Image
              src='/assets/logout.svg'
              alt='logout'
              width={24}
              height={24}
            />
          </div>
        </SignOutButton>
      </div>

      <section className='flex-cols max-w-4xl px-10 py-20 border-lg text-white justify-center mt-32'>
        <p className='text-heading2-semibold mb-2'>
          Bienvenue sur Sharips {userData.firstname} {userData.Lastname}
        </p>
        
        <div>
          <span className='text-body-semibold'>
            Retrouve ici la bibliothèque documentaire fourni par des élèves pour des élèves
          </span>
        </div>
        <section className="flex justify-end mt-8 mr-4">
          <AccountProfile user={userData}/>
        </section>
      </section>
    </main>
  );
}

export default Page;
