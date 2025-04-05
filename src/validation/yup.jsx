import * as Yup from "yup"

const validationforget = Yup.object({
  email: Yup.string().email("enter valid email").required("fill the field")
})

export default validationforget


// Validation for New Password
export const validationNewPass = Yup.object({
  password:  Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .test(
    "has-uppercase",
    "Password must contain at least one uppercase letter",
    (value) => /[A-Z]/.test(value || "")
  )
  .test(
    "has-lowercase",
    "Password must contain at least one lowercase letter",
    (value) => /[a-z]/.test(value || "")
  )
  .test(
    "has-digit",
    "Password must contain at least one number",
    (value) => /\d/.test(value || "")
  )
  .test(
    "has-special-char",
    "Password must contain at least one special character",
    (value) => /[@$!%*?&]/.test(value || "")
  ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});


export const validationforchangepassword=Yup.object({
  currentPassword: Yup.string().required("current password is required"),
      newPassword:  Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .test(
        "has-uppercase",
        "Password must contain at least one uppercase letter",
        (value) => /[A-Z]/.test(value || "")
      )
      .test(
        "has-lowercase",
        "Password must contain at least one lowercase letter",
        (value) => /[a-z]/.test(value || "")
      )
      .test(
        "has-digit",
        "Password must contain at least one number",
        (value) => /\d/.test(value || "")
      )
      .test(
        "has-special-char",
        "Password must contain at least one special character",
        (value) => /[@$!%*?&]/.test(value || "")
      ),
      confirmPassword:Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
})


// validation for Addsubscription
export const validationsubscription = Yup.object({
  providerName: Yup.string().required("Provider name  is required"),
  providerContact: Yup.string()
    // .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  providerEmail: Yup.string().required("Enter email").email("enter valid email"),
  websiteLink: Yup.string()
    .url("Enter a valid website URL") // Ensures proper URL format
    .required("Website link is required"),

  subscriptionCategory: Yup.string().required("Select a category"),


  additionalDetails: Yup.object().shape({
    software_id: Yup.string().when("$subscriptionCategory", {
      is: "Software",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    software_name: Yup.string().when("$subscriptionCategory", {
      is: "Software",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    version: Yup.string().when("$subscriptionCategory", {
      is: "Software",
      then: (schema) => schema.nullable(), // ✅ Allows empty value
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    // license_type: Yup.string().when("subscriptionCategory", {
    //     is: "Software",
    //     then: (schema) => schema.required("Enter valid information"),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
    no_of_users: Yup.number().when("$subscriptionCategory", {
      is: "Software",
      then: (schema) =>
        schema
          .positive("Number of users must be a positive number")
          .integer("Number of users must be an integer")
          .required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),


    // billing

    consumer_no: Yup.string().when("$subscriptionCategory", {
      is: "Billing",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),

    utility_name: Yup.string().when("$subscriptionCategory", {
      is: "Billing",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    utility_type: Yup.string().when("$subscriptionCategory", {
      is: "Billing",
      then: (schema) => schema.required("Choose valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),

    server_name: Yup.string().when("$subscriptionCategory", {
      is: "Server",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    server_type: Yup.string().when("$subscriptionCategory", {
      is: "Server",
      then: (schema) => schema.required("Choose valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    server_capacity: Yup.string()
      .matches(/^\d+(GB|TB)$/, "Enter valid format (e.g., 500GB or 2TB)")
      .when("$subscriptionCategory", {
        is: "Server",
        then: (schema) => schema.required("Enter valid information"),
        otherwise: (schema) => schema.notRequired(),
      }),


    // Domain


    domain_id: Yup.string().when("$subscriptionCategory", {
      is: "Domain",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),


    domain_name: Yup.string().when("$subscriptionCategory", {
      is: "Domain",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    domain_type: Yup.string()
      .matches(/^(\.[a-zA-Z]{2,})$/, "Enter a valid domain type (e.g., .com, .in, .org)")
      .when("$subscriptionCategory", {
        is: "Domain",
        then: (schema) => schema.required("Domain type is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    ssl_certification: Yup.string().when("$subscriptionCategory", {
      is: "Domain",
      then: (schema) => schema.required("Choose valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    whois_protection: Yup.string().when("$subscriptionCategory", {
      is: "Domain",
      then: (schema) => schema.required("Choose valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    ssl_expiry_date: Yup.date()
      .min(new Date(), "SSL Expiry Date must be a future date")
      .when("$subscriptionCategory", {
        is: "Domain",
        then: (schema) => schema.required("Choose a valid SSL Expiry Date"),
        otherwise: (schema) => schema.notRequired(),
      }),
    name_servers: Yup.string().when("$subscriptionCategory", {
      is: "Domain",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
    hosting_provider: Yup.string().when("$subscriptionCategory", {
      is: "Domain",
      then: (schema) => schema.required("Enter valid information"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),

  cost: Yup.number()
    // Shows error for non-numeric input
    .positive("Amount must be a positive number")
    .required("Cost is required"),


  // paymentStatus: Yup.string().required("Choose valid information"),
  paymentMethod: Yup.string().required("Choose valid information"),

  startDate: Yup.date()
    .required("Start Date is required"),
  // .min(new Date(), "Start Date cannot be in the past"),

  billingCycle: Yup.string()
    .required("Billing Cycle is required"),


  // endDate: Yup.date()
  //     // .required("End Date is required")
  //     .min(Yup.ref("startDate"), "End Date must be after Start Date"),

  // lastPaymentDate: Yup.date()
  //     .max(new Date(), "Last Payment Date cannot be in the future"),


  // nextPaymentDate: Yup.date()
  //     .required("Next Payment Date is required")
  //     .min(Yup.ref("lastPaymentDate"), "Next Payment Date must be after Last Payment Date"),

  autoRenewal: Yup.boolean()
    .required("Auto Renewal selection is required")
    .oneOf([true, false], "Auto Renewal selection is required"),








  recipients: Yup.string().matches(
    /^([\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,})(,\s*[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,})*$/,
    "Enter valid email addresses separated by commas"
  ),

  // required("Enter valid information")


})



// validation for edit subscription
export const subscriptionValidationSchema = Yup.object().shape({
  // version: Yup.string().required('Version is required'),
  autoRenewal: Yup.boolean(),
  id: Yup.string().required("need id"),
  no_of_users: Yup.number()
    .positive('Number of users must be positive')
    .integer('Number of users must be an integer'),
  // .required('Number of users is required'),
  // paymentStatus: Yup.string()
  //   .oneOf(['paid', 'unpaid'], 'Invalid payment status')
  //   .required('Payment status is required'),
  // nextPaymentDate: Yup.date().required('Next payment date is required'),
  cost: Yup.number()
    .positive('Cost must be a positive number')
    .required('Cost is required'),

  last_payment_date: Yup.date()
    .nullable()
    .max(new Date(), 'Payment date cannot be in the future')
});




// validation for add hardware

export const validationHardware = Yup.object().shape({
  // Common fields
  deviceType: Yup.string()
    .required("Device type is required"),
  manufacturer: Yup.string()
    .required("Manufacturer is required")
    .max(100, "Manufacturer name cannot exceed 100 characters"),
  model: Yup.string()
    .required("Model is required")
    .max(100, "Model cannot exceed 100 characters"),
  serialNumber: Yup.string()
    .required("Serial number is required")
    .max(50, "Serial number cannot exceed 50 characters"),
  assignedTo: Yup.string()
    .required("Please select which department this device is assigned to"),
  purchaseDate: Yup.date()
    .required("Purchase date is required")
    .max(new Date(), "Purchase date cannot be in the future")
    .typeError("Please enter a valid date"),
  purchasecost: Yup.date()
    .required("Purchase date is required"),


  vendor_name: Yup.string()
    .required('Vendor name is required')
    .min(2, 'Vendor name must be at least 2 characters')
    .max(100, 'Vendor name cannot exceed 100 characters'),

  vendor_contact: Yup.string()
    .required('Contact number is required')
    .min(2, 'Contact name must be at least 2 characters')
    .max(15, 'Contact name cannot exceed 50 characters'),

  vendor_email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters'),

  // Warranty information
  warrantyExpiryDate: Yup.date()
    .required("Warranty expiry date is required")
    .test(
      "is-after-purchase",
      "Warranty expiry date must be after purchase date",
      function (value) {
        const { purchaseDate } = this.parent;
        return !purchaseDate || !value || new Date(value) >= new Date(purchaseDate);
      }
    )
    .typeError("Please enter a valid date"),
  isExtendedWarranty: Yup.boolean(),
  extendedWarrantyPeriod: Yup.string()
    .when("isExtendedWarranty", {
      is: true,
      then: () => Yup.string().required("Extended warranty period is required"),
      otherwise: () => Yup.string().notRequired(),
    }),





  // Service information





  lastServiceDate: Yup.date().required("Purchase date is required")
    .max(new Date(), "Last service date cannot be in the future")
    .typeError("Please enter a valid date"),



  nextServiceDate: Yup.date()
    .required("Next service date is required")
    .test(
      "is-after-last-service",
      "Next service date should be after last service date",
      function (value) {
        const { lastServiceDate } = this.parent;
        return !value || !lastServiceDate || new Date(value) > new Date(lastServiceDate);
      }
    )
    .typeError("Please enter a valid date"),

  freeServiceUntil: Yup.date()

    .test(
      "is-after-purchase",
      "Free service date should be after purchase date",
      function (value) {
        const { purchaseDate } = this.parent;
        return !value || !purchaseDate || new Date(value) >= new Date(purchaseDate);
      }
    )
    .typeError("Please enter a valid date"),
  serviceCost: Yup.number()
    .nullable()
    .min(0, "Service cost cannot be negative")
    .typeError("Please enter a valid number"),
  serviceProvider: Yup.string()
    .required("Enter service provider")
    // .nullable()
    .max(100, "Service provider name cannot exceed 100 characters"),

  // Notes
  notes: Yup.string()
    .nullable()
    .max(500, "Notes cannot exceed 500 characters"),






  // Dynamic device-specific fields - these are validated when they exist
  // CPU
  CPU: Yup.string()
    .when("deviceType", {
      is: (val) => ["Laptop", "Desktop", "Server", "On-Premise Server"].includes(val),
      then: () => Yup.string().required("CPU information is required"),
      otherwise: () => Yup.string(),
    }),

  // RAM
  RAM: Yup.string()
    .when("deviceType", {
      is: (val) => ["Laptop", "Desktop", "Server", "On-Premise Server"].includes(val),
      then: () => Yup.string().required("RAM information is required"),
      otherwise: () => Yup.string(),
    }),

  // Storage
  Storage: Yup.string().required("isjsidj")
    .when("deviceType", {
      is: (val) => ["Laptop", "Desktop", "Mobile Phone", "Tablet", "Server"].includes(val),
      then: () => Yup.string().required("Storage information is required"),
      otherwise: () => Yup.string(),
    }),

  // OS Version
  OS_Version: Yup.string()
    .when("deviceType", {
      is: (val) => ["Mobile Phone", "Tablet"].includes(val),
      then: () => Yup.string().required("OS Version is required"),
      otherwise: () => Yup.string(),
    }),

  // IMEI Number (for Mobile Phones)
  IMEI_Number: Yup.string()
    .when("deviceType", {
      is: "Mobile Phone",
      then: () => Yup.string()
        .required("IMEI Number is required")
        .matches(/^\d{15}$/, "IMEI Number must be 15 digits"),
      otherwise: () => Yup.string(),
    }),

  // Network Device fields
  Throughput: Yup.string()
    .when("deviceType", {
      is: "Network Device",
      then: () => Yup.string().required("Throughput is required"),
      otherwise: () => Yup.string(),
    }),

  IP_Address: Yup.string()
    .when("deviceType", {
      is: "Network Device",
      then: () => Yup.string()
        .required("IP Address is required")
        .matches(/^(\d{1,3}\.){3}\d{1,3}$/, "Please enter a valid IP address"),
      otherwise: () => Yup.string(),
    }),

  // Air Conditioner fields
  BTU_Rating: Yup.string()
    .when("deviceType", {
      is: "Air Conditioner",
      then: () => Yup.string().required("BTU Rating is required"),
      otherwise: () => Yup.string(),
    }),

  EnergyP_Rating: Yup.string()
    .when("deviceType", {
      is: "Air Conditioner",
      then: () => Yup.string().required("Energy Rating is required"),
      otherwise: () => Yup.string(),
    }),

  // Server specific fields
  Storage_Configuration: Yup.string()
    .when("deviceType", {
      is: "On-Premise Server",
      // then: () => Yup.string().required("Storage Configuration is required"),
      otherwise: () => Yup.string(),
    }),

  Operating_System: Yup.string()
    .when("deviceType", {
      is: "On-Premise Server",
      then: () => Yup.string().required("Operating System is required"),
      otherwise: () => Yup.string(),
    }),

  // Printer specific fields
  Print_Technology: Yup.string()
    .when("deviceType", {
      is: "Printer",
      then: () => Yup.string().required("Print Technology is required"),
      otherwise: () => Yup.string(),
    }),

  Print_Speed: Yup.string()
    .when("deviceType", {
      is: "Printer",
      then: () => Yup.string().required("Print Speed is required"),
      otherwise: () => Yup.string(),
    }),

  Connectivity: Yup.string()
    .when("deviceType", {
      is: (val) => ["Printer", "Scanner"].includes(val),
      then: () => Yup.string().required("Connectivity information is required"),
      otherwise: () => Yup.string(),
    }),

  // Scanner specific fields
  Scan_Resolution: Yup.string()
    .when("deviceType", {
      is: "Scanner",
      then: () => Yup.string().required("Scan Resolution is required"),
      otherwise: () => Yup.string(),
    }),

  Scan_Type: Yup.string()
    .when("deviceType", {
      is: "Scanner",
      then: () => Yup.string().required("Scan Type is required"),
      otherwise: () => Yup.string(),
    }),
});

// validation for customer details
export const validationCustomerform = Yup.object({
  customer_name: Yup.string().required("Enter valid information")
})


// validation for resource details
export const validationresource = Yup.object({
  resource_name: Yup.string().required("Enter valid information"),

  resource_type: Yup.string()
    .oneOf(
      ["Web and Application Hosting", "Database and Storage", "Security and Compliance", "CI/CD and DevOps", "Other"],
      "Invalid resource type selected"
    )
    .required("Resource type is required"),

  storage_capacity: Yup.string()
    .matches(/^\d+(\.\d+)?\s?(GB|TB|MB|PB)$/, "Invalid format (e.g., 500 GB, 1.5 TB)")
    .required("Storage capacity is required"),

  billing_cycle: Yup.string()
    .oneOf(["monthly", "quarterly", "yearly"], "Invalid billing cycle selected")
    .required("Billing cycle is required"),

  resource_cost: Yup.number()
    .typeError("Resource cost must be a valid number")
    .positive("Resource cost must be greater than zero")
    .required("Resource cost is required"),

  // next_payment_date: Yup.date()
  //     .required("Next payment date is required")
  //     .min(new Date(), "Next payment date cannot be in the past"),

  provisioned_date: Yup.date()
    .required("Provisioned date is required"),

  last_updated_date: Yup.date()
    .required("Last updated date is required")
    .min(Yup.ref("provisioned_date"), "Last updated date cannot be before provisioned date"),

  // status: Yup.string()
  //     .oneOf(["active", "inactive", "pending", "deprecated"], "Invalid status selected")
  //     .required("Status is required"),

  hosting_type: Yup.string()
    .required("Hosting type is required")
    .oneOf(["inhouse", "external", "cloud"], "Invalid hosting type"),

  hosting_location: Yup.string()
    .required("Hosting location is required")






})


