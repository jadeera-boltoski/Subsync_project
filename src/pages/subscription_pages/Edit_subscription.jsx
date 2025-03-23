import { useState, useEffect } from 'react';

const Edit_subscription = ({ subscription, onSave, onCancel }) => {
  // Initialize form state with subscription data
  const [formData, setFormData] = useState({
    name: '',
    providerName: '',
    providerContact: '',
    providerEmail: '',
    websiteLink: '',
    cost: '',
    billing_cycle: '',
    next_payment_date: '',
    start_date: '',
    end_date: '',
    status: '',
    payment_status: '',
    auto_renewal: false,
    // Additional fields based on category
    ...(subscription?.subscription_category?.toLowerCase() === 'software' && {
      software_id: '',
      software_version: '',
      software_no_of_users: '',
    }),
    ...(subscription?.subscription_category?.toLowerCase() === 'server' && {
      server_id: '',
      server_type: '',
      server_capacity: '',
    }),
    ...(subscription?.subscription_category?.toLowerCase() === 'domain' && {
      domain_id: '',
      domain_type: '',
      ssl_certification: false,
      ssl_expiry_date: '',
      whois_protection: false,
      name_servers: '',
      hosting_provider: '',
    }),
    ...(subscription?.subscription_category?.toLowerCase() === 'billing' && {
      billingid: '',
      consumer_no: '',
      utility_type: '',
    }),
  });

  // Populate form with subscription data when component mounts
  useEffect(() => {
    if (subscription) {
      setFormData({
        ...subscription,
        // Convert string values to numbers where needed
        cost: subscription.cost.toString(),
        software_no_of_users: subscription.software_no_of_users?.toString() || '',
      });
    }
  }, [subscription]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Format data if needed before sending
    const updatedSubscription = {
      ...formData,
      cost: parseFloat(formData.cost),
      software_no_of_users: formData.software_no_of_users 
        ? parseInt(formData.software_no_of_users, 10) 
        : undefined,
    };
    onSave(updatedSubscription);
  };

  // Render category-specific form fields
  const renderCategoryFields = () => {
    const category = subscription?.subscription_category?.toLowerCase();
    
    switch (category) {
      case 'software':
        return (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Software Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Software ID
                </label>
                <input
                  type="text"
                  name="software_id"
                  value={formData.software_id || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  name="software_version"
                  value={formData.software_version || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Users
                </label>
                <input
                  type="number"
                  name="software_no_of_users"
                  value={formData.software_no_of_users || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        );
        
      case 'server':
        return (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Server Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server ID
                </label>
                <input
                  type="text"
                  name="server_id"
                  value={formData.server_id || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server Type
                </label>
                <input
                  type="text"
                  name="server_type"
                  value={formData.server_type || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server Capacity
                </label>
                <input
                  type="text"
                  name="server_capacity"
                  value={formData.server_capacity || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        );
        
      case 'domain':
        return (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Domain Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain ID
                </label>
                <input
                  type="text"
                  name="domain_id"
                  value={formData.domain_id || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain Type
                </label>
                <input
                  type="text"
                  name="domain_type"
                  value={formData.domain_type || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="ssl_certification"
                  name="ssl_certification"
                  checked={formData.ssl_certification || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="ssl_certification" className="ml-2 text-sm text-gray-700">
                  SSL Certificate
                </label>
              </div>
              {formData.ssl_certification && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSL Expiry Date
                  </label>
                  <input
                    type="date"
                    name="ssl_expiry_date"
                    value={formData.ssl_expiry_date || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              )}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="whois_protection"
                  name="whois_protection"
                  checked={formData.whois_protection || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="whois_protection" className="ml-2 text-sm text-gray-700">
                  WHOIS Protection
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name Servers
                </label>
                <input
                  type="text"
                  name="name_servers"
                  value={formData.name_servers || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hosting Provider
                </label>
                <input
                  type="text"
                  name="hosting_provider"
                  value={formData.hosting_provider || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        );
        
      case 'billing':
        return (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Utility Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing ID
                </label>
                <input
                  type="text"
                  name="billingid"
                  value={formData.billingid || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consumer Number
                </label>
                <input
                  type="text"
                  name="consumer_no"
                  value={formData.consumer_no || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Utility Type
                </label>
                <input
                  type="text"
                  name="utility_type"
                  value={formData.utility_type || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h3 className="text-lg font-semibold">Edit Subscription</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Provider Information */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h4 className="font-medium text-gray-700 mb-3">Provider Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Name
              </label>
              <input
                type="text"
                name="providerName"
                value={formData.providerName || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Contact
              </label>
              <input
                type="text"
                name="providerContact"
                value={formData.providerContact || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Email
              </label>
              <input
                type="email"
                name="providerEmail"
                value={formData.providerEmail || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="websiteLink"
                value={formData.websiteLink || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Category-specific fields */}
        {renderCategoryFields()}

        {/* Billing Information */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h4 className="font-medium text-gray-700 mb-3">Billing Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost (£)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select
                name="billing_cycle"
                value={formData.billing_cycle || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Billing Cycle</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Payment Date
              </label>
              <input
                type="date"
                name="next_payment_date"
                value={formData.next_payment_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                name="payment_status"
                value={formData.payment_status || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h4 className="font-medium text-gray-700 mb-3">Subscription Dates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_renewal"
                name="auto_renewal"
                checked={formData.auto_renewal || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="auto_renewal" className="ml-2 text-sm text-gray-700">
                Auto Renewal
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit_subscription;