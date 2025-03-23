// import React from 'react'
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createpassword } from "../services/allapi"; // Using your API function
import Newimage from "../assets/newpassword.png";
import { useFormik } from "formik";
import { validationNewPass } from "../validation/yup";




function CreateNewPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema:validationNewPass,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await createpassword({
          uid,
          token,
          new_password: values.password,
        });
        console.log(response);
        
        if (response.status === 200) {
          console.log("success");
          
          setMessage({ type: "success", text: "Password reset successfully! Redirecting..." });
          navigate("/")
          
        } else {
          throw new Error("Something went wrong!");
          
        }
      } catch (err) {
        setMessage({ type: "error", text: err.message || "Invalid or expired link!" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl p-10 bg-white rounded-lg shadow-2xl relative flex">
        <div className="w-1/2 pr-8">
          <h1 className="text-3xl font-semibold text-gray-700 mb-2">Create New Password</h1>
          <p className="text-gray-600 text-sm mb-6">Your password must be different from previous passwords.</p>

          {message.text && (
            <div className={`p-3 mb-4 text-white text-center rounded-md ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-950 text-white py-3 rounded-md hover:bg-blue-900 transition duration-300 font-medium"
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <img src={Newimage} alt="Reset Password Illustration" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

export default CreateNewPassword;