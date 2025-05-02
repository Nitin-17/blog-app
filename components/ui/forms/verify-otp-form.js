import { use, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import Spinner from "../spinner";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ErrorModal from "../modal/error-modal";
import SuccessModal from "../modal/success-modal";

export default function VerifyOTP({
  otpMail,
  setOtpMail,
  setPage,
  otpResponse,
  setOtpResponse,
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const validationSchema = Yup.object({
    otp: Yup.number()
      .typeError("OTP must be a number")
      .required("OTP is required")
      .test(
        "is-six-digits",
        "OTP must be exactly 6 digits",
        (value) => value && value.toString().length === 6
      ),
  });
  const verifyOtp = async (values) => {
    let data;
    setStatus(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpMail, otp: values?.otp }),
      });
      data = await res.json();
      if (data?.success) {
        setMessage(data);
        setStatus(false);
      } else {
        setMessage(data);
        setStatus(false);
      }
    } catch (error) {
      console.error(error);
      setStatus(false);
      setMessage("An error occurred");
    }

    /* Calling Login API to fetch the user details */
    if (data?.success) {
      try {
        setStatus(true);
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: otpMail,
            isUserVerified: data?.success,
          }),
        });
        data = await response.json();
        if (data?.success) {
          setLoginMessage(data);
          dispatch(
            setAuth({
              token: data?.token,
              success: true,
              name: data?.name,
              userId: data?.userId,
            })
          );
          setStatus(false);
          setLoginMessage({
            message: "Login Successfull! redirecting to the home page",
            success: true,
          });
          router.push("/");
        } else {
          setLoginMessage(data);
          setStatus(false);
          console.error("Failed to save user.");
          setStatus(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <section>
        <div className="flex flex-col items-center justify-center px-6 mb-36 mt-12">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
              <div className="flex flex-col gap-2">
                <nav className="flex flex-row justify-between pt-2 pb-4">
                  <span
                    className="text-gray-600 cursor-pointer"
                    onClick={() => setPage(1)}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                  </span>
                  <h1 className="text-xl text-gray-500 font-bold leading-tight tracking-tight md:text-2xl ">
                    Verify OTP
                  </h1>
                  <span></span>
                </nav>

                <span className="text-sm">
                  {otpResponse?.message}{" "}
                  <span className="text-gray-700 font-semibold">
                    {otpResponse?.email}
                  </span>
                </span>
              </div>

              <Formik
                initialValues={{ otp: "" }}
                validationSchema={validationSchema}
                onSubmit={verifyOtp}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block mb-2 text-sm font-medium "
                      >
                        Enter OTP
                      </label>
                      <Field
                        type="text"
                        name="otp"
                        id="otp"
                        className="bg-gray-50 border placeholder-gray-400  border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter 6-digit OTP"
                      />
                      <ErrorMessage
                        name="otp"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {!isSubmitting && message && message?.message !== "" && (
                      <span className="text-sm text-red-600">
                        {message?.message}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="w-full flex flex-row justify-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      disabled={isSubmitting || status}
                    >
                      {status ? <Spinner /> : <span>Verify Otp</span>}
                    </button>

                    <div className="flex flex-col gap-2">
                      <span
                        onClick={() => setPage(0)}
                        className="text-sm font-light hover:underline hover:text-gray-600 cursor-pointer text-primary-600 dark:text-gray-400"
                      >
                        Login into account using Password
                      </span>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        {loginMessage?.success == false ? (
          <ErrorModal message={loginMessage} setMessage={setLoginMessage} />
        ) : (
          <SuccessModal message={loginMessage} setMessage={setLoginMessage} />
        )}
      </section>
    </div>
  );
}
