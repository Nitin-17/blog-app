import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../spinner";

export default function SendOTP({
  page,
  setPage,
  setOtpMail,
  setOtpResponse,
  otpResponse,
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  // Define the Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const sendOtp = async (values, { setSubmitting }) => {
    let data;
    try {
      setStatus(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values?.email,
          otpLogin: true,
        }),
      });
      data = await response.json();
      if (data?.success) {
        setMessage(data);
        setStatus(false);
      } else {
        setMessage(data);
        setStatus(false);
        console.error("Failed to save user.");
        setStatus(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    /* If User found, then send OTP */
    if (data?.success) {
      setStatus(true);
      try {
        const res = await fetch("/api/generate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });
        const data = await res.json();
        if (data?.success) {
          setOtpResponse(data);
          setOtpMail(data?.email);
          setStatus(false);
          setPage(2);
        } else {
          setOtpResponse(data);
        }
      } catch (error) {
        console.error(error);
        setStatus(false);
        setMessage("An error occurred");
      } finally {
        setStatus(false);
        setSubmitting(false);
      }
    }
  };

  return (
    <>
      <section>
        <div className="flex flex-col items-center justify-center px-6 mb-36 mt-12">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
              <h1 className="text-xl text-gray-500 font-bold leading-tight tracking-tight md:text-2xl ">
                Sign in to your account
              </h1>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={sendOtp}
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium "
                      >
                        Your email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border placeholder-gray-400  border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter Your Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {!isSubmitting && !message?.sucess && (
                      <span className="mt-2 text-sm text-red-500">
                        {message?.message}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="w-full flex flex-row justify-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      disabled={isSubmitting || status}
                    >
                      {status ? <Spinner /> : <span>Send Otp</span>}
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
      </section>
    </>
  );
}
