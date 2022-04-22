import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import { FaStar } from "react-icons/fa";
import { multiForm } from "../pages/recipes/add";

const Preview = ({
  title,
  fLink,
  ingredients,
  body
}: {
  title: string;
  fLink: String | ArrayBuffer | null | undefined;
  ingredients: multiForm[];
  body: multiForm[];
}) => {
  const { data: session } = useSession();
  const today = new Date();

  return (
    <>
      <Navbar />
      <article className='px-8'>
        <h1 className='text-2xl'>
          {title.length === 0 ? "Title Here" : title}
        </h1>
        <div className='flex justify-between'>
          <span className='flex items-center space-x-2'>
            <i>{session?.user?.name}</i>
            <div className='flex items-center'>
              <FaStar className='fill-slate-400' />
              <FaStar className='fill-slate-400' />
              <FaStar className='fill-slate-400' />
              <FaStar className='fill-slate-400' />
              <FaStar className='fill-slate-400' />
              <span className='inline-block ml-3'>0 / 10</span>
            </div>
          </span>
          <span>{`${today.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}`}</span>
        </div>
        <img
          src={`${fLink}`}
          alt='article thumbnail'
          className='object-cover aspect-video rounded-sm'
        />
        <h2 className='text-lg font-medium'>Preparation</h2>
        <p className='ml-6'>
          {ingredients.length === 0 ? (
            <li>Your preparation here</li>
          ) : (
            ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.value.includes("*") &&
                  console.log(ingredient.value.split("*"))}
                {ingredient.value.includes("*")
                  ? ingredient.value.split("*")
                  : ingredient.value}
              </li>
            ))
          )}
        </p>
        <h2 className='text-lg font-medium'>Instructions</h2>
        <div className='flex flex-col gap-6'>
          {body.length === 0 ? (
            <p>Your content here</p>
          ) : (
            body.map((_body) => (
              <div className='flex flex-col flex-wrap'>
                {!_body.checked && (
                  <h3 className='text-base font-medium'>
                    Step {body.findIndex((element) => element === _body) + 1}
                  </h3>
                )}
                <p
                  className='first-letter:text-5xl first-letter:text-amber-400 first-letter:float-left
                first-letter:px-1 first-letter:font-serif
                 whitespace-pre-wrap max-w-lg'
                >
                  {_body.value}
                </p>
              </div>
            ))
          )}
        </div>
        <h2 className='text-lg font-medium'>Comments</h2>
        <div></div>
      </article>
    </>
  );
};
export default Preview;
