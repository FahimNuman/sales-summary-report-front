import React, { useState, useEffect } from "react";
import AddStoreForm from "./AddStoreForm";
import EditStoreForm from "./EditStoreForm";
import { Search, ChevronDown, X } from "lucide-react";

const StoreManagement = ({ stores, setStores, API_URL, fetchWithRetry }) => {
  const [showAddStoreForm, setShowAddStoreForm] = useState(false);
  const [showEditStoreForm, setShowEditStoreForm] = useState(false);
  const [editStoreData, setEditStoreData] = useState({
    storeId: null,
    storeName: "",
    address1: "",
    address2: "",
    building: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    personnel: [],
    contacts: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStore = (store) => {
    setEditStoreData({
      storeId: store._id,
      storeName: store.storeName || "",
      address1: store.address1 || "",
      address2: store.address2 || "",
      building: store.building || "",
      city: store.city || "",
      state: store.state || "",
      zip: store.zip || "",
      country: store.country || "",
      personnel: Array.isArray(store.personnel) ? store.personnel : [],
      contacts: Array.isArray(store.contacts) ? store.contacts : [],
    });
    setShowEditStoreForm(true);
    setShowStoreDropdown(false);
    setSearchTerm("");
  };

  const handleDeleteStore = async (storeId) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/stores/${storeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete store: ${errorText}`);
      }
      setStores((prev) => prev.filter((store) => store._id !== storeId));
      alert("Store deleted successfully");
      setShowStoreDropdown(false);
      setSearchTerm("");
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete store: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (newStore) => {
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStore),
      });
      if (!response.ok) throw new Error("Failed to add store");
      const addedStore = await response.json();
      setStores((prev) => [...prev, addedStore]);
      setShowAddStoreForm(false);
    } catch (error) {
      console.error("Error adding store:", error);
      alert("Failed to add store: " + error.message);
    }
  };

  const handleUpdateStore = async (storeData) => {
    try {
      setLoading(true);
      const response = await fetchWithRetry(`${API_URL}/api/sheets/stores/${storeData.storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: storeData.storeName,
          address1: storeData.address1,
          address2: storeData.address2,
          building: storeData.building,
          city: storeData.city,
          state: storeData.state,
          zip: storeData.zip,
          country: storeData.country,
          personnel: storeData.personnel,
          contacts: storeData.contacts,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update store: ${errorText}`);
      }
      const updatedStore = await response.json();
      setStores((prev) =>
        prev.map((store) => (store._id === storeData.storeId ? updatedStore : store))
      );
      setShowEditStoreForm(false);
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Failed to update store: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Store Management</h2>
        <button
          onClick={() => setShowAddStoreForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Add Store
        </button>
      </div>
      <div className="relative mb-4">
        <div className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowStoreDropdown(true);
              }}
              onFocus={() => setShowStoreDropdown(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              placeholder="Search stores..."
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={() => setShowStoreDropdown(!showStoreDropdown)}
            className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        {showStoreDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredStores.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-600">No stores found</div>
            ) : (
              filteredStores.map((store) => (
                <div key={store._id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <button
                    onClick={() => handleEditStore(store)}
                    className="w-full text-left hover:bg-gray-100 transition-all"
                  >
                    {store.storeName}
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <AddStoreForm
        showAddStoreForm={showAddStoreForm}
        setShowAddStoreForm={setShowAddStoreForm}
        newStoreData={{ /* Define initial state as needed */ }}
        setNewStoreData={() => {}} // Pass appropriate setter
        personnelFields={[{ id: "1", value: "" }]} // Example
        contactFields={[{ id: "1", personName: "", email: "", phone: "", website: "" }]} // Example
        addPersonnelField={() => {}} // Implement as needed
        updatePersonnelField={() => {}} // Implement as needed
        removePersonnelField={() => {}} // Implement as needed
        addContactField={() => {}} // Implement as needed
        updateContactField={() => {}} // Implement as needed
        removeContactField={() => {}} // Implement as needed
        handleAddStore={handleAddStore}
        loading={loading}
      />
      <EditStoreForm
        showEditStoreForm={showEditStoreForm}
        setShowEditStoreForm={setShowEditStoreForm}
        editStoreData={editStoreData}
        setEditStoreData={setEditStoreData}
        personnelFields={[{ id: "1", value: "" }]} // Example
        contactFields={[{ id: "1", personName: "", email: "", phone: "", website: "" }]} // Example
        addPersonnelField={() => {}} // Implement as needed
        updatePersonnelField={() => {}} // Implement as needed
        removePersonnelField={() => {}} // Implement as needed
        addContactField={() => {}} // Implement as needed
        updateContactField={() => {}} // Implement as needed
        removeContactField={() => {}} // Implement as needed
        handleUpdateStore={handleUpdateStore}
        loading={loading}
      />
    </div>
  );
};

export default StoreManagement;