import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { FaArrowLeft, FaPencilAlt, FaRegCheckCircle } from "react-icons/fa";
import Changes from "../../components/Changes";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase/clientApp";
import user from "./[user]";

const edit = () => {
  const [bio, setBio] = useState("");
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleChanges = async () => {
    const userDoc = doc(db, "users", session?.ref as string);
    const xDoc = await getDoc(userDoc);
    // if (xDoc.get("lastPosted")) {
    //   if (Date.now)
    // }
    setDoc(userDoc, { bio: bio }, { merge: true });
  };

  const callbackChanges = useCallback(() => {
    handleChanges();
  }, [bio]);

  const openToast = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Edit Profile - TeaTinker</title>
      </Head>

      <header>
        <Navbar />
      </header>

      <main className='px-8 relative'>
        <div
          onClick={() => router.back()}
          className='cursor-pointer flex gap-3 items-center font-medium hover:text-amber-500'
        >
          <FaArrowLeft /> Back to Profile
        </div>
        <Changes state={open} />
        <h1 className='text-center text-5xl'>Edit your profile</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            callbackChanges();
            openToast();
          }}
          className='flex justify-center flex-col items-center gap-4 mt-6'
        >
          <div className='flex gap-6'>
            <label className='flex gap-2 items-center text-xl'>
              Edit Bio <FaPencilAlt />
            </label>
            <textarea
              value={bio}
              required
              onChange={(e) => {
                setBio(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              placeholder='Say something about yourself'
              className='text-form min-w-[25rem] rounded-md resize-none'
            />
          </div>
          <input
            type='submit'
            className='rounded-md shadow-md bg-slate-100 cursor-pointer py-2 px-5 font-medium hover:bg-slate-200'
            value='Save Changes'
          />
        </form>
      </main>
    </>
  );
};
export default edit;
