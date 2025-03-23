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