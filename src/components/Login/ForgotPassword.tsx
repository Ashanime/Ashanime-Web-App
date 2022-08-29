import React, { useState } from "react";
//@ts-ignore
import logo from "../../assets/logo-long.png";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNotification } from "../../hooks/useNotification";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { notificationHandler } = useNotification();

  const resetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        notificationHandler("Password reset email sent", "Success", true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        notificationHandler(errorMessage, "password reset failed", true);
        // ..
      });
  };

  return (
    <section className="login-background md:h-screen flex justify-center items-center">
      <div className="flex flex-col gap-32 lg:gap-0 items-center justify-center lg:h-screen">
        <div className="flex flex-col justify-center items-center h-auto lg:w-96 w-80 bg-whole-page rounded-2xl">
          <div className=" mb-6 mt-6">
            <Link to="/login" className="cursor-pointer">
              <img className="lg:h-16 h-12" src={logo} alt="logo" />
            </Link>
          </div>

          <h3 className="text-white outfit-medium lg:text-[32px] text-[24px] lg:mb-6 mb-6">
            Password Reset
          </h3>
          {/*username and password fields*/}
          <form className="space-y-6 w-full px-6" action="#" method="POST">
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full  py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={resetPassword}
                className="w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white bg-redor hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
              <Link to="/login">
                <button
                  type="button"
                  className="w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white bg-redor hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to login
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default ForgotPassword;
