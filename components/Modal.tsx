import Image from "next/image";
import { useState, useEffect, SetStateAction, useRef } from "react";
import { tea } from "../pages/start";
import { motion } from "framer-motion";

const Modal = ({
  tea,
  setOpen,
  offset
}: {
  tea: tea;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  offset: number;
}) => {
  const [mounted, setMounted] = useState(false);
  const bg = useRef(null);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      ref={bg}
      className='inset-0 bg-black transition-colors bg-opacity-60 fixed z-[9999]'
      onClick={async (e) => {
        if (e.target != bg.current) {
          return;
        }
        await setOpen(false);
        window.scrollTo(0, offset);
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className='bg-slate-200 lg:max-w-5xl rounded-md mx-auto p-7 overflow-hidden relative'
      >
        <div className='absolute bg-slate-700 h-full top-0 right-0 w-8 ' />
        <h1 className='font-bold text-center text-3xl'>{tea.name}</h1>
        <div className='grid grid-cols-2 gap-7 mt-6'>
          <div className='relative'>
            <div className='absolute bg-slate-700 -translate-y-4 translate-x-4 right-0 w-2/4 aspect-square' />
            <div className='absolute w-2/4 aspect-video bg-slate-700 top-2/4 -translate-x-52 ' />
            <Image src={tea.image} width={500} height={500} objectFit='cover' />
          </div>
          <p className='text-xl flex justify-between flex-col'>
            {tea.description}
            <div>
              <p>
                Best brewed at:{" "}
                <strong>
                  {tea.temperature}
                  &#8451;
                </strong>{" "}
                for <strong>{tea.brew_time} minutes</strong>
              </p>
              <p>
                Origin: <strong>{tea.origin}</strong>
              </p>
            </div>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Modal;
