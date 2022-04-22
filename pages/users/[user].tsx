import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase/clientApp";
import { motion } from "framer-motion";
import { recipe } from "../recipes";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";
import { spawn } from "child_process";
import { ChangeEvent, useState } from "react";

interface user {
  id: string;
  name: string;
  recipes: recipe[];
  bio: string;
  image: string;
  dateJoined: Date;
}

const variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.7
    }
  }
};

const vars = {
  hidden: {
    opacity: 0,
    y: 100
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.5
    }
  }
};

const liVars = {
  hidden: {
    opacity: 0,
    y: 100
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

const user: NextPage<{ user: user }> = ({ user }) => {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState(user.recipes);
  const [select, setSelect] = useState({ value: "Ddate" });

  const handleChange = (e: any) => {
    setSelect({ value: e.target.value });
    let newArr = [...recipes];
    switch (select.value) {
      case "Ddate":
        newArr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        setRecipes(newArr);
        break;

      case "Adate":
        newArr.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        setRecipes(newArr);
        break;

      case "rating":
        newArr.sort((a, b) => a.rating - b.rating);
        setRecipes(newArr);
        break;
    }
  };

  return (
    <>
      <Head>
        <title>TeaTinker - {user.name}'s Profile</title>
        <link rel='shortcut icon' href={"/leaf.png"} type='image/x-icon' />
      </Head>
      <header>
        <Navbar />
      </header>

      <main className='px-8'>
        <div>{/* sidebar */}</div>
        <div className='flex gap-3 items-center'>
          <Image
            src={`${user.image}`}
            width={100}
            height={100}
            className='rounded-full'
          />
          <h1 className='text-5xl'>{user.name}</h1>
        </div>
        <motion.div
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          variants={variants}
          className='mt-6 relative'
        >
          <motion.div
            className='h-[2px] bg-slate-400'
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.h2 variants={vars} className='text-2xl flex gap-2 items-end'>
            Bio
            {session?.ref === user.id && (
              <Link href={"/users/edit"}>
                <a>
                  <FaPencilAlt className='hover:fill-slate-500 w-4 aspect-square pb-1' />
                </a>
              </Link>
            )}
          </motion.h2>
          <motion.p variants={vars}>{user.bio}</motion.p>
        </motion.div>

        <motion.div
          variants={{
            show: {
              transition: {
                staggerChildren: 0.5,
                delayChildren: 1.9
              }
            }
          }}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          className='mt-8 relative'
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className='h-[2px] bg-slate-400'
          />
          <div className='flex justify-between'>
            <motion.h2 variants={vars} className='text-2xl'>
              Recipes
            </motion.h2>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <label htmlFor='sort-order'>
                Sort by:{" "}
                <select
                  value={select.value}
                  onChange={(e) => handleChange(e)}
                  name='sort-order'
                >
                  <option value='Ddate'>Date (newest)</option>
                  <option value='Adate'>Date (oldest)</option>
                  <option value='rating'>Rating</option>
                </select>
              </label>
            </motion.div>
          </div>
          <motion.p variants={vars}>
            {user.recipes.length === 0 ? (
              <span>{user.name} hasn't posted anything yet</span>
            ) : (
              <motion.ul
                variants={{
                  show: {
                    transition: {
                      delayChildren: 2,
                      staggerChildren: 0.5
                    }
                  }
                }}
                initial='hidden'
                whileInView='show'
                viewport={{ once: true }}
              >
                {session?.ref === user.id
                  ? recipes.map((recipe: recipe) => {
                      return (
                        <motion.li variants={liVars} key={recipe.id}>
                          <Link href={`/recipes/${recipe.id}`}>
                            <a
                              className={`hover:underline ${
                                recipe.approved === false && "text-slate-500"
                              }`}
                            >
                              {recipe.title} <i>{recipe.date.slice(4, 15)}</i>{" "}
                              {recipe.approved === false && (
                                <span>*Awaiting Approval</span>
                              )}
                            </a>
                          </Link>
                        </motion.li>
                      );
                    })
                  : [...recipes]
                      .filter((_recipe) => _recipe.approved === true)
                      .map((recipe) => {
                        return (
                          <motion.li variants={liVars} key={recipe.id}>
                            <Link href={`/recipes/${recipe.id}`}>
                              <a className='hover:underline'>
                                {recipe.title} <i>{recipe.date.slice(4, 15)}</i>{" "}
                              </a>
                            </Link>
                          </motion.li>
                        );
                      })}
              </motion.ul>
            )}
          </motion.p>
        </motion.div>
        <motion.span
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.4 }}
          className='inline-block mt-6 text-slate-600 font-medium'
        >
          Joined on{" "}
          {user.dateJoined
            .toString()
            .slice(4, 10)
            .concat(`, ${user.dateJoined.toString().slice(11, 15)}`)}
        </motion.span>
      </main>
    </>
  );
};
export default user;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const refDoc = doc(db, "users", params!.user as string);
  const docSnap = await getDoc(refDoc);

  const user = {
    ...docSnap.data(),
    id: docSnap.id,
    dateJoined: docSnap.get("dateJoined").toDate().toString()
  };

  return {
    props: { user: user }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let users: any[] = [];
  const refCollection = collection(db, "users");
  const userDocs = await getDocs(refCollection);
  userDocs.docs.forEach((doc) => {
    users.push({
      ...doc.data(),
      id: doc.id
    });
  });
  const paths = users.map((user) => ({
    params: { user: user.id }
  }));
  return {
    paths: paths,
    fallback: false
  };
};
