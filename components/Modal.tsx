import Image from "next/image";
import { useState, useEffect, SetStateAction, useRef } from "react";
import { tea } from "../pages/start";
import { MotionValue, motion } from "framer-motion";

const Modal = ({
  tea,
  setOpen,
  scroll
}: {
  tea: tea;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  scroll: MotionValue<number>;
}) => {
  const [mounted, setMounted] = useState(false);
  const bg = useRef(null);

  return (
    <div
      ref={bg}
      className='inset-0 bg-black bg-opacity-60 fixed z-[9999]'
      onClick={(e) => {
        if (e.target != bg.current) {
          return;
        }
        setOpen(false);
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className='bg-slate-200 lg:max-w-5xl rounded-md mx-auto p-5'
      >
        <h1 className='font-bold text-center text-3xl'>{tea.name}</h1>
        <div className='grid grid-cols-2 gap-5 mt-6'>
          <Image src={tea.image} width={500} height={500} objectFit='cover' />
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
    </div>
  );
};
export default Modal;
