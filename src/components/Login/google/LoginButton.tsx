import { SignInWithGoogle } from "../../../firebase/Firebase";
import { useAppDispatch } from "../../../redux/store";

interface props {
  content: string;
}

const LoginButton = (props: props) => {
  const dispatch = useAppDispatch();

  return (
    <button
      className="w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white bg-redor hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={async () => {
        await SignInWithGoogle(dispatch);
      }}
    >
      <p className="text-white outfit-medium">{props.content}</p>
    </button>
  );
};

export default LoginButton;
