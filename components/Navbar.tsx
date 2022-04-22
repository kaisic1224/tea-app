import { useSession } from "next-auth/react";
import Link from "next/link";
import PageNavigator from "./PageNavigator";

const Navbar = () => {
  const { status } = useSession();
  return (
    <div
      className={`flex gap-2 items-center justify-between pl-8 ${
        status === "authenticated" ? "pr-4" : "pr-8"
      }`}
    >
      <div className='flex gap-2 items-center cursor-pointer'>
        <Link href={"/recipes"}>
          <span className='font-bold text-xl'>
            <a className='text-amber-400'>Tea</a>Tinker
          </span>
        </Link>
        <img src='/leaf.png' alt='leaf picture' className='aspect-square w-6' />
      </div>
      <PageNavigator />
    </div>
  );
};
export default Navbar;
