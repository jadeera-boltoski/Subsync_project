import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { changepassword } from '../../services/allapi';


const SimplePasswordForm = () => {
  const navigate=useNavigate()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validate: values => {
      const errors = {};
      
      if (!values.currentPassword) {
        errors.currentPassword = 'Required';
      }
      
      if (!values.newPassword) {
        errors.newPassword = 'Required';
      } else if (values.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Required';
      } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      return errors;
    },
    onSubmit:async(values)  => {
      // Handle password change logic here
      console.log('Changing password...', values);
      const response=await changepassword(values)
      console.log(response);
      if(response.status==200){
        alert(response.message)
        navigate("/")
      }else{
        alert(response.message)
      }
      

    }
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border ${
                formik.touched.currentPassword && formik.errors.currentPassword 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-md`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</div>
          )}
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border ${
                formik.touched.newPassword && formik.errors.newPassword 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-md`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-md`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processing...' : 'Change Password'}
          </button>
          <div className='text-sm text-blue-500 mt-2 cursor-default' onClick={()=>{navigate("/forgot-password")}}>forget password</div>
        </div>
      </form>
    </div>
  );
};

export default SimplePasswordForm;