import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";

const success = () => {
  return (
    <>
      <Head>
        <title>Recipe Submitted! - TeaTinker</title>
      </Head>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 1 }}
        className='grid place-items-center min-h-screen'
      >
        <div className='w-[50vw]'>
          <Image src={"/leaf.png"} layout='fill' objectFit='cover' />
        </div>
        <div>
          <motion.div>
            <FaCircle />
            <FaCircle />
            <FaCircle />
          </motion.div>
          <span
            className='inline-block text-center absolute z-50 text-xl
          left-1/2 -translate-x-1/2'
          >
            Thank you for submitting, Your submission is temporarily under
            review.
            <br />
            We will temporarily redirect you back to the recipes page
          </span>
        </div>
      </motion.main>
    </>
  );
};
export default success;
