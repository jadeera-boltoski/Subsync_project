import validator from "validator"
export const validateForm=(formData)=>{

    const { email, password } = formData;
    // console.log(formData);
    
    if(!email || !password){
        return {message:"Please fill in all required fields"}
        
    }
    if (!validator.isEmail(email)) {

        return { success: false, message: "Invalid email or password" };
        // }
    }
    return {success:true}

    
    
}

export const validateprovider=(formdata)=>{
    const { providerName, providerContact, providerEmail, websiteLink } = formdata;
  
  // Check required fields
  if (!providerName || !providerContact || !providerEmail) {
    return { success: false, message: "Please fill in all required fields" };
  }
  
  // Validate email format
  if (!validator.isEmail(providerEmail)) {
    return { success: false, message: "Invalid email address" };
  }
  
  // Validate phone number (assuming you want 10-15 digits)
  if (!validator.isMobilePhone(providerContact)) {
    return { success: false, message: "Invalid contact number" };
  }
  
  // Validate website URL if provided
  if (websiteLink && !validator.isURL(websiteLink)) {
    return { success: false, message: "Invalid website URL" };
  }
  
  return { success: true };
}