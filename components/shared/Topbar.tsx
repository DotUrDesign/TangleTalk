import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link"
import {dark} from "@clerk/themes"

/*

SignedIn coming from @clerk/nextjs is is incredibly powerful. As we remember, if we don't use this package, then we have to use a dynamic block of code, then we have to create functionality to figure "Is user logged in ?" => const isUserLoggedIn , and this will be set by some kind of a function or API call and then ultimately it would return a true or false value then we have to check it and open a new ternary operation, providing the other case as well and then writing the actual code within it.

Something like -->

const isUserLoggedIn = ...(API fetched data)

{isUserLoggedIn ? (
    <div>
        ...Logic for if user is logged in
    </div>
) : (
    <div>
        ...Logic for if user is not logged in
    </div>
)}

*/

function Topbar() {
    return (
        <nav className='topbar'>
        <Link href='/' className='flex items-center gap-4'>
            <Image src='/assets/logo.svg' alt='logo' width={28} height={28} />
            <p className='text-heading3-bold text-light-1 max-xs:hidden'>TangleTalk</p>
        </Link>

       <div className='flex items-center gap-1'>
        <div className='block md:hidden'>

        {/* This part of code is only going to execute if the user is signed in... */}
        
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
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

        { /* In the context of a web application, an "Organization Switcher" component might be responsible for allowing users to switch between different organizations or groups within the application. */ }

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div> 
    </nav>
    )
}

export default Topbar;