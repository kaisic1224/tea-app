import Head from "next/head";
import PageNavigator from "../../components/PageNavigator";
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import { FirebaseStorage } from "firebase/storage";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { db } from "../../firebase/clientApp";
import { useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import Recipe from "../../components/Recipe";
import Navbar from "../../components/Navbar";
// hover animation stack overflow where image gets enlarged and some info about article gets displayed

export interface recipe {
  approved: boolean;
  id: string;
  author: string;
  authorId: string;
  body: string[];
  date: string;
  imageRef: string;
  prep: string[];
  title: string;
  rating: number;
}

const index: NextPage<{ recipesDb: recipe[] }> = ({ recipesDb }) => {
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>();
  const [recipes, setRecipes] = useState<recipe[]>([]);
  if (session) {
    return (
      <>
        <Head>
          <title>TeaTinker - Recipes</title>
          <link rel='shortcut icon' href={"/leaf.png"} type='image/x-icon' />
        </Head>

        <header>
          <Navbar />
        </header>

        <main className='px-8 pb-12'>
          <div className='flex justify-between items-center gap-6'>
            <div className='min-w-max'>
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
                <Link href={`/users/${session.ref}`}>
                  <a className='text-amber-500 hover:text-amber-400 underline cursor-pointer'>
                    {session.user?.name}
                  </a>
                </Link>
              </motion.h1>
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
            <div className='relative w-1/4'>
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
            </div>
          </div>
          <section className='mt-8 grid gap-3 gap-y-6 grid-cols-4 sm:grid-cols-3'>
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
          </section>
          <span className='block max-w-fit font-medium mx-auto'>
            Can't find one you're looking for? Add it{" "}
            <Link href='/recipes/add'>
              <a>
                <strong className='font-bold text-amber-500 hover:underline'>
                  here
                </strong>
              </a>
            </Link>
          </span>
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

export const getStaticProps: GetStaticProps = async (ctx) => {
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
    props: { recipesDb: recipes }
  };
};
