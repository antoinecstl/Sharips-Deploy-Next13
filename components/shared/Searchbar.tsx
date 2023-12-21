"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  routeType: string;
  searchTerm: string;
  setSearchTerm: (search: string) => void; // This should be a function type
}


function Searchbar({ routeType, searchTerm, setSearchTerm }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  return (
    <div className='searchbar mb-4'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain' />
      <Input
        id='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Recherchez une matière..."
        className='no-focus searchbar_input' />
    </div>
  );
}

export default Searchbar;
