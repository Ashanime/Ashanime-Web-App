import React, { useEffect, useState } from "react";
//@ts-ignore
import logo from "../../assets/logo-long.png";
import { useNavigate } from "react-router";
import LoginButton from "./google/LoginButton";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from "../../redux/google-slice";
import { useNotification } from "../../hooks/useNotification";
import { Link } from "react-router-dom";
import { SignInAnonymously, SignInWithGoogle } from "../../firebase/Firebase";
import ReactGA from "react-ga";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.google.profileObject);
  const userSignedIn = typeof localStorage.getItem("user") === "string";
  const { notificationHandler } = useNotification();

  useEffect(() => {
    //  Go to home page if user is already signed in
    !userSignedIn && navigate("/login" || "/register");
    userSignedIn && navigate("/home");
  }, [userSignedIn, userProfile, navigate]);

  const auth = getAuth();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        notificationHandler(errorMessage, "Login failed", true);
      });
  };

  return (
    <section className="login-background md:h-screen flex justify-center items-center">
      <div className="flex flex-col gap-32 lg:gap-0 items-center justify-center lg:h-screen">
        <div className="flex flex-col justify-center items-center h-auto lg:w-96 w-80 bg-whole-page rounded-2xl">
          <div className=" mb-6 mt-6">
            <img className="lg:h-16 h-12" src={logo} alt="logo" />
          </div>
          <h2 className="text-white outfit-medium lg:text-[28px] text-[24px] lg:mb-6 mb-6 flex flex-col items-center">
            Stream Anime
            <p className="text-redor outfit-medium lg:text-[28px] text-[24px]">
              &nbsp;No Ads
            </p>
          </h2>
          <h3 className="text-white outfit-medium lg:text-[32px] text-[24px] lg:mb-6 mb-6">
            Login
          </h3>

          {/*username and password fields*/}
          <form className="space-y-6 w-full px-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full  py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-white hover:brightness-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white bg-redor hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className=" w-full px-6 mb-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white page-bg">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="w-full mt-4">
              <LoginButton content="Login with Google" />
              <button
                type="button"
                onClick={async () => {
                  await SignInAnonymously(dispatch);
                }}
                className="w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white bg-redor hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in anonymously
              </button>
            </div>
            {/*  SIGN UP NOW*/}
            <div className="flex justify-center items-center">
              <div className="outfit-medium text-white text-[16px]">
                <span>New to Ashanime?</span>
                <br />
                <a
                  href="/register"
                  className="font-medium flex justify-center text-redor hover:brightness-200"
                >
                  Sign up now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
