import Link from "next/link";
import React, { useState } from "react";
import ErrorModal from "../components/ui/modal/error-modal";
import SuccessModal from "../components/ui/modal/success-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { redirect } from "next/navigation";
import { Router, useRouter } from "next/router";
import Spinner from "../components/ui/spinner";
import SendOTP from "../components/ui/forms/send-otp-form";
import VerifyOTP from "../components/ui/forms/verify-otp-form";
import Cookies from "js-cookie";

const Login = () => {
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpMail, setOtpMail] = useState("");
  const [otpResponse, setOtpResponse] = useState(null);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOtpLogin = () => {
    setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setAuth({ token: "", success: false, name: "", userId: "" }));
    try {
      setStatus(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData?.email,
          password: formData?.password,
        }),
      });
      const data = await response.json();
      if (data?.success) {
        setMessage(data);
        const userRole = Cookies.get("userRole");
        console.log("userRole is", userRole);
        dispatch(
          setAuth({
            token: data?.token,
            success: userRole === "admin" ? true : false,
            name: data?.name,
            userId: data?.userId,
          })
        );

        //setStatus(false);
        setFormData({
          email: "",
          password: "",
          rememberMe: false,
        });
        router.push("/");
      } else {
        setMessage(data);
        setStatus(false);
        console.error("Failed to save user.");
        setStatus(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <section>
      {page == 0 && (
        <div className="flex flex-col items-center justify-center px-6 mx-auto mb-12">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-gray-500 font-bold leading-tight tracking-tight md:text-2xl ">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium "
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border placeholder-gray-400  border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    type={showPassword === false ? "password" : "text"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="password"
                    className="bg-gray-50 border placeholder-gray-400  border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />

                  <span
                    className="absolute right-2 top-10 cursor-pointer "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      size="xs"
                    />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-500 hover:underline hover:text-primary-600 dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full flex flex-row justify-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  {status ? <Spinner /> : <span>Sign in</span>}
                </button>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-light text-primary-600 dark:text-gray-400">
                    Don’t have an account yet?
                    <Link href="/signup" legacyBehavior>
                      <a
                        href="/signup"
                        className="font-medium text-primary-600 hover:underline"
                      >
                        Sign up
                      </a>
                    </Link>
                  </p>
                  <span
                    onClick={handleOtpLogin}
                    className="text-sm font-light hover:underline hover:text-gray-600 cursor-pointer text-primary-600 dark:text-gray-400"
                  >
                    Login into account using OTP
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div>
        {page == 1 && (
          <SendOTP
            setPage={setPage}
            page={page}
            setOtpMail={setOtpMail}
            otpMail={otpMail}
            otpResponse={otpResponse}
            setOtpResponse={setOtpResponse}
          />
        )}
      </div>
      <div>
        {page == 2 && (
          <VerifyOTP
            setPage={setPage}
            page={page}
            setOtpMail={setOtpMail}
            otpMail={otpMail}
            otpResponse={otpResponse}
            setOtpResponse={setOtpResponse}
          />
        )}
      </div>
      {message?.success == false ? (
        <ErrorModal message={message} setMessage={setMessage} />
      ) : (
        <SuccessModal message={message} setMessage={setMessage} />
      )}
    </section>
  );
};

export default Login;
