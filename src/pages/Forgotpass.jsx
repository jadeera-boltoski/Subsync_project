import { useState } from "react";
import { useFormik } from "formik";
import validationforget from "../validation/yup";
import { sendemail } from "../services/allapi";

function Forgotpass() {
  const [loading, setLoading] = useState(false); //  Loading state
  const [message, setMessage] = useState(""); //  Success/Error message
  const [messageType, setMessageType] = useState(""); //  "success" or "error"

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationforget,
    onSubmit: async (values) => {
      setLoading(true);
      setMessage(""); // Reset message on new submission

      try {
        const response = await sendemail(values);
        console.log(response);
        
        if (response.status === 200) {
          setMessage("Please check your email for the password reset link.");
          setMessageType("success");
        } else {
          throw new Error("Something went wrong. Please try again.");
        }
      } catch (error) {
        setMessage(error.message || "Failed to send email. Try again.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-lg p-10 bg-white rounded-lg shadow-2xl relative min-h-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">Reset your password</h1>
          <p className="text-gray-600 text-sm px-8">
            Forgot your password? Enter your email, and we&apos;ll send you a reset link.
          </p>
        </div>

        {/*  Display Success/Error Message */}
        {message && (
          <div
            className={`text-sm font-medium p-3 rounded-md mb-4 ${
              messageType === "success" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="px-4">
          <div className="mb-4">
            <input
              type="text"
              name="email"
              placeholder="EMAIL"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-3 rounded-md hover:bg-blue-900 transition duration-300 text-sm font-medium flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Send login link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forgotpass;
