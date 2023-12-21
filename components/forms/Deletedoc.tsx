"use client";

import Image from "next/image";
import { deleteThread } from "@/lib/actions/thread.actions";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  user: string;
  author: string;
}

function DeleteThread({id, user, author}: Props) {
    const router = useRouter();

  if (user !== author) return null;

  return (
    <button className="flex items-center justify-center ml-4 mt-2 w-fit py-1 px-2 rounded-xl bg-slate-800 hover:scale-105" onClick={async () => {
        await deleteThread(id);
          router.push("/");
      }}>

        <Image
        src='/assets/delete.svg'
        alt='delte'
        width={20}
        height={20}
        className='cursor-pointer object-contain'
        />
        <p className="ml-1 text-red-500">Supprimer</p>
    </button>
  );
}

export default DeleteThread;
