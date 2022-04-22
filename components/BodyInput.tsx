import { multiForm } from "../pages/recipes/add";
import { Dispatch, SetStateAction, useState } from "react";
import { Reorder } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const BodyInput = ({
  body,
  setBody,
  bodyInput
}: {
  body: multiForm[];
  setBody: Dispatch<SetStateAction<multiForm[]>>;
  bodyInput: multiForm;
}) => {
  const [toggle, setToggle] = useState<boolean>(true);
  return (
    <Reorder.Item key={bodyInput.id} value={bodyInput} className='relative'>
      <div className='flex items-center gap-2'>
        <label htmlFor='steps'>Toggle step count </label>
        <input
          type='checkbox'
          name='steps'
          checked={toggle}
          onChange={() => {
            setToggle(!toggle);
            const arr = [...body];
            const target = body.findIndex(
              (element) => element.id === bodyInput.id
            );
            arr[target].checked = toggle;
            setBody(arr);
          }}
        />
      </div>
      <textarea
        required
        onChange={(e) => {
          const arr = [...body];
          const target = body.findIndex(
            (element) => element.id === bodyInput.id
          );
          arr[target].value = e.target.value;
          setBody(arr);
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        value={bodyInput.value}
        name={bodyInput.name}
        className={bodyInput.class}
        placeholder={bodyInput.placeholder}
      />
      <FaTimes
        onClick={() => {
          setBody(body.filter((_bodyInput) => _bodyInput.id != bodyInput.id));
        }}
        className='absolute cursor-pointer fill-red-500 hover:fill-red-600 top-1 right-0'
      />
    </Reorder.Item>
  );
};
export default BodyInput;
