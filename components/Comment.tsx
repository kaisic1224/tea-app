import { comment } from "../pages/recipes/[recipeId]";

const Comment = ({ comment }: { comment: comment }) => {
  return (
    <div className='bg-slate-200 p-6 rounded-md'>
      <div className='flex justify-between'>
        {comment.author}
        <div>{comment.rating}</div>
      </div>
      <p>{comment.body}</p>
    </div>
  );
};
export default Comment;
