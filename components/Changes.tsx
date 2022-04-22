import { AnimatePresence, motion } from "framer-motion";
import { FaRegCheckCircle } from "react-icons/fa";
import { useState } from "react";

const Changes = ({ state }: { state: boolean }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {state && (
        <motion.div
          initial={{ y: "-10rem" }}
          animate={{ y: 0 }}
          exit={{ y: "-10rem" }}
          style={{ left: "50%", translateX: "-50%" }}
          className='absolute z-50 flex gap-3 bg-slate-100 shadow-lg p-12 py-8 rounded-md items-center font-bold text-green-400'
        >
          <FaRegCheckCircle /> Changes saved
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Changes;
