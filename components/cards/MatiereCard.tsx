import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";

interface Props {
    id: string;
    codematiere: string;
    title: string;
}

function MatiereCard({
  id,
  codematiere,
  title,
}: Props) {
    let pathe
    pathe = `/search/${id}`;
    
  return (
    <Link href={pathe}>
    <article
      className="flex w-full flex-col rounded-xl bg-slate-900/90 p-4 border border-black hover:border-primary-500 transition duration-800"
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <div className='thread-card_bar' />
            </div>

            <div key={id} className='flex w-full flex-col'>
                <h4 className='cursor-pointer text-heading4-medium text-light-2'>
                  {codematiere} 
                </h4>
            <div>
              <p className="text-small-regular text-light-2">
              {title}
              </p>
            </div>

            </div>
        </div>
      </div>
    </article>
    </Link>
  );
}

export default MatiereCard;
