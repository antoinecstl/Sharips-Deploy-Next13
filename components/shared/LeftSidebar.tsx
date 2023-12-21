"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchNewClass, fetchPosts } from "@/lib/actions/thread.actions"; 
import { Usernumber } from "@/lib/actions/user.actions";
import { sidebarLinks } from "@/constants";
import { useEffect, useState } from "react";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalMatCount, setTotalMatCount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postdata = await fetchPosts();
        const matdata = await fetchNewClass();
        const userdata = await Usernumber();
        setTotalPostsCount(postdata.totalPostsCount);
        setTotalMatCount(matdata.totalMatCount);
        setTotalUserCount(userdata.totalUserCount)
      } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
      }
    };

    getPosts();
  }, []); // 


  return (
      <section className='bg-gray-950'>
        <div className="leftsidebar space-y-8">
          <div className='flex w-full flex-1 flex-col gap-6 px-4 py-4 rounded-xl bg-slate-900/60'>
            {sidebarLinks.map((link) => {
              const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;
              if (link.route === "/profile") link.route = `${link.route}/${userId}`;

              return (
                <Link
                  href={link.route}
                  key={link.label}
                  className={`leftsidebar_link  ${isActive && "bg-primary-500 hove:none "} hover:bg-primary-600`}
                >
                  <Image
                    src={link.imgURL}
                    alt={link.label}
                    width={24}
                    height={24} />

                  <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                </Link>
                );
              })}
          </div>
          <div className='flex w-full flex-1 flex-col gap-6 px-6 py-4 rounded-xl bg-slate-900/60 max-lg:hidden'>
              <p className="text-small-semibold text-white text-center">Matières : {totalMatCount}</p>
              <p className="text-small-semibold text-white text-center">Documents : {totalPostsCount}</p>
              <p className="text-small-semibold text-white text-center">Utilisateurs : {totalUserCount}</p>
          </div>
        </div>
      </section>
  );
};

export default LeftSidebar;
