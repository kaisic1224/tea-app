import { NextPage } from "next";
import Head from "next/head";
import {
  AnimatePresence,
  motion,
  motionValue,
  useViewportScroll
} from "framer-motion";
import { GetStaticProps } from "next";
import PageNavigator from "../components/PageNavigator";
import { db } from "../firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Modal from "../components/Modal";

export const variants = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      duration: 1.5,
      delayChildren: 2
    }
  }
};

const header = {
  hidden: {
    opacity: 0,
    x: "-100%"
  },
  show: {
    opacity: 1,
    x: "3%",
    transition: {
      type: "spring",
      duration: 1.25
    }
  }
};

export interface tea {
  name: string;
  image: string;
  description: string;
  keywords: string;
  origin: string;
  brew_time: number;
  temperature: number;
}

const debounce = (callback: Function, delay = 3000) => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(args);
    }, delay);
  };
};

const Start: NextPage<{ teas: tea[] }> = ({ teas }) => {
  const [search, setSearch] = useState<string>("");
  const [recTeas, setTeas] = useState<tea[]>([]);
  const [open, setOpen] = useState(false);
  const [mTea, setMTea] = useState<tea>();
  const [offset, setOffset] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const showTeas: tea[] = [];
    teas.forEach((tea) => {
      if (tea.keywords.split(", ").includes(search)) {
        showTeas.push(tea);
      }
    });
    setTeas(showTeas);
  };

  // useEffect(() => {
  //   debouncedTeas();
  // }, [search]);

  // const debouncedTeas = useCallback(() => {
  //   debounce(() => {
  //     setTeas(teas.filter((tea) => {
  //       tea.keywords.split(', ').includes(search)
  //     }))
  //   });
  // }, []);

  return (
    <>
      <Head>
        <title>Start Brewing - TeaTinker</title>
      </Head>

      <motion.main
        variants={variants}
        initial='hidden'
        animate='show'
        className={`overflow-hidden min-h-screen ${
          open && "inset-0 fixed overflow-y-scroll invis-scroll"
        }`}
        style={open ? { top: `-${offset}px` } : {}}
      >
        <AnimatePresence exitBeforeEnter>
          {open && <Modal tea={mTea!} setOpen={setOpen} offset={offset} />}
        </AnimatePresence>
        <div className='w-full h-40 bg-amber-400 flex items-center'>
          <motion.h1
            variants={header}
            initial='hidden'
            animate='show'
            className='text-6xl font-bold transition-colors duration-300 uppercase cursor-default hover:text-white'
          >
            Personalized Tea Builder
          </motion.h1>
        </div>
        <PageNavigator />
        <div className='px-16 mx-auto text-center'>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor='tea' className='font-semibold'>
              Get started by looking through some teas!
            </label>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className='relative flex items-center mx-auto mt-4 lg:max-w-3xl'
            >
              <FaSearch className='absolute left-3' />
              <input
                className='focus:outline-none w-full p-3 pl-9 rounded-full shadow-md bg-slate-50 hover:bg-slate-100'
                type='text'
                id='tea'
                placeholder='ex. heart disease, cancer, weight loss, etc.'
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
              />
            </motion.div>
          </form>
          <AnimatePresence exitBeforeEnter>
            <motion.div className='grid grid-cols-4 gap-4 my-5 relative'>
              {recTeas.length != 0 ? (
                recTeas.map((tea) => {
                  return (
                    <motion.div
                      key={tea.name}
                      initial={{ opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "100%" }}
                      className='group overflow-hidden cursor-pointer'
                      onClick={(e) => {
                        e.preventDefault();
                        setMTea(tea);
                        setOffset(window.scrollY);
                        setOpen(!open);
                      }}
                    >
                      <Image
                        src={tea.image}
                        alt={`Picture of ${tea.name}`}
                        width={400}
                        height={400}
                        objectFit='cover'
                        className='group-hover:scale-110 transition-transform'
                      />
                      <span className='font-semibold'>{tea.name}</span>
                    </motion.div>
                  );
                })
              ) : (
                <span className='mt-5 font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute'>
                  Search for a tea
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let teas: any = [];
  const teaCollection = collection(db, "teas");
  await getDocs(teaCollection)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        teas.push({ ...doc.data(), id: doc.id });
      });
    })
    .catch((err) => console.error(err));
  return {
    props: { teas: teas }
  };
};

export default Start;
