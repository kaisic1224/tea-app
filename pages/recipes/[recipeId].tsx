import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Comment from "../../components/Comment";
import Navbar from "../../components/Navbar";
import { db, storage } from "../../firebase/clientApp";
import type { recipe } from "./index";

export interface comment {
  id: string;
  rating: number;
  body: string;
  author: string;
  authorId: string;
  date: string;
}

const recipeId = ({
  recipe,
  comments
}: {
  recipe: recipe;
  comments: comment[];
}) => {
  const released = new Date(recipe.date);
  const [img, setImg] = useState<string>();
  useEffect(() => {
    console.log(recipe.imageRef);
    const imgRef = ref(storage, recipe.imageRef);
    getDownloadURL(imgRef).then((url) => {
      setImg(url);
    });
  }, []);

  return (
    <>
      <Head>
        <title>{recipe.title} | TeaTinker</title>
        <link rel='shortcut icon' href='/leaf.png' type='image/x-icon' />
      </Head>
      <header className='mx-auto lg:w-[970px] xl:w-[1240px]'>
        <Navbar />
      </header>
      <main className='px-8 pb-10 mx-auto lg:w-[970px] xl:w-[1240px]'>
        <h1 className='mt-8 text-5xl'>{recipe.title}</h1>
        <div className='flex justify-between'>
          <div className='flex space-x-3 text-lg items-center'>
            <Link href={`/users/${recipe.authorId}`}>
              <a className='hover:underline'>
                <i>{recipe.author}</i>
              </a>
            </Link>
            <div className='flex text-slate-600 items-center relative '>
              <FaStar className='fill-slate-800' />
              <FaStar className='fill-slate-800' />
              <FaStar className='fill-slate-800' />
              <FaStar className='fill-slate-400' />
              <FaStar className='fill-slate-400' />
              <span className='ml-3'>{recipe.rating}/10</span>
            </div>
          </div>
          {`${released.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}`}
        </div>
        <img src={img} className='aspect-video w-full object-cover' />
        <ul className='list-disc px-8'>
          {recipe.prep.map((prep) => (
            <li key={prep}>{prep}</li>
          ))}
        </ul>
        {recipe.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <h2>Comments</h2>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const docRef = doc(db, "recipes", params!.recipeId as string);
  const recipeRef = await getDoc(docRef);
  const recipe = {
    ...recipeRef.data(),
    id: recipeRef.id,
    date: recipeRef.get("date").toDate().toString()
  };
  const commentRef = collection(db, `recipes/${params!.recipeId}/comments`);
  const comments: any[] = [];
  const commentDocs = await getDocs(commentRef);
  commentDocs.docs.forEach((doc) => {
    comments.push({
      ...doc.data(),
      id: doc.id,
      date: doc.get("date").toDate().toString()
    });
  });
  return {
    props: { recipe: recipe, comments: comments }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let recipes: any[] = [];
  const colRef = collection(db, "recipes");
  const recipeDocs = await getDocs(colRef);
  recipeDocs.docs.forEach((doc) => {
    recipes.push({ id: doc.id });
  });
  let paths = recipes.map((recipe) => ({
    params: { recipeId: recipe.id }
  }));
  return {
    paths,
    fallback: false
  };
};

export default recipeId;
