import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion, motionValue } from "framer-motion";
import { HiArrowNarrowRight } from "react-icons/hi";
import Link from "next/link";
import { variants } from "./start";
import PageNavigator from "../components/PageNavigator";

const vars = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.3
    }
  }
};

const items = {
  hidden: {
    opacity: 0,
    y: 50
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

const Home: NextPage = () => {
  const x = motionValue("-100%");
  return (
    <>
      <Head>
        <title>TeaTinker | Home</title>
      </Head>
      <motion.main
        variants={variants}
        initial='hidden'
        animate='show'
        className='overflow-hidden'
      >
        <div className='relative w-screen h-screen text-white flex flex-col justify-center'>
          <motion.div
            className='flex flex-col gap-2 items-center text-center z-20 absolute left-2/4 -translate-x-2/4 matrix'
            variants={vars}
            initial='hidden'
            animate='show'
          >
            <motion.h1
              className='text-6xl min-w-[25ch] font-bold'
              variants={items}
            >
              One stop for all things tea
            </motion.h1>
            <motion.p variants={items}>
              Be prepared for a hot, perfect cup of tea
            </motion.p>
            <motion.button
              variants={items}
              className='p-[.5em] px-[1em] max-w-max rounded-md font-semibold bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
            >
              <a href='#scroll'>Get Started</a>
            </motion.button>
          </motion.div>
          <Image
            src={"/steamytea.jpg"}
            layout='fill'
            objectFit='cover'
            className='-z-50 absolute'
          />
        </div>
        <PageNavigator />
        <section className='pb-16' id='scroll'>
          <h2 className='mt-48 text-5xl font-medium text-center pb-14'>
            Why Tea?
          </h2>
          <div className='grid grid-cols-2 px-16 mx-auto items-center lg:w-[55rem]'>
            <p className='max-w-md text-2xl'>
              Tea provides many health benefits. Boosting your immune system,
              fighting off diseases, relieving motion sickness, and muscle
              spasms are just a few to name of what tea can do.
            </p>
            <Image
              src={"/teaclipart.jpg"}
              width={256}
              height={256}
              objectFit='contain'
              className='rounded-md'
            />
          </div>
          <motion.span
            transition={{ delay: 2 }}
            whileInView={{ x: -5 }}
            viewport={{ once: true }}
            onTap={() => x.set("-100%")}
            style={{ x }}
            className='absolute p-4 pl-12 rounded-r-md max-w-sm z-50 bg-amber-400 hover:bg-amber-300 cursor-pointer'
          >
            <strong>Did you know? </strong> Tea is the second most popular
            beverage in the world aside from water!
          </motion.span>
          <motion.div className='relative flex justify-end px-16 mt-16'>
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ transformOrigin: "left", scaleX: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className='md:w-3/5 lg:w-2/3 h-[2px] left-16 absolute top-6 bg-amber-600'
            />
            <motion.button
              initial={{ y: 110 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              transition={{ whileInView: { delay: 0.4, duration: 0.5 } }}
            >
              <Link href='/start'>
                <a className='bg-slate-200 rounded-md flex gap-2 items-center py-[.75em] px-[1.5em] font-semibold'>
                  Get started <HiArrowNarrowRight />
                </a>
              </Link>
            </motion.button>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
};

export default Home;
