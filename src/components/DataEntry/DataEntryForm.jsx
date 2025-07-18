import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ColorManagementToggle from "../Color/ColorManagementToggle";
import CompetitorManagementToggle from "../Competitors/CompetitorManagementToggle";
import NewSheetForm from "./NewSheetForm";
import EditSheetModal from "./EditSheetModal";
import DeleteSheetModal from "./DeleteSheetModal";
import DataEntryMainForm from "./DataEntryMainForm";
import AddStoreForm from "../Stores/AddStoreForm";
import EditStoreForm from "../Stores/EditStoreForm";

const DataEntryForm = ({
  formData,
  setFormData,
  newSheetName,
  setNewSheetName,
  newSheetHours,
  setNewSheetHours,
  showNewSheetForm,
  setShowNewSheetForm,
  editSheetName,
  setEditSheetName,
  editSheetHours,
  setEditSheetHours,
  showEditSheetModal,
  setShowEditSheetModal,
  editSheetId,
  setEditSheetId,
  showDeleteSheetModal,
  setShowDeleteSheetModal,
  deleteSheetId,
  setDeleteSheetId,
  newStoreData,
  setNewStoreData,
  showAddStoreForm,
  setShowAddStoreForm,
  searchTerm,
  setSearchTerm,
  showStoreDropdown,
  setShowStoreDropdown,
  uploadedFiles,
  setUploadedFiles,
  loading,
  createNewSheet,
  editSheet,
  deleteSheet,
  addRow,
  addNewStore,
  updateStore,
  filteredStores,
  selectedStore,
  availableAddresses,
  availablePersonnel,
  handleInputChange,
  handleFileUpload,
  removeFile,
  sheets,
  showEditStoreForm,
  setShowEditStoreForm,
  editStoreData,
  setEditStoreData,
  setShowColorManagement,
  showColorManagement,
  setShowCompetitorManagement,
  showCompetitorManagement,
  setShowItemManagement,
  showItemManagement,
  competitorAnalysisOptions,
}) => {
  const [personnelFields, setPersonnelFields] = useState([
    { id: uuidv4(), value: "" },
  ]);
  const [contactFields, setContactFields] = useState([
    { id: uuidv4(), personName: "", email: "", phone: "", website: "" },
  ]);

  const addPersonnelField = () => {
    setPersonnelFields((prev) => [...prev, { id: uuidv4(), value: "" }]);
  };

  const updatePersonnelField = (id, value) => {
    setPersonnelFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const removePersonnelField = (id) => {
    setPersonnelFields((prev) => prev.filter((field) => field.id !== id));
  };

  const addContactField = () => {
    setContactFields((prev) => [
      ...prev,
      { id: uuidv4(), personName: "", email: "", phone: "", website: "" },
    ]);
  };

  const updateContactField = (id, field, value) => {
    setContactFields((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const removeContactField = (id) => {
    setContactFields((prev) => prev.filter((contact) => contact.id !== id));
  };

  const handleAddStore = () => {
    if (!newStoreData.storeName.trim() || !newStoreData.address1.trim()) {
      alert("Store name and primary address are required");
      return;
    }
    if (
      contactFields.some(
        (contact) =>
          contact.personName.trim() &&
          !contact.email &&
          !contact.phone &&
          !contact.website
      )
    ) {
      alert(
        "All contacts must have at least one contact detail (email, phone, or website)"
      );
      return;
    }
    const personnel = personnelFields
      .map((field) => field.value)
      .filter((value) => value.trim() && value !== "Staff");
    const contacts = contactFields
      .filter((contact) => contact.personName.trim())
      .map(({ id, ...rest }) => rest);
    addNewStore({
      ...newStoreData,
      personnel,
      contacts,
    });
    setShowAddStoreForm(false);
    setPersonnelFields([{ id: uuidv4(), value: "" }]);
    setContactFields([
      { id: uuidv4(), personName: "", email: "", phone: "", website: "" },
    ]);
    setNewStoreData({
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
  };

  const handleUpdateStore = () => {
    if (!editStoreData.storeName.trim() || !editStoreData.address1.trim()) {
      alert("Store name and primary address are required");
      return;
    }
    if (
      contactFields.some(
        (contact) =>
          contact.personName.trim() &&
          !contact.email &&
          !contact.phone &&
          !contact.website
      )
    ) {
      alert(
        "All contacts must have at least one contact detail (email, phone, or website)"
      );
      return;
    }
    const personnel = personnelFields
      .map((field) => field.value)
      .filter((value) => value.trim() && value !== "Staff");
    const contacts = contactFields
      .filter((contact) => contact.personName.trim())
      .map(({ id, ...rest }) => rest);
    updateStore({
      storeId: editStoreData.storeId,
      storeName: editStoreData.storeName,
      address1: editStoreData.address1,
      address2: editStoreData.address2,
      building: editStoreData.building,
      city: editStoreData.city,
      state: editStoreData.state,
      zip: editStoreData.zip,
      country: editStoreData.country,
      personnel,
      contacts,
    });
    setShowEditStoreForm(false);
    setPersonnelFields([{ id: uuidv4(), value: "" }]);
    setContactFields([
      { id: uuidv4(), personName: "", email: "", phone: "", website: "" },
    ]);
    setEditStoreData({
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
  };

  useEffect(() => {
    if (showEditStoreForm && editStoreData.storeId) {
      const personnel = Array.isArray(editStoreData.personnel)
        ? editStoreData.personnel.map((p) => ({ id: uuidv4(), value: p || "" }))
        : [{ id: uuidv4(), value: "" }];
      const contacts = Array.isArray(editStoreData.contacts)
        ? editStoreData.contacts.map((c) => ({
            id: uuidv4(),
            personName: c.personName || "",
            email: c.email || "",
            phone: c.phone || "",
            website: c.website || "",
          }))
        : [{ id: uuidv4(), personName: "", email: "", phone: "", website: "" }];
      setPersonnelFields(personnel);
      setContactFields(contacts);
    } else {
      setPersonnelFields([{ id: uuidv4(), value: "" }]);
      setContactFields([
        { id: uuidv4(), personName: "", email: "", phone: "", website: "" },
      ]);
    }
  }, [showEditStoreForm, editStoreData]);

  return (
    <div className="p-1 bg-white border-r border-gray-200 h-full">
      <ColorManagementToggle
        setShowColorManagement={setShowColorManagement}
        showColorManagement={showCompetitorManagement ? false : showColorManagement}
      />
      <CompetitorManagementToggle
        setShowCompetitorManagement={setShowCompetitorManagement}
        showCompetitorManagement={showColorManagement ? false : showCompetitorManagement}
      />
      <NewSheetForm
        newSheetName={newSheetName}
        setNewSheetName={setNewSheetName}
        newSheetHours={newSheetHours}
        setNewSheetHours={setNewSheetHours}
        showNewSheetForm={showNewSheetForm}
        setShowNewSheetForm={setShowNewSheetForm}
        loading={loading}
        createNewSheet={createNewSheet}
      />
      <EditSheetModal
        editSheetName={editSheetName}
        setEditSheetName={setEditSheetName}
        editSheetHours={editSheetHours}
        setEditSheetHours={setEditSheetHours}
        showEditSheetModal={showEditSheetModal}
        setShowEditSheetModal={setShowEditSheetModal}
        editSheetId={editSheetId}
        setEditSheetId={setEditSheetId}
        loading={loading}
        editSheet={editSheet}
      />
      <DeleteSheetModal
        showDeleteSheetModal={showDeleteSheetModal}
        setShowDeleteSheetModal={setShowDeleteSheetModal}
        deleteSheetId={deleteSheetId}
        setDeleteSheetId={setDeleteSheetId}
        loading={loading}
        deleteSheet={deleteSheet}
        sheets={sheets}
      />
      <AddStoreForm
        showAddStoreForm={showAddStoreForm}
        setShowAddStoreForm={setShowAddStoreForm}
        newStoreData={newStoreData}
        setNewStoreData={setNewStoreData}
        personnelFields={personnelFields}
        contactFields={contactFields}
        addPersonnelField={addPersonnelField}
        updatePersonnelField={updatePersonnelField}
        removePersonnelField={removePersonnelField}
        addContactField={addContactField}
        updateContactField={updateContactField}
        removeContactField={removeContactField}
        handleAddStore={handleAddStore}
        loading={loading}
      />
      <EditStoreForm
        showEditStoreForm={showEditStoreForm}
        setShowEditStoreForm={setShowEditStoreForm}
        editStoreData={editStoreData}
        setEditStoreData={setEditStoreData}
        personnelFields={personnelFields}
        contactFields={contactFields}
        addPersonnelField={addPersonnelField}
        updatePersonnelField={updatePersonnelField}
        removePersonnelField={removePersonnelField}
        addContactField={addContactField}
        updateContactField={updateContactField}
        removeContactField={removeContactField}
        handleUpdateStore={handleUpdateStore}
        loading={loading}
      />
      <DataEntryMainForm
        formData={formData}
        setFormData={setFormData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showStoreDropdown={showStoreDropdown}
        setShowStoreDropdown={setShowStoreDropdown}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        loading={loading}
        addRow={addRow}
        filteredStores={filteredStores}
        selectedStore={selectedStore}
        availableAddresses={availableAddresses}
        availablePersonnel={availablePersonnel}
        handleInputChange={handleInputChange}
        handleFileUpload={handleFileUpload}
        removeFile={removeFile}
        setShowAddStoreForm={setShowAddStoreForm}
        competitorAnalysisOptions={competitorAnalysisOptions}
      />
    </div>
    
  );
};

export default DataEntryForm;