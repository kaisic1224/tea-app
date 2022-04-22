import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const Recipe = () => {
  return (
    <div className='justify-self-center shadow-md pb-2'>
      <Link href={`/recipes/GdogKEYtLR3Zo5BadJ46`}>
        <a className='group'>
          <Image
            className='transition-all scale-105 group-hover:scale-100'
            src={"/green.jpg"}
            width={500}
            height={500}
            objectFit='cover'
          />
          <div className='flex justify-between cursor-default px-3'>
            <h3 className='cursor-pointer font-bold group-hover:text-amber-600'>
              Awesome Green Tea
            </h3>
            <div className='flex gap-0.5 pointer-events-none'>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
          </div>
        </a>
      </Link>
      <Link href={"/users/WZV5KpPZTedbqtZ6LOu8"}>
        <a className='flex group gap-2 cursor-pointer pl-3 max-w-fit'>
          <i className='group-hover:underline'>i am the author</i>
          <Image
            src={`/white.jpg`}
            objectFit='cover'
            width={25}
            height={20}
            className='rounded-full aspect-square'
          />
        </a>
      </Link>
    </div>
  );
};
export default Recipe;
