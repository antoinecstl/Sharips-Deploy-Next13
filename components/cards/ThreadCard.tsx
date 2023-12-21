import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";

interface Props {
  id: string;
  matiere: string;
  content: string;
  title: string;
  author: string;
  createdAt: string;
}

function ThreadCard({
  id: id,
  matiere: matiere,
  title,
  content,
  author,
  createdAt,
}: Props) {
    let pathe
    pathe = `/document/${id}`;
    
  return (
    <Link href={pathe}>
    <article
      className="flex w-full h-full flex-col rounded-xl bg-slate-900/90 p-5 border border-black hover:border-primary-500 transition duration-800"
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <div className='thread-card_bar' />
            </div>

            <div className='flex w-full flex-col'>
                <h4 className='cursor-pointer text-heading4-medium text-white'>
                  {matiere} 
                </h4>
            <div>
              <p className="text-small-regular text-light-2">
              {title}
              </p>
            </div>
            
              <div className="mt-2 flex flex-col gap-3">
                <p className='text-subtle-medium text-primary-500'>
                    Publié par {author} à {formatDateString(createdAt)}
                </p>
              </div>
            </div>
        </div>
      </div>
    </article>
    </Link>
  );
}

export default ThreadCard;
