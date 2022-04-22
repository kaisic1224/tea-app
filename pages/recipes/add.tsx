import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { FaPlus, FaRegTimesCircle, FaStar, FaUpload } from "react-icons/fa";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/clientApp";
import { useSession } from "next-auth/react";
import { AnimatePresence, Reorder } from "framer-motion";
import Ingredient from "../../components/Ingredient";
import BodyInput from "../../components/BodyInput";
import Preview from "../../components/Preview";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";

export interface multiForm {
  type: string;
  name: string;
  class: string;
  placeholder: string;
  id: string;
  value: string;
  checked?: boolean;
}

const addrecipe = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<multiForm[]>([]);
  const [ingredients, setIngredients] = useState<multiForm[]>([]);
  const [file, setFile] = useState<File>();
  const [fLink, setfLink] = useState<String | ArrayBuffer | null>();

  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const formData = new FormData(formRef.current!);
    const storageRef = ref(
      storage,
      `recipe-thumbnails/${session?.ref}/${file?.name}`
    );
    if (
      formData.getAll("prep").length === 0 ||
      formData.getAll("body").length === 0
    )
      alert("Please add all required fields");
    await uploadBytes(storageRef, file!);
    const recipes = collection(db, "recipes");
    await addDoc(recipes, {
      author: session?.user?.name,
      authorId: session?.ref,
      imageRef: storageRef.fullPath,
      body: formData.getAll("body"),
      date: serverTimestamp(),
      prep: formData.getAll("prep"),
      rating: 0,
      title: title,
      approved: false
    });
    router.push("/recipes/success");
  };

  useEffect(() => {
    if (file) {
      const fr = new FileReader();
      fr.onload = () => {
        setfLink(fr.result);
      };
      fr.readAsDataURL(fileRef.current!?.files![0]);
    }
    return () => {};
  }, [file]);

  return (
    <>
      <Head>
        <title>Add a Recipe | TeaTinker</title>
        <link rel='shortcut icon' href={"/leaf.png"} type='image/x-icon' />
      </Head>

      <header>
        <Navbar />
      </header>

      <main className='px-8 grid grid-cols-2 gap-8 pb-8'>
        <section>
          <h1 className='text-6xl'>Add a recipe</h1>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className='flex flex-col gap-2 mt-6'
          >
            <label htmlFor='title' className='text-2xl font-bold'>
              Title
            </label>
            <input
              type='text'
              name='title'
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={4}
              maxLength={35}
              placeholder='Add a title'
              className='text-form max-w-[40ch]'
            />
            <div className='flex flex-col'>
              <label htmlFor='prep' className='text-2xl font-bold'>
                Preperation
              </label>
              <span>
                add '*' to bold
                <br /> add '_' to underline
              </span>
              <AnimatePresence exitBeforeEnter>
                <Reorder.Group
                  axis='y'
                  values={ingredients}
                  onReorder={setIngredients}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  className={`flex flex-col gap-2 w-fit bg-slate-100 transition-all duration-300 ${
                    ingredients.length === 0 ? "" : "p-2"
                  }`}
                >
                  {ingredients.map((ingredient) => (
                    <Ingredient
                      key={ingredient.id}
                      ingredient={ingredient}
                      setIngredients={setIngredients}
                      ingredients={ingredients}
                    />
                  ))}
                </Reorder.Group>
              </AnimatePresence>

              <div
                onClick={() => {
                  setIngredients([
                    ...ingredients,
                    {
                      type: "text",
                      name: "prep",
                      class: "text-form max-w-sm",
                      placeholder: "Add an Ingredient",
                      id: Math.floor(Math.random() * 1000).toString(),
                      value: ""
                    }
                  ]);
                }}
                className='add-btn'
              >
                Add
                <FaPlus className='fill-white' />
              </div>
            </div>
            <label htmlFor='body' className='text-2xl font-bold'>
              Body
            </label>
            <AnimatePresence exitBeforeEnter>
              <Reorder.Group
                axis='y'
                values={body}
                onReorder={setBody}
                dragConstraints={{ top: 0, bottom: 0 }}
                className='flex flex-col gap-2'
              >
                {body.map((bodyInput) => (
                  <BodyInput
                    key={bodyInput.id}
                    bodyInput={bodyInput}
                    setBody={setBody}
                    body={body}
                  />
                ))}
              </Reorder.Group>
            </AnimatePresence>
            <div
              onClick={() => {
                setBody([
                  ...body,
                  {
                    type: "text",
                    name: "body",
                    class: "resize-none text-form w-full",
                    id: Math.floor(Math.random() * 1000).toString(),
                    placeholder: "Add some instructions",
                    value: ""
                  }
                ]);
              }}
              className='add-btn'
            >
              Add
              <FaPlus className='fill-white' />
            </div>
            <span className='text-2xl font-bold'>Add a picture</span>
            {file && (
              <div className='relative max-w-lg group'>
                <img
                  src={`${fLink}`}
                  alt=''
                  className='object-cover rounded-lg shadow-xl'
                />
                <FaRegTimesCircle
                  onClick={() => {
                    setFile(undefined);
                    setfLink(undefined);
                    fileRef.current!.value = "";
                  }}
                  className='absolute cursor-pointer rounded-full bg-slate-50 w-6 h-6 -top-2 -right-2'
                />
                <span className='absolute delay-200 group-hover:scale-100 scale-0 transition-transform'>
                  {file.name}
                </span>
              </div>
            )}
            <label
              htmlFor='image'
              className='font-semibold py-3 lg:py-6
              hover:bg-slate-100 text-lg flex flex-col justify-center cursor-pointer items-center'
            >
              Browse <FaUpload />
            </label>

            <input
              ref={fileRef}
              onChange={() => setFile(fileRef?.current!?.files![0])}
              type='file'
              name='image'
              id='image'
              accept='image/*'
              className='hidden'
            />
            <input
              type='submit'
              value='Post!'
              className='add-btn px-16 py-3 mx-auto text-xl'
            />
          </form>
        </section>
        <section className='pointer-events-none select-none'>
          <Preview
            title={title}
            ingredients={ingredients}
            body={body}
            fLink={fLink}
          />
        </section>
      </main>
    </>
  );
};
export default addrecipe;
