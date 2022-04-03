import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const Recipe = () => {
  return (
    <div className='justify-self-center shadow-md'>
      <Link href={`/recipes/pepe`}>
        <a>
          <Image
            className='blur-[1px] hover:blur-0 transition-all scale-110 hover:scale-100'
            src={"/green.jpg"}
            width={500}
            height={500}
            objectFit='cover'
          />
          <div className='flex justify-between cursor-default px-3'>
            <h3 className='cursor-pointer font-bold hover:text-amber-600'>
              Awesome Green Tea
            </h3>
            <div className='flex gap-0.5'>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
          </div>
        </a>
      </Link>
      <Link href={"/users/axd"}>
        <div className='flex gap-2 cursor-pointer pl-3 max-w-fit'>
          <i className='hover:underline'>i am the author</i>
          <Image
            src={`/white.jpg`}
            objectFit='cover'
            width={25}
            height={25}
            className='rounded-full aspect-square'
          />
        </div>
      </Link>
    </div>
  );
};
export default Recipe;
