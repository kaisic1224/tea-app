import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useRef } from "react";

const PageNavigator = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const modal = useRef<HTMLDivElement>(null);
  const [open, setopen] = useState(false);

  const handleClick = (e: MouseEvent) => {
    if (open && e.target != modal.current) setopen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [open]);

  const tabs = [
    ["Home", "/", "1"],
    ["Builder", "/start", "2"],
    ["Recipes", "/recipes", "3"]
  ];
  return (
    <motion.ul className='flex gap-1 items-center py-[.75em] px-[1.5em] font-semibold'>
      {tabs.map((tab) => {
        return (
          <motion.li key={tab[2]}>
            <Link href={tab[1]}>
              <a
                className={`px-3 py-2 relative after:absolute after:top-full after:w-5/6 after:bg-amber-600 after:left-2/4 after:-translate-x-2/4 after:rounded-t-2xl
                hover:text-amber-600 ${
                  router.pathname === tab[1]
                    ? "text-amber-600 after:h-[3px]"
                    : "after:h-0"
                }`}
              >
                {tab[0]}
              </a>
            </Link>
          </motion.li>
        );
      })}
      {router.pathname.includes("/recipes") ||
      router.pathname.includes("/users") ? (
        <>
          {status === "authenticated" ? (
            <div
              onClick={() => setopen(!open)}
              className='flex items-center relative gap-2'
            >
              <Image
                className='rounded-full cursor-pointer'
                src={session.user?.image!}
                width={30}
                height={30}
              />
              <span className='flex items-center gap-2 cursor-pointer'>
                {session?.user?.name} <FaAngleDown />
              </span>
              {open ? (
                <div
                  ref={modal}
                  className='shadow-md absolute w-full -bottom-5 left-2/4 -translate-x-2/4 bg-slate-100
                   z-50 translate-y-12 flex flex-col p-px'
                >
                  <div className='cursor-pointer hover:text-amber-400 hover:bg-white px-2 py-1'>
                    <Link href={`/users/${session.ref}`}>
                      <a>Profile</a>
                    </Link>
                  </div>
                  <div
                    className='cursor-pointer hover:text-amber-400 px-2 py-1'
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div
              className='cursor-pointer bg-amber-500 hover:bg-amber-400 rounded-full py-1 px-2'
              onClick={() => signIn()}
            >
              Sign in
            </div>
          )}
        </>
      ) : null}
    </motion.ul>
  );
};

export default PageNavigator;
