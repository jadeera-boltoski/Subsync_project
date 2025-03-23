// import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { adduser } from '../../services/allapi';

function Add_user() {
  const navigate = useNavigate();

  // Setup formik hook
  const formik = useFormik({
    // Initial form values
    initialValues: {
      name: '',
      email: '',
      role: 'regular'
    },

    // Validation schema using Yup
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      role: Yup.string()
        .required('Role is required')
    }),

    // Form submission handler
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await adduser(values)
        console.log(values);
        
        console.log('API Response:', response.data);
        console.log(response);

        if (response.status==200){
          alert('User created successfully!');
          resetForm();
          navigate('/dashboard/users/viewuser'); // Redirect after success
        }else{
          alert("something went wrong")
        }
         
      } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }

  });

  return (
    <div className="max-w-lg mx-auto p-6 m-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${formik.errors.name && formik.touched.name ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-sm text-red-600">{formik.errors.name}</div>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="user@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-sm text-red-600">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            User Role
          </label>
          <select
            id="role"
            name="role"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="regular">Regular User</option>
            <option value="super">Super User</option>
          </select>
          {formik.touched.role && formik.errors.role ? (
            <div className="text-sm text-red-600">{formik.errors.role}</div>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/users/viewuser')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add_user;