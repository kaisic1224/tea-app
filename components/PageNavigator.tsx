import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

const PageNavigator = () => {
  const currPage = useRouter().pathname;
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
                  currPage === tab[1]
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
    </motion.ul>
  );
};

export default PageNavigator;
