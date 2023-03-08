import React, { ChangeEvent, useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
//@ts-ignore
import logo from "../../assets/logo-long.png";
import LoginButton from "./google/LoginButton";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/google-slice";
import { useNotification } from "../../hooks/useNotification";
import { useNavigate } from "react-router";
import ReactGA from "react-ga";

const Register = () => {
  // password and confirm password must match
  const [inputValues, setInputValues] = useState<any>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<any>({
    email: "",
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState<any>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [long, setLong] = useState<boolean>(false);
  const [secure, setSecure] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();

  const userProfile = useSelector(
    (state: any) => state.google.profileObject.email
  );

  useEffect(() => {
    if (isMatched && long && secure) {
      setPassword(inputValues.password);
    }
    if (validEmail) {
      setEmail(inputValues.email);
    }

    //  check if passwords match
    if (inputValues.password !== inputValues.confirmPassword) {
      setIsMatched(false);
    }
    if (inputValues.password === inputValues.confirmPassword) {
      setIsMatched(true);
    }

    if (inputValues.password.length < 8) {
      setLong(false);
    }
    if (inputValues.password.length >= 8) {
      setLong(true);
    }
    //  make sure password has one number and one capital letter
    if (!regex.test(inputValues.password)) {
      setSecure(false);
    }
    if (regex.test(inputValues.password)) {
      setSecure(true);
    }
  }, [
    inputValues.confirmPassword,
    inputValues.email,
    inputValues.password,
    isMatched,
    long,
    secure,
    validEmail,
  ]);

  const dispatch = useDispatch();
  const { notificationHandler } = useNotification();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (inputValues[name] === "") {
      setError({ ...error, [name]: true });
      setErrorMessage({ [name]: "This field is required" });
    }
    // check if email is valid
    if (name === "email" && !validateEmail(inputValues.email)) {
      setValidEmail(false);
      setError({ ...error, [name]: true });
      setErrorMessage({ [name]: "Invalid email" });
    }

    if (name === "email" && validateEmail(inputValues.email)) {
      setValidEmail(true);
      setError({ ...error, [name]: false });
      setErrorMessage({ [name]: "" });
    }

    if (name === "password" && inputValues[name].length < 8) {
      setError({ ...error, [name]: true });
      error.password &&
        setErrorMessage({
          ...errorMessage,
          [name]: "Password must be at least 8 characters",
        });
    }
    if (name === "password" && inputValues[name].length >= 8) {
      setError({ ...error, [name]: false });
    }
    // check if passwords match
    if (
      name === "confirmPassword" &&
      inputValues[name] !== inputValues.password
    ) {
      setError({ ...error, [name]: true });
      setErrorMessage({ ...errorMessage, [name]: "Passwords must match" });
    }
    if (
      name === "confirmPassword" &&
      inputValues[name] === inputValues.password
    ) {
      setError({ ...error, [name]: false });
      setErrorMessage({ ...errorMessage, [name]: "" });
    }
    if (
      name === "password" &&
      inputValues.confirmPassword === inputValues.password
    ) {
      setError({ ...error, [name]: false });
      setErrorMessage({ ...errorMessage, confirmPassword: "" });
    }
    //  make sure password has one number and one capital letter
    if (name === "password" && !regex.test(inputValues[name])) {
      setError({ ...error, [name]: true });
      setErrorMessage({
        ...errorMessage,
        [name]:
          "Password must contain at least one number, one capital letter, and one special character",
      });
    }
    if (name === "password" && regex.test(inputValues[name])) {
      setError({ ...error, [name]: false });
      setErrorMessage({ ...errorMessage, [name]: "" });
    }
  };

  const auth = getAuth();

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch(setUser(user));
        notificationHandler("You have successfully signed up", "Success", true);
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        notificationHandler(errorMessage, "Registration failed", true);
      });
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  return (
    <section className="login-background md:h-screen  flex justify-center items-center">
      <div className="flex flex-col gap-32 lg:gap-0 items-center justify-center lg:h-screen">
        <div className="flex flex-col justify-center items-center h-auto lg:w-96 w-80 bg-whole-page rounded-2xl">
          <div className=" mb-6 mt-6">
            <img className="lg:h-16 h-12" src={logo} alt="logo" />
          </div>

          <h3 className="text-white outfit-medium lg:text-[32px] text-[24px] lg:mb-6 mb-6">
            Register
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
                  onChange={inputHandler}
                  onBlur={handleOnBlur}
                  required
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
                  onChange={inputHandler}
                  onBlur={handleOnBlur}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {error.password ? (
                  <p className="text-redor text-[12px]">
                    {errorMessage.password}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  onChange={inputHandler}
                  onBlur={handleOnBlur}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {error.confirmPassword ? (
                  <p className="text-redor text-[12px]">
                    {errorMessage.confirmPassword}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                id="enter"
                type="button"
                className={`${
                  isMatched && long && secure && validEmail
                    ? "bg-redor"
                    : "bg-gray-500"
                } w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className=" w-full px-6 mb-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white page-bg">Or</span>
              </div>
            </div>
            <div className="w-full mt-4">
              <button
                onClick={() => navigate("/login")}
                type={"button"}
                className="bg-redor w-full flex justify-center py-2 mb-4 px-4 border border-transparent rounded-md shadow-sm text-sm outfit-medium text-white hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
