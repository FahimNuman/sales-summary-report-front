import React from "react";
import { X } from "lucide-react";

const EditStoreForm = ({
  showEditStoreForm,
  setShowEditStoreForm,
  editStoreData,
  setEditStoreData,
  personnelFields,
  contactFields,
  addPersonnelField,
  updatePersonnelField,
  removePersonnelField,
  addContactField,
  updateContactField,
  removeContactField,
  handleUpdateStore,
  loading,
}) => {
  if (!showEditStoreForm) return null;

  // List of US states
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  // List of European countries plus USA
  const countries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark",
    "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy",
    "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal",
    "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom", "United States"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-800">Edit Store</h3>
          <button
            onClick={() => setShowEditStoreForm(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Store Name *"
            value={editStoreData.storeName || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, storeName: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Address Line 1 *"
            value={editStoreData.address1 || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, address1: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Address Line 2"
            value={editStoreData.address2 || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, address2: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Building"
            value={editStoreData.building || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, building: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="City"
            value={editStoreData.city || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, city: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <select
            value={editStoreData.state || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, state: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select State</option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Zip Code"
            value={editStoreData.zip || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, zip: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <select
            value={editStoreData.country || ""}
            onChange={(e) =>
              setEditStoreData({ ...editStoreData, country: e.target.value })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-1">Personnel</h4>
            {personnelFields.map((field) => (
              <div key={field.id} className="flex items-center gap-1 mb-1.5">
                <input
                  type="text"
                  placeholder="Personnel Name"
                  value={field.value || ""}
                  onChange={(e) => updatePersonnelField(field.id, e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  onClick={() => removePersonnelField(field.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={addPersonnelField}
              className="text-blue-600 hover:text-blue-700 text-xs transition-colors"
            >
              + Add Personnel
            </button>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-1">Contacts</h4>
            {contactFields.map((contact) => (
              <div key={contact.id} className="space-y-1.5 mb-1.5">
                <input
                  type="text"
                  placeholder="Contact Name *"
                  value={contact.personName || ""}
                  onChange={(e) =>
                    updateContactField(contact.id, "personName", e.target.value)
                  }
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contact.email || ""}
                  onChange={(e) =>
                    updateContactField(contact.id, "email", e.target.value)
                  }
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={contact.phone || ""}
                  onChange={(e) =>
                    updateContactField(contact.id, "phone", e.target.value)
                  }
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={contact.website || ""}
                  onChange={(e) =>
                    updateContactField(contact.id, "website", e.target.value)
                  }
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  onClick={() => removeContactField(contact.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={addContactField}
              className="text-blue-600 hover:text-blue-700 text-xs transition-colors"
            >
              + Add Contact
            </button>
          </div>
          <button
            onClick={handleUpdateStore}
            className="w-full bg-blue-600 text-white px-2 py-1.5 rounded-md text-xs hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Store"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStoreForm;