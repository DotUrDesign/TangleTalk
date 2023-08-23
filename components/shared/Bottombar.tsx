"use client";  // Mark this component as a client component because every component and Page we create inside the app folder is server component by default and there can be hydration problems if you can mix and match imports of clients and server.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";

function Bottombar() {
  const pathname = usePathname();

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>

       {/* 
       
       Why actually do we need the bottombar ? Why are we again iterating over the list of items in the bottombar file ?
        
       --> The answer to all these above questions is actually we are implementing the bottombar file only for the mobile device as the list of items can't be shown in the leftsidebar of a phone(due to lack of that much scrren size). So, that's why we are keeping all the list of items in the bottom of the page as soon as the website is viewed in a smaller device.

        */}

        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className='object-contain'
              />

              <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;