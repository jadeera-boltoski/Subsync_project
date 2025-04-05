import { useFormik } from "formik";
import { validationsubscription } from "../../validation/yup";
import { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { addsubscription, getprovidername, getsubs_category } from "../../services/allapi";
// import { useRef } from "react";
import Add_providers from "./Add_providers";
import { useNavigate } from "react-router-dom";

// import { useNavigate } from "react-router-dom";
// import Add_providers from "./Add_providers";


// import { useDispatch, useSelector } from "react-redux";
// import { resetForm, updateField } from "../../Redux/slices/subscriptionSlice";



function Add_subscription() {

    // end date
    const [dateType, setDateType] = useState();
    const handleDateTypeChange = (e) => {
        const selectedType = e.target.value;
        setDateType(selectedType);

        if (selectedType === 'lifelong') {
            // Clear the end date when 'Life Long' is selected
            formik.setFieldValue('endDate', null);
            formik.setFieldValue('isLifelong', true);
        } else {
            formik.setFieldValue('isLifelong', false);
        }
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // const dispatch = useDispatch();
    // const subscription = useSelector((state) => state.subscription);
    // const navigate = useNavigate()


    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);

    // const [autoRenewal, setAutoRenewal] = useState(null);
    const [extraReminder, setExtraReminder] = useState(false);
    const [needrem, setneedrem] = useState(false)
    // Create a reference for the input field
    // const inputRef = useRef(null);


    const [isAddingNewProvider, setIsAddingNewProvider] = useState(false);


    const formik = useFormik({
        initialValues:
        {
            providerid: "",
            providerName: "",
            providerContact: "",
            providerEmail: "",
            websiteLink: "",

            // subscriptionId: "",
            subscriptionCategory: "",
            startDate: "",
            billingCycle: "",
            endDate: "",
            cost: "",
            paymentMethod: "",
            // paymentStatus: "",
            // lastPaymentDate: "",
            // nextPaymentDate: "",
            // subscriptionCycle: "yearly",
            firstReminderMonth: "",
            reminderDay: "",
            notificationMethod: "",
            recipients: "",
            customMessage: "",
            daysBeforeEnd: "",


            additionalDetails: {}
        },
        validationSchema: validationsubscription,
        onSubmit: async (values) => {
            console.log("Submitting Form Data:", values);

            // Filter out empty additionalDetails fields
            const filteredValues = {
                ...values,
                additionalDetails: Object.fromEntries(
                    Object.entries(values.additionalDetails).filter(([, v]) => v !== "")
                ),
            };

            console.log("Final Filtered Data:", filteredValues);

            // Call API
            const response = await addsubscription(filteredValues);
            console.log("API Response:", response);
            if (response.code == 201) {
                alert("successfully added")
                navigate('/dashboard/subscriptions/Viewsubscription')
            } else {
                alert("Data already exist")
            }


            // Reset Redux state after successful submission
            // dispatch(resetForm());
        },

    });



    const [Providers, setProviders] = useState([])
    // const [newProviderName, setNewProviderName] = useState("");
    // console.log(newProviderName);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const responseprovider = await getprovidername(); // Fetch data
                console.log("hello response", responseprovider);


                // Extract provider details
                const providerNames = responseprovider.map(provider => ({
                    id: provider.id,
                    name: provider.providerName,
                    email: provider.providerEmail,
                    phone: provider.providerContact,
                    website: provider.websiteLink
                }));

                setProviders(providerNames);
                console.log("jadeera", Providers);

                // subscription category
                const responsecategory = await getsubs_category()
                console.log(responsecategory);
                setCategories(responsecategory.category_choices)


            } catch (error) {
                console.error("Error fetching provider name:", error);
            }
        };

        fetchdata();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleCategoryChange = (e) => {
        const selectedcategory = e.target.value
        // formik.setFieldValue("subscriptionCategory", selectedcategory)
        const hasAdditionalDetails = formik.values.additionalDetails
            && Object.values(formik.values.additionalDetails).some(value => value !== "");

        if (hasAdditionalDetails) {
            const confirmChange = window.confirm(
                "Changing the subscription category will reset all entered data. Do you want to proceed?"
            );

            if (!confirmChange) {
                return; // Stop the category change if the user cancels
            }
        }
        formik.setFieldValue("subscriptionCategory", selectedcategory)

        let additionalFields = {};

        switch (selectedcategory) {
            case "Software":
                additionalFields = {
                    // subscription: "",
                    software_id: "",
                    software_name: "",
                    version: "",
                    features: "",
                    no_of_users: "",
                };
                break;
            case "Billing":
                additionalFields = {
                    // subscription: "",
                    consumer_no: "",
                    utility_name: "",
                    utility_type: "",
                    location: "",
                    // account_number: "",
                };
                break;
            case "Server":
                additionalFields = {
                    // subscription: "",
                    server_name: "",
                    server_type: "",
                    server_capacity: "",
                };
                break;
            case "Domain":
                additionalFields = {
                    // subscription: "",
                    domain_name: "",
                    domain_type: "",
                    ssl_certification: "",
                    ssl_expiry_date: "",
                    whois_protection: "",
                    name_servers: "",
                    hosting_provider: ""
                };
                break;
            default:
                additionalFields = {};
        }

        // Update Formik state
        formik.setFieldValue("additionalDetails", additionalFields);

        // formik.resetForm({
        //     values: {

        //         ...formik.initialValues,
        //         subscriptionCategory: selectedcategory, // Set new category

        //         // providerName:"",
        //         // providerContact:"",
        //         // providerEmail:"",
        //         // websiteLink:"",
        //         subscriptionId: "",
        //         additionalDetails: additionalFields, // Reset additional fields
        //     },
        // });

    }



    const handleAdditionalFieldChange = (e) => {
        const { name, value } = e.target;
        formik.setFieldValue(`additionalDetails.${name}`, value);
    };


    console.log("Formik Errors:", formik.errors);


    return (
        <div className="w-full ">

            <div>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>



            <h1 className="text-xl md:text-xl font-bold text-gray-700 mb-6">
                Add New Subscription
            </h1>

            <div className="w-full p-4 bg-white">
                <form onSubmit={formik.handleSubmit} className="space-y-8 ">

                    {/* Provider Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-2 rounded-lg">

                                <h2 className="text-xl font-bold mb-4">Provider Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                    <div>
                                        <label htmlFor="providerName" className="block mb-1 text-sm">
                                            Provider name :
                                        </label>


                                        <select
                                            name="providerName"
                                            id="providerName"
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 "
                                            value={formik.values.providerName}

                                            onChange={(e) => {
                                                e.preventDefault(); // Prevent form submission
                                                const selectedValue = e.target.value;
                                                console.log("hello", selectedValue);


                                                // if (selectedValue === "add_new_provider") {
                                                //     setIsAddingNewProvider(true); 
                                                //     setNewProviderName(" "); // Clear previous input
                                                //     setTimeout(() => inputRef.current?.focus(), 0); // Auto-focus the input field
                                                // }


                                                if (selectedValue === "add_new_provider") {
                                                    setIsAddingNewProvider(true);
                                                    setIsPopupOpen(true);
                                                    formik.setFieldValue("providerName", selectedValue);
                                                    formik.setFieldValue("providerContact", "");
                                                    formik.setFieldValue("providerEmail", "");
                                                    formik.setFieldValue("websiteLink", "");
                                                } else {
                                                    // Handle regular provider selection
                                                    formik.setFieldValue("providerName", selectedValue);


                                                    // Find the selected provider's details
                                                    const selectedProvider = Providers.find(provider =>
                                                        provider.name === selectedValue
                                                    );


                                                    if (selectedProvider) {
                                                        formik.setFieldValue("providerid", selectedProvider.id || "")
                                                        formik.setFieldValue("providerContact", selectedProvider.phone || "");
                                                        formik.setFieldValue("providerEmail", selectedProvider.email || "");
                                                        formik.setFieldValue("websiteLink", selectedProvider.website || "");
                                                    }
                                                }
                                            }}
                                            onBlur={formik.handleBlur}
                                        >

                                            <option value="" selected disabled >
                                                -- Select a Provider --
                                            </option>

                                            {Providers.map((provider) => (

                                                <option key={provider.id} value={provider.name}>
                                                    {provider.name}
                                                </option>
                                            ))}

                                            <option value="add_new_provider" className="text-blue-600 font-semibold">
                                                + Add New Provider
                                            </option>



                                        </select>

                                        {formik.touched.providerName && formik.errors.providerName && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {formik.errors.providerName}
                                            </div>
                                        )}



                                    </div>


                                    <div>
                                        <label htmlFor="providerContact" className="block mb-1 text-sm">
                                            Provider Contact Number:
                                        </label>
                                        <input
                                            type="text"
                                            id="providerContact"
                                            name="providerContact"
                                            value={formik.values.providerContact}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            readOnly
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1"
                                        />
                                        {formik.touched.providerContact && formik.errors.providerContact && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {formik.errors.providerContact}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="providerEmail" className="block mb-1 text-sm">
                                            Provider email :
                                        </label>
                                        <input
                                            type="email"
                                            id="providerEmail"
                                            name="providerEmail"
                                            value={formik.values.providerEmail}
                                            readOnly
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 "
                                        />
                                        {formik.touched.providerEmail && formik.errors.providerEmail && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {formik.errors.providerEmail}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="websiteLink" className="block mb-1 text-sm">
                                            website link :
                                        </label>
                                        <input
                                            type="url"
                                            id="websiteLink"
                                            name="websiteLink"
                                            value={formik.values.websiteLink}
                                            readOnly
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 "
                                        />
                                        {formik.touched.websiteLink && formik.errors.websiteLink && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {formik.errors.websiteLink}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>









                            {/* Subscription Details Section */}
                            <div className="bg-white p-4 rounded-lg mt-4  ">
                                <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
                                <div className="flex flex-col md:flex-row w-full gap-4">
                                    {/* Left Column */}
                                    <div className="w-full md:w-1/2 mt-8  ">


                                        <div className="mb-2">
                                            <label htmlFor="subscriptionCategory" className="block mb-1 text-sm">
                                                subscription Category :
                                            </label>
                                            <select
                                                name="subscriptionCategory"
                                                value={formik.values.subscriptionCategory}
                                                onChange={handleCategoryChange}
                                                onBlur={formik.handleBlur}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ">


                                                <option value="" selected> -- Choose a category --</option>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category}>
                                                        {category}
                                                    </option>
                                                ))
                                                }

                                            </select>
                                            {formik.touched.subscriptionCategory && formik.errors.subscriptionCategory && (
                                                <div className="text-red-500 text-xs mt-1">
                                                    {formik.errors.subscriptionCategory}
                                                </div>
                                            )}
                                        </div>


                                        <div>
                                            {/* for software */}
                                            {formik.values.subscriptionCategory === "Software" && (
                                                <div>
                                                    <label htmlFor="software_id" className="block mb-1  text-sm">
                                                        Subscription id:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="software_id"
                                                        name="software_id"
                                                        value={formik.values.additionalDetails.software_id || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.software_id", true)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.software_id && formik.errors.additionalDetails?.software_id && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.software_id}
                                                        </div>
                                                    )}

                                                    <label htmlFor="software_name" className="block mt-4 text-sm">
                                                        Software Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="software_name"
                                                        name="software_name"
                                                        value={formik.values.additionalDetails.software_name || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.software_name", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.software_name && formik.errors.additionalDetails?.software_name && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.software_name}
                                                        </div>
                                                    )}


                                                    <label htmlFor="version" className="block mt-4 text-sm">
                                                        version <span className="text-gray-500">(Optional)</span>                                               </label>
                                                    <input
                                                        type="text"
                                                        id="version"
                                                        name="version"
                                                        value={formik.values.additionalDetails.version || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.version", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.version && formik.errors.additionalDetails?.version && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.version}
                                                        </div>
                                                    )}


                                                    {/* <label htmlFor="features" className="block mt-4 text-sm">
                                                        features                                                </label>
                                                    <input
                                                        type="text"
                                                        id="features"
                                                        name="features"
                                                        value={formik.values.additionalDetails.features || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    /> */}


                                                    {/* <label htmlFor="license_type" className="block mt-4 text-sm">
                                                        License Key               </label>
                                                    <input
                                                        type="text"
                                                        id="license_type"
                                                        name="license_type"
                                                        value={formik.values.additionalDetails.license_type || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.license_type", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.license_type && formik.errors.additionalDetails?.license_type && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.license_type}
                                                        </div>
                                                    )} */}


                                                    <label htmlFor="no_of_users" className="block mt-4 text-sm">
                                                        Number of users                     </label>
                                                    <input
                                                        type="number"
                                                        id="no_of_users"
                                                        name="no_of_users"
                                                        value={formik.values.additionalDetails.no_of_users || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.no_of_users", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.no_of_users && formik.errors.additionalDetails?.no_of_users && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.no_of_users}
                                                        </div>
                                                    )}

                                                </div>

                                            )}

                                            {/* For Billing */}
                                            {formik.values.subscriptionCategory === "Billing" && (
                                                <div>



                                                    <label htmlFor="consumer_no" className="block mb-1  text-sm">
                                                        Account number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="consumer_no"
                                                        name="consumer_no"
                                                        value={formik.values.additionalDetails.consumer_no || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.consumer_no", true)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.consumer_no && formik.errors.additionalDetails?.consumer_no && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.consumer_no}
                                                        </div>
                                                    )}




                                                    <label htmlFor="utility_name" className="block mt-4 text-sm">
                                                        Utility Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="utility_name"
                                                        name="utility_name"
                                                        value={formik.values.additionalDetails.utility_name || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.utility_name", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.utility_name && formik.errors.additionalDetails?.utility_name && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.utility_name}
                                                        </div>
                                                    )}

                                                    <label htmlFor="utility_type" className="block mt-4 text-sm">
                                                        Utility Type
                                                    </label>
                                                    <select name="utility_type"
                                                        id="utility_type"
                                                        value={formik.values.additionalDetails.utility_type || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.utility_type", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="" disabled selected>--choose type--</option>
                                                        <option value="Prepaid">Prepaid</option>
                                                        <option value="Postpaid">Postpaid</option>


                                                    </select>
                                                    {formik.touched.additionalDetails?.utility_type && formik.errors.additionalDetails?.utility_type && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.utility_type}
                                                        </div>
                                                    )}
                                                    {/* <input
                                                        type="text"
                                                        id="utility_type"
                                                        name="utility_type"
                                                        value={formik.values.additionalDetails.utility_type || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    /> */}

                                                    {/* <label label htmlFor="location" className="block mt-4 text-sm">
                                                        location</label>
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        name="location"
                                                        value={formik.values.additionalDetails.location || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    /> */}

                                                    {/* <label label htmlFor="account_number" className="block mt-4 text-sm">
                                                        account_number</label>
                                                    <input
                                                        type="text"
                                                        id="account_number"
                                                        name="account_number"
                                                        value={formik.values.additionalDetails.account_number || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    /> */}
                                                </div>

                                            )}



                                            {/* for server details */}
                                            {formik.values.subscriptionCategory === "Server" && (
                                                <div>
                                                    <label htmlFor="subscriptionId" className="block mb-1  text-sm">
                                                        Server id:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="subscriptionId"
                                                        name="subscriptionId"
                                                        value={formik.values.subscriptionId}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.subscriptionId && formik.errors.subscriptionId && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.subscriptionId}
                                                        </div>
                                                    )}



                                                    <label htmlFor="server_name" className="block mt-4 text-sm">
                                                        Server Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="server_name"
                                                        name="server_name"
                                                        value={formik.values.additionalDetails.server_name || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.server_name", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.server_name && formik.errors.additionalDetails?.server_name && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.server_name}
                                                        </div>
                                                    )}



                                                    <label htmlFor="server_type" className="block  mt-4 text-sm">
                                                        Server type

                                                    </label>
                                                    <select name="server_type"
                                                        id="server_type"
                                                        value={formik.values.additionalDetails.server_type || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.server_type", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                        <option value="" disabled selected>--choose a type--</option>
                                                        <option value="External">External server</option>
                                                        <option value="Cloud">Cloud Hosting Providers </option>


                                                    </select>
                                                    {formik.touched.additionalDetails?.server_type && formik.errors.additionalDetails?.server_type && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.server_type}
                                                        </div>
                                                    )}
                                                    {/* <input
                                                        type="text"
                                                        id="server_type"
                                                        name="server_type"
                                                        value={formik.values.additionalDetails.server_type || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    /> */}

                                                    <label htmlFor="server_capacity" className="block  mt-4 text-sm">
                                                        Server capacity
                                                    </label>

                                                    <input type="text"
                                                        id="server_capacity"
                                                        name="server_capacity"
                                                        placeholder="Enter capacity (e.g., 500GB or 2TB)"
                                                        value={formik.values.additionalDetails.server_capacity || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.server_capacity", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                                    {formik.touched.additionalDetails?.server_capacity && formik.errors.additionalDetails?.server_capacity && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.server_capacity}
                                                        </div>
                                                    )}

                                                </div>

                                            )}

                                            {/* for Domain details */}
                                            {formik.values.subscriptionCategory === "Domain" && (
                                                <div>
                                                    <label htmlFor="domain_id" className="block mb-1  text-sm">
                                                        Domain Registration ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="domain_id"
                                                        name="domain_id"
                                                        value={formik.values.additionalDetails.domain_id || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.domain_id", true)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.domain_id && formik.errors.additionalDetails?.domain_id && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.domain_id}
                                                        </div>
                                                    )}


                                                    <label label htmlFor="domain_name" className="block mt-4 text-sm">
                                                        Domain Name</label>
                                                    <input
                                                        type="text"
                                                        id="domain_name"
                                                        name="domain_name"
                                                        value={formik.values.additionalDetails.domain_name || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.domain_name", true)}
                                                        className="w-full p-2  border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.domain_name && formik.errors.additionalDetails?.domain_name && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.domain_name}
                                                        </div>
                                                    )}

                                                    <label label htmlFor="domain_type" className="block mt-4 text-sm">
                                                        Domain Type</label>
                                                    <input
                                                        type="text"
                                                        id="domain_type"
                                                        name="domain_type"
                                                        placeholder=".com , .in etc"
                                                        value={formik.values.additionalDetails.domain_type || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.domain_type", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.domain_type && formik.errors.additionalDetails?.domain_type && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.domain_type}
                                                        </div>
                                                    )}

                                                    <label htmlFor="ssl_certification" className="block mt-4 text-sm">
                                                        SSL Certification</label>
                                                    <select name="ssl_certification" id="ssl_certification"
                                                        value={formik.values.additionalDetails.ssl_certification}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.ssl_certification", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                        <option value="" disabled selected>yes or no</option>
                                                        <option value="True">Yes</option>
                                                        <option value="False">No</option>


                                                    </select>
                                                    {formik.touched.additionalDetails?.ssl_certification && formik.errors.additionalDetails?.ssl_certification && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.ssl_certification}
                                                        </div>
                                                    )}





                                                    <label htmlFor="whois_protection" className="block mt-4 text-sm">
                                                        WHOIS Protection</label>
                                                    <select name="whois_protection" id="whois_protection"
                                                        value={formik.values.additionalDetails.whois_protection}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.whois_protection", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                        <option value="" disabled selected>yes or no</option>
                                                        <option value="True">Yes</option>
                                                        <option value="False">No</option>
                                                    </select>
                                                    {formik.touched.additionalDetails?.whois_protection && formik.errors.additionalDetails?.whois_protection && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.whois_protection}
                                                        </div>
                                                    )}




                                                    <label label htmlFor="ssl_expiry_date" className="block mt-4 text-sm">
                                                        SSL Expiry Date</label>
                                                    <input
                                                        type="date"
                                                        id="ssl_expiry_date"
                                                        name="ssl_expiry_date"
                                                        value={formik.values.additionalDetails.ssl_expiry_date || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.ssl_expiry_date", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.ssl_expiry_date && formik.errors.additionalDetails?.ssl_expiry_date && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.ssl_expiry_date}
                                                        </div>
                                                    )}







                                                    <label label htmlFor="name_servers" className="block mt-4 text-sm">
                                                        Name Servers</label>
                                                    <input
                                                        type="text"
                                                        id="name_servers"
                                                        name="name_servers"
                                                        value={formik.values.additionalDetails.name_servers || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.name_servers", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.name_servers && formik.errors.additionalDetails?.name_servers && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.name_servers}
                                                        </div>
                                                    )}


                                                    <label label htmlFor="hosting_provider" className="block mt-4 text-sm">
                                                        Hosting Provider</label>
                                                    <input
                                                        type="text"
                                                        id="hosting_provider"
                                                        name="hosting_provider"
                                                        value={formik.values.additionalDetails.hosting_provider || ""}
                                                        onChange={handleAdditionalFieldChange}
                                                        onBlur={() => formik.setFieldTouched("additionalDetails.hosting_provider", true)}
                                                        className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    {formik.touched.additionalDetails?.hosting_provider && formik.errors.additionalDetails?.hosting_provider && (
                                                        <div className="text-red-500 text-xs mt-1">
                                                            {formik.errors.additionalDetails?.hosting_provider}
                                                        </div>
                                                    )}

                                                </div>

                                            )}





                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="cost" className="block mb-1 text-sm">
                                                Cost :
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                pattern="^\d*\.?\d*$"
                                                id="cost"
                                                name="cost"
                                                placeholder="Enter amount numerically"
                                                value={formik.values.cost}
                                                onChange={(e) => {
                                                    const input = e.target.value;

                                                    // Allow only numbers and a single decimal point
                                                    const validInput = input.replace(/[^0-9.]/g, '').replace(/^([^.]*)\.(.*)\./, '$1.$2');
                                                    formik.setFieldValue("cost", validInput);
                                                }}
                                                onBlur={formik.handleBlur}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                            {formik.touched.cost && formik.errors.cost && (
                                                <div className="text-red-500 text-xs mt-1">
                                                    {formik.errors.cost}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            {/* <label htmlFor="paymentStatus" className="block mb-1 text-sm">
                                                Payment status
                                            </label>
                                            <select name="paymentStatus" id="paymentStatus"
                                                value={formik.values.paymentStatus}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                <option value="">--select status--</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Unpaid">Unpaid</option>
                                            </select> */}

                                            {formik.touched.paymentStatus && formik.errors.paymentStatus && (
                                                <div className="text-red-500 text-xs mt-1">
                                                    {formik.errors.paymentStatus}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="paymentMethod" className="block mb-1 text-sm">
                                                Payment method
                                            </label>
                                            <select name="paymentMethod" id="paymentMethod"
                                                value={formik.values.paymentMethod}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                <option value="" disabled selected>--select method--</option>
                                                <option value="Credit/Debit Card">Credit/Debit Card</option>
                                                <option value="Bank_Transfer">Bank Transfer</option>
                                                <option value="Prepaid_Cards">Gift Cards & Prepaid Cards</option>
                                                <option value="Cash_Payments">Cash Payments (For offline or manual renewals)</option>
                                            </select>

                                            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                                                <div className="text-red-500 text-xs mt-1">
                                                    {formik.errors.paymentMethod}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Right Column */}
                                    <div className="w-full md:w-1/2 pl-4">
                                        <div>
                                            {/* Dates Section */}
                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-4">
                                                <div className="md:col-span-1">
                                                    <h3 className="font-semibold mb-2">Dates</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label htmlFor="startDate" className="block mb-1 text-sm">
                                                                Start date :
                                                            </label>
                                                            <input
                                                                type="date"
                                                                id="startDate"
                                                                name="startDate"
                                                                value={formik.values.startDate}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}

                                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                            {formik.touched.startDate && formik.errors.startDate && (
                                                                <div className="text-red-500 text-xs mt-1">
                                                                    {formik.errors.startDate}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label htmlFor="billingCycle" className="block mb-1 text-sm">
                                                                Billing cycle :
                                                            </label>
                                                            <select name="billingCycle" id="billingCycle"
                                                                value={formik.values.billingCycle}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                                <option value="" selected disabled>-- Select Billing Cycle --</option>

                                                                <option value="weekly">Weekly</option>
                                                                <option value="monthly">Monthly</option>
                                                                <option value="quarterly">Quarterly</option>
                                                                <option value="semi-annual">Semi-Annual (6 months)</option>
                                                                <option value="annual">Annual (1 year)</option>
                                                                <option value="biennial">Biennial (2 years)</option>
                                                                <option value="triennial">Triennial (3 years)</option>
                                                            </select>
                                                            {formik.touched.billingCycle && formik.errors.billingCycle && (
                                                                <div className="text-red-500 text-xs mt-1">
                                                                    {formik.errors.billingCycle}
                                                                </div>
                                                            )}

                                                        </div>


                                                        <div>


                                                            <label htmlFor="dateType" className="block mb-1 text-sm">
                                                                End Date Type:
                                                            </label>
                                                            <select
                                                                id="dateType"
                                                                name="dateType"
                                                                value={dateType}
                                                                onChange={handleDateTypeChange}
                                                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            >
                                                                <option value="" selected disabled>choose type</option>
                                                                <option value="specific">Specific Date</option>
                                                                <option value="lifelong">Life Long</option>
                                                            </select>
                                                            {dateType === 'specific' && (
                                                                <div>

                                                                    <label htmlFor="endDate" className="block mb-1 text-sm">
                                                                        End date :
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        id="endDate"
                                                                        name="endDate"
                                                                        value={formik.values.endDate}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        min={new Date().toISOString().split("T")[0]}
                                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    />
                                                                    {formik.touched.endDate && formik.errors.endDate && (
                                                                        <div className="text-red-500 text-xs mt-1">
                                                                            {formik.errors.endDate}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {dateType === 'lifelong' && (
                                                                <div className="text-gray-600 text-sm mt-1">
                                                                    Billing Period: Life Long
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-4 pt-2">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-sm">Auto Renewal :</span>
                                                            </div>

                                                            <div className="flex gap-6">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="autoRenewal"
                                                                        value="true"
                                                                        checked={formik.values.autoRenewal === true}
                                                                        onChange={() => formik.setFieldValue("autoRenewal", true)}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <span className="text-sm">Yes</span>
                                                                </label>

                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="autoRenewal"
                                                                        value="false"
                                                                        checked={formik.values.autoRenewal === false}
                                                                        onChange={() => formik.setFieldValue("autoRenewal", false)}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <span className="text-sm">No</span>
                                                                </label>
                                                            </div>

                                                            {/* Error message */}
                                                            {formik.touched.autoRenewal && formik.errors.autoRenewal && (
                                                                <div className="text-red-500 text-xs mt-1">
                                                                    {formik.errors.autoRenewal}
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="md:col-span-1 space-y-4">


                                                    {/* <div>
                                                        <label htmlFor="lastPaymentDate" className="block mb-1 mt-8 text-sm">
                                                            Last payment date :
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="lastPaymentDate"
                                                            name="lastPaymentDate"
                                                            value={formik.values.lastPaymentDate}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        {formik.touched.lastPaymentDate && formik.errors.lastPaymentDate && (
                                                            <div className="text-red-500 text-xs mt-1">
                                                                {formik.errors.lastPaymentDate}
                                                            </div>
                                                        )}
                                                    </div> */}

                                                    {/* <div>
                                                        <label htmlFor="nextPaymentDate" className="block mb-1 text-sm">
                                                            Next payment date :
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="nextPaymentDate"
                                                            name="nextPaymentDate"
                                                            value={formik.values.nextPaymentDate}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        {formik.touched.nextPaymentDate && formik.errors.nextPaymentDate && (
                                                            <div className="text-red-500 text-xs mt-1">
                                                                {formik.errors.nextPaymentDate}
                                                            </div>
                                                        )}
                                                    </div> */}

                                                </div>


                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Set Reminder Section */}

                        <div className=" lg:col-span-1 mt-18">
                            <div className="flex">
                                <input id="needreminder" name="needreminder" type="checkbox"
                                    value={needrem}
                                    onChange={() => setneedrem(!needrem)} />
                                <label htmlFor="needreminder">Need customized reminder settings</label>
                            </div>
                            <div>
                                {needrem && (
                                    <div>
                                        <div className="bg-red-200 p-6 rounded-lg h-full">
                                            <h2 className="text-xl font-bold mb-4 ">Set Reminder</h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="billingCycle" className="block mb-1 text-sm">
                                                        Billing Cycle
                                                    </label>
                                                    <div className="relative mt-2">
                                                        <input
                                                            id="billingCycle"
                                                            name="billingCycle"
                                                            value={formik.values.billingCycle}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            readOnly
                                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        {/* <option value="" selected>-- Select Billing Cycle --</option>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                        <option value="quarterly">Quarterly</option>
                                                        <option value="semi-annual">Semi-Annual (6 months)</option>
                                                        <option value="annual">Annual (1 year)</option>
                                                        <option value="biennial">Biennial (2 years)</option>
                                                        <option value="triennial">Triennial (3 years)</option> 
                                                        {/* <option value="one-time">One-Time Payment</option>*/}
                                                        {/* </select> */}



                                                        {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                                                    </div> */}
                                                    </div>
                                                </div>

                                                <div>

                                                    {["quarterly", "semi-annual", "annual", "biennial", "triennial"].includes(formik.values.billingCycle) && (
                                                        <div>

                                                            <label htmlFor="firstReminderMonth" className="block mb-1 text-sm">
                                                                How many months in advance would you like to receive a reminder?
                                                            </label>
                                                            <div className="relative">
                                                                <select type="text"
                                                                    id="firstReminderMonth"
                                                                    name="firstReminderMonth"
                                                                    value={formik.values.firstReminderMonth}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 " >

                                                                    <option value=""></option>
                                                                    {[...Array(6)].map((_, i) => (
                                                                        <option key={i + 1} value={i + 1}>
                                                                            {i + 1}
                                                                        </option>
                                                                    ))}

                                                                </select>


                                                            </div>
                                                            <div>
                                                                <label htmlFor="reminderDay" className="block mb-1 text-sm">
                                                                    reminder day of month
                                                                </label>
                                                                <div className="relative">
                                                                    <select
                                                                        id="reminderDay"
                                                                        name="reminderDay"
                                                                        value={formik.values.reminderDay}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 "
                                                                    >
                                                                        <option value="">Select day</option>
                                                                        {[...Array(31)].map((_, i) => (
                                                                            <option key={i + 1} value={i + 1}>
                                                                                {i + 1}
                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        // </div>
                                                    )}

                                                    {["monthly", "weekly"].includes(formik.values.billingCycle) && (

                                                        <div>
                                                            <label htmlFor="reminderDay" className="block mb-1 text-sm">
                                                                How many days in advance would you like to receive a reminder?
                                                            </label>
                                                            <div className="relative">
                                                                <select
                                                                    id="reminderDay"
                                                                    name="reminderDay"
                                                                    value={formik.values.reminderDay}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 "
                                                                >
                                                                    <option value="" selected>Select day</option>
                                                                    {[...Array(7)].map((_, i) => (
                                                                        <option key={i + 1} value={i + 1}>
                                                                            {i + 1}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                            </div>
                                                        </div>

                                                    )}



                                                </div>




                                                <div>
                                                    <label htmlFor="notificationMethod" className="block mb-1 text-sm">
                                                        notification method
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="notificationMethod"
                                                            name="notificationMethod"
                                                            value={formik.values.notificationMethod}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className="w-full p-2 border rounded appearance-none bg-red-200 pr-10 focus:outline-none focus:ring-1 focus:ring-red-300"
                                                        >
                                                            <option value="">Select method</option>
                                                            <option value="email">Email</option>
                                                            <option value="sms">SMS</option>
                                                            <option value="both">Both</option>
                                                        </select>
                                                        {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                                                            </div> */}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="recipients" className="block mb-1 text-sm">
                                                        Recipients
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="recipients"
                                                        name="recipients"
                                                        placeholder="Enter email addresses separated by commas"
                                                        value={formik.values.recipients}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="w-full p-2 border rounded bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-300"
                                                    />
                                                    {formik.touched.recipients && formik.errors.recipients && (
                                                        <div className="text-red-500 text-xs w-full p-2">
                                                            {formik.errors.recipients}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="customMessage" className="block mb-1 text-sm">
                                                        Custom Message
                                                    </label>
                                                    <textarea
                                                        id="customMessage"
                                                        name="customMessage"
                                                        placeholder="Enter custom message for reminders"
                                                        value={formik.values.customMessage}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        rows={3}
                                                        className="w-full p-2 border rounded bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-300"
                                                    />
                                                </div>
                                                {["quarterly", "semi-annual", "annual", "biennial", "triennial"].includes(formik.values.billingCycle) && (
                                                    <div>
                                                        <div className="flex items-center gap-2 py-2">
                                                            <input
                                                                type="checkbox"
                                                                id="extraReminder"
                                                                checked={extraReminder}
                                                                onChange={() => setExtraReminder(!extraReminder)}
                                                                className="w-4 h-4"
                                                            />
                                                            <label htmlFor="extraReminder" className="text-sm">
                                                                Enable Extra Reminder for Last Month
                                                            </label>
                                                        </div>
                                                        {extraReminder && (

                                                            <div>
                                                                <label htmlFor="daysBeforeEnd" className="block mb-1 text-sm">
                                                                    How many days in advance would you like to receive a reminder?
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="daysBeforeEnd"
                                                                    name="daysBeforeEnd"
                                                                    value={formik.values.daysBeforeEnd}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    className="w-full p-2 border rounded bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-300"
                                                                />
                                                                {formik.touched.daysBeforeEnd && formik.errors.daysBeforeEnd && (
                                                                    <div className="text-red-500 text-xs w-full p-2">
                                                                        {formik.errors.daysBeforeEnd}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Add Subscription
                        </button>
                    </div>
                </form >

                {isAddingNewProvider && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red p-6 rounded-lg  z-[9999] w-[90%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">


                        {/* Open Popup Button */}
                        {/* <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                                        onClick={() => setIsPopupOpen(true)}
                                                    >
                                                        Add New Provider
                                                    </button>
    
                                                    Add Provider Popup */}
                        <Add_providers isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}
                        />

                    </div>
                )}
            </div>
        </div >
    );
}

export default Add_subscription;