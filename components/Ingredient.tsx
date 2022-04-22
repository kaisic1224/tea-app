import { Reorder, useDragControls } from "framer-motion";
import React, { SetStateAction } from "react";
import { FaCaretRight, FaTimes } from "react-icons/fa";
import { multiForm } from "../pages/recipes/add";

const Ingredient = ({
  ingredient,
  setIngredients,
  ingredients
}: {
  setIngredients: React.Dispatch<SetStateAction<multiForm[]>>;
  ingredient: multiForm;
  ingredients: multiForm[];
}) => {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      key={ingredient.id}
      value={ingredient}
      className='flex items-center relative w-fit'
    >
      <FaCaretRight
        onPointerDown={(e) => dragControls.start(e)}
        className='cursor-grab w-4 h-4 peer active:cursor-grabbing'
      />
      <input
        onChange={(e) => {
          const arr = [...ingredients];
          const target = ingredients.findIndex(
            (element) => element.id === ingredient.id
          );
          arr[target].value = e.target.value;
          setIngredients(arr);
        }}
        type={`${ingredient.type}`}
        name={`${ingredient.name}`}
        required
        value={ingredient.value}
        className={`${ingredient.class} peer-hover:bg-slate-50 peer-active:bg-slate-200`}
        placeholder={`${ingredient.placeholder}`}
      />
      <FaTimes
        onClick={() => {
          setIngredients(
            ingredients.filter((ingredienti) => ingredient.id != ingredienti.id)
          );
        }}
        className='absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer fill-red-400 hover:fill-red-600'
      />
    </Reorder.Item>
  );
};
export default Ingredient;
