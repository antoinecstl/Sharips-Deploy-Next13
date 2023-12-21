"use client"

import { SignedIn, SignOutButton, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

function Topbar() {

  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/target.svg' alt='logo' width={32} height={32} />
        <p className='text-heading3-bold text-light-1'>Sharips</p>
      </Link>

      <div className='flex items-center gap-1'>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />

        <UserButton>
        </UserButton>

        <div className='block ml-2'>
            <SignedIn>
              <SignOutButton>
                <div className='flex cursor-pointer hover:opacity-50'>
                  <Image
                    src='/assets/logout.svg'
                    alt='logout'
                    width={24}
                    height={24}
                  />
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
    </nav>
  );
}

export default Topbar;
