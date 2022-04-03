import Head from "next/head";
import PageNavigator from "../../components/PageNavigator";
import type { GetServerSideProps, NextPage } from "next";
import { storageRef } from "../../firebase/clientApp";
import { FirebaseStorage } from "firebase/storage";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { db } from "../../firebase/clientApp";
import { useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import Recipe from "../../components/Recipe";
// hover animation stack overflow where image gets enlarged and some info about article gets displayed

interface recipe {
  author: string;
  body: string[];
  date: Date;
  imageRef: string;
  prep: string[];
  title: string;
  rating: number;
}

interface comment {
  rating: number;
  body: string;
  author: string;
  date: Date;
}

const index: NextPage<{ recipes: recipe[] }> = ({ recipes }) => {
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>();
  if (session) {
    return (
      <>
        <Head>
          <title>TeaTinker - Recipes</title>
        </Head>
        <header>
          <div className='flex gap-2 items-center justify-between px-8'>
            <div className='flex gap-2 items-center cursor-pointer'>
              <Link href={"/"}>
                <span className='font-bold text-xl'>
                  <a className='text-amber-400'>Tea</a>Tinker
                </span>
              </Link>
              <img
                src='/leaf.png'
                alt='leaf picture'
                className='aspect-square w-6'
              />
            </div>
            <PageNavigator />
          </div>
        </header>

        <main className='px-8'>
          <div className='flex justify-between items-center gap-6'>
            <div className='min-w-max'>
              <div className='overflow-hidden'>
                <motion.h1
                  className='mt-6 text-4xl font-semibold'
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{
                    duration: 0.75,
                    ease: "easeOut",
                    delayChildren: 2
                  }}
                >
                  Welcome back,{" "}
                  <motion.span
                    animate={{ y: 0 }}
                    initial={{ y: "100%" }}
                    transition={{ ease: "easeOut", delay: 4 }}
                    className='text-amber-500 underline'
                  >
                    {session.user?.name}
                  </motion.span>
                </motion.h1>
              </div>
              <div className='overflow-hidden'>
                <motion.button
                  className='cursor-default font-semibold'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.75, ease: "easeOut", delay: 0.25 }}
                >
                  Not you?{" "}
                  <strong
                    className='text-amber-500 hover:text-amber-400 cursor-pointer'
                    onClick={() => signOut()}
                  >
                    Sign out
                  </strong>
                </motion.button>
              </div>
            </div>
            <motion.div className='relative w-1/4'>
              <motion.input
                className='block ml-auto rounded-full bg-slate-100 py-[.25em] pl-2 pr-6'
                initial={{ width: 0 }}
                whileFocus={{ width: "100%" }}
                transition={{ type: "tween", duration: 0.2, delay: 0.15 }}
                type='text'
                placeholder='Search for a recipe...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className='pointer-events-none absolute right-2 top-2/4 -translate-y-2/4' />
            </motion.div>
          </div>
          <section className='mt-8 grid gap-3 gap-y-6 grid-cols-4 sm:grid-cols-3'>
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
          </section>
        </main>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>TeaTinker - Recipes</title>
      </Head>
      <header>
        <div className='flex gap-2 items-center justify-between px-8'>
          <div className='flex gap-2 items-center cursor-pointer'>
            <Link href={"/"}>
              <span className='font-bold text-xl'>
                <a className='text-amber-400'>Tea</a>Tinker
              </span>
            </Link>
            <img
              src='/leaf.png'
              alt='leaf picture'
              className='aspect-square w-6'
            />
          </div>
          <PageNavigator />
        </div>
      </header>
      <main className='px-8'>
        <h1 className='text-3xl font-semibold'>
          Browse through our community recipes
        </h1>
        <p>You're not signed in</p>
        <span>
          Sign in{" "}
          <strong
            className='text-amber-500 hover:text-amber-400 cursor-pointer'
            onClick={() => signIn()}
          >
            here
          </strong>
        </span>
      </main>
    </>
  );
};
export default index;

export const getServerSideProps: GetServerSideProps = async () => {
  const recipes: any[] = [];
  const recipeCollection = collection(db, "recipes");
  await getDocs(recipeCollection).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      recipes.push({
        ...doc.data(),
        date: doc.get("date").toDate().toString()
      });
    });
  });
  return {
    props: { recipes: recipes }
  };
};
