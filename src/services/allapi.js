import { BASE_URL } from "./baseurl";
import { commonRequest } from "./commonrequest";

// LOGIN
export const adddetails=async(body)=>{
    console.log("inside add details");
    // console.log(body);
    
    return commonRequest("POST",`${BASE_URL}/login/`,body)
}


// forget password
export const sendemail=async(body)=>{
    return commonRequest("POST",`${BASE_URL}/forgot-password/`,body)
}

// create new password
export const createpassword=async(body)=>{
    console.log(body);
    
    return commonRequest("POST",`${BASE_URL}/reset-password/`,body)
}
// add new user
export const adduser=(body)=>{
    return commonRequest("POST",`${BASE_URL}/create-user/`,body)
}

// post details for change password
export const changepassword=(body)=>{
    return commonRequest("POST",`${BASE_URL}/change-password/`,body)
}


// get dashboard counting content
export const getdashboard_content=async()=>{
    console.log("get count");
    
    return commonRequest("GET",`${BASE_URL}/dashboard/`,"")
}



// POst provider details addproviderdetails
export const addproviderdetails=async(body)=>{
    console.log("hello add provider ",body);
    
    return commonRequest("POST",`${BASE_URL}/providers/`,body)
}


// post subscription details
export const addsubscription=(body)=>{
    console.log("add subscription");
    return commonRequest("POST",`${BASE_URL}/add-subscription/`,body)
    
}




// get provider details
export const getprovidername=async()=>{
    console.log("provider name");
    return commonRequest("GET",`${BASE_URL}/view_providers/`,"")
}

// get subscription details
export const getsubscription=async()=>{
    return commonRequest("GET",`${BASE_URL}/subscriptions/`,"")
}


// get subscription details that going to expire
export const getexpiredsub=async()=>{
    return commonRequest("GET",`${BASE_URL}/subscriptions_warnings/`,"")

}

// get subscription category
export const getsubs_category=()=>{
    console.log("category");
    return commonRequest("GET",`${BASE_URL}/subscription_choices/`,"")
    
}

// delete particular subscription from  database soft delete
export const deleteSubscription=(body)=>{
    return commonRequest("DELETE",`${BASE_URL}/subscriptions/delete/${encodeURIComponent(body)}/`,"")
}










// get the details of server usage
export const getserverusage=()=>{
    console.log("server usage");
    
    return commonRequest("GET",`${BASE_URL}/server-usage/`,"")
}

// get the details for the server usage report
export const getserverusage_report=()=>{
     
    return commonRequest("GET",`${BASE_URL}/server-report/`,"")
}







// get the details of expenditure of subscriptions
export const getexpenditure_data=()=>{
    console.log("expenditure  analysis");
    return commonRequest("GET",`${BASE_URL}/expenditure-analysis/`,"")
    
}

// get the details for expenditure analysis
export const getreport=()=>{
    console.log("report");
    return commonRequest("GET",`${BASE_URL}/subscription-report/`,"")
    
}



// add details for hardware
export const addhardware=(body)=>{
    console.log("addding hardware");
    

    return commonRequest("POST",`${BASE_URL}/hardware/add/`,body)
}


// get the details of all hardware
export const get_hardware=()=>{
    return commonRequest("GET",`${BASE_URL}/hardware/`,"")

}









// add details of resources
export const addresources=(body)=>{
    console.log("addding resources");
    

    return commonRequest("POST",`${BASE_URL}/resources/add/`,body)
}



// get server names in resource
export const getservername=(body)=>{
    console.log("servernames");
    return commonRequest("GET",`${BASE_URL}/servers-by-hosting-type/?type=${encodeURIComponent(body)}`,"")
}


// get resources name
export const getresources=(body)=>{
    console.log("resources");
    console.log(body);
    
    return commonRequest("GET",`${BASE_URL}/resources/names/?type=${encodeURIComponent(body)}`,"")
}


// get all list of resources
export const getallresources=()=>{
    return commonRequest("GET",`${BASE_URL}/resources/`,"")
}





// add details of customers
export const addcustomers=(body)=>{
    return commonRequest("POST",`${BASE_URL}/add-customer/`,body)
}

// get details for customer pichart
export const getcustomerpiechart=()=>{
    return commonRequest("GET",`${BASE_URL}/customer-type-percentage/`,"")
}

// get details of customers
export const getcustomers=()=>{
    return commonRequest("GET",`${BASE_URL}/customers/`,"")
}









// get user role
export const getuser_role=()=>{
    // return commonRequest("GET",`${BASE_URL}/customers/`,"")
}








// // token
// export const getrefresh=(body)=>{
//     console.log("body token",body);
    
//     return commonRequest("POST",`${BASE_URL}/token/refresh/`,body)
// }