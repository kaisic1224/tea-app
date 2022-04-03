import { GetStaticProps, NextPage } from "next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

const signin: NextPage<{ providers: any }> = ({ providers }) => {
  return (
    <>
      <Head>
        <title>Sign in - TeaTinker</title>
      </Head>
      <main className='grid place-items-center min-h-screen'>
        <form className='flex flex-col items-center justify-center'>
          {Object.values(providers).map((provider: any) => (
            <motion.input
              key={provider.name}
              whileHover={{ borderRadius: 15 }}
              initial={{ borderRadius: 7 }}
              className='cursor-pointer bg-amber-600 hover:bg-amber-700 p-[.75em] text-white font-bold'
              type='submit'
              value={`Sign in with ${provider.name}`}
              onClick={(e) => {
                e.preventDefault();
                signIn(provider.id, { callbackUrl: "/recipes" });
              }}
            />
          ))}
          <span className='font-bold'>
            Return{" "}
            <Link href='/recipes'>
              <a className='text-amber-500 hover:text-amber-400'>home</a>
            </Link>
          </span>
        </form>
      </main>
    </>
  );
};
export default signin;

export const getStaticProps: GetStaticProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers
    }
  };
};
