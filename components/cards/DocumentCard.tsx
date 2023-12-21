
import { fetchUser } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { string } from "zod";
import LikeForm from "../forms/LikeForm";
import Deletedoc from "../forms/Deletedoc";
import { fetchDocbyId } from "@/lib/actions/thread.actions";

interface Props {
  id: string;
  matiere: string;
  content: string;
  title: string;
  author: string;
  createdAt: string;
  url: string;
}

async function DocumentCard({
  id: id,
  matiere: matiere,
  title,
  content,
  author,
  createdAt,
  url,
}: Props) {   
    
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    const document = await fetchDocbyId(id);


  return (
    <><article
          className="flex w-full flex-col rounded-xl bg-slate-900/90 p-5 border border-primary-500 transition duration-800"
      >
          <div className='flex items-start justify-between'>
              <div className='flex w-full flex-1 flex-row gap-4'>
                  <div className='flex flex-col items-center'>
                      <div className='thread-card_bar' />
                  </div>

                  <div className='flex w-full flex-col'>
                      <h4 className='cursor-pointer text-heading3-bold text-white mb-2'>
                          {matiere}
                      </h4>
                      <div>
                          <p className="text-heading4-semibold text-light-2">
                              Titre : {title}
                          </p>
                      </div>
                      <div>
                          <p className="text-base-regular text-light-2">
                              Description : {content}
                          </p>
                      </div>

                      <div className="mt-3 flex flex-col">
                          <p className='text-small-medium text-primary-500'>
                              Publié par {author} à {formatDateString(createdAt)}
                          </p>
                      </div>
                  </div>
              </div>
              <div className="hidden sm:block">
              <LikeForm user={userInfo.id} id={id} />
              </div>
          </div>
          <div className="flex justify-between">
              <div className="sm:hidden mt-2">
                <LikeForm user={userInfo.id} id={id} />
              </div>
          <Deletedoc id={id} user={userInfo.id} author={document.authorId}/>
          </div>
      </article>
      <iframe className="rounded-xl mt-8" src={url} width="100%" height="610px"></iframe></>
  );
}

export default DocumentCard;
