// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Plus, Upload, X, Check, Search, ChevronDown, FileText } from "lucide-react";
// import ColorManagementToggle from "./Color/ColorManagementToggle";
// import CompetitorManagementToggle from "./Competitors/CompetitorManagementToggle";

// const DataEntryForm = ({
//   formData,
//   setFormData,
//   newSheetName,
//   setNewSheetName,
//   newSheetHours,
//   setNewSheetHours,
//   showNewSheetForm,
//   setShowNewSheetForm,
//   editSheetName,
//   setEditSheetName,
//   editSheetHours,
//   setEditSheetHours,
//   showEditSheetModal,
//   setShowEditSheetModal,
//   editSheetId,
//   setEditSheetId,
//   showDeleteSheetModal,
//   setShowDeleteSheetModal,
//   deleteSheetId,
//   setDeleteSheetId,
//   newStoreData,
//   setNewStoreData,
//   showAddStoreForm,
//   setShowAddStoreForm,
//   searchTerm,
//   setSearchTerm,
//   showStoreDropdown,
//   setShowStoreDropdown,
//   uploadedFiles,
//   setUploadedFiles,
//   loading,
//   createNewSheet,
//   editSheet,
//   deleteSheet,
//   addRow,
//   addNewStore,
//   updateStore,
//   filteredStores,
//   selectedStore,
//   availableAddresses,
//   availablePersonnel,
//   handleInputChange,
//   handleFileUpload,
//   removeFile,
//   sheets,
//   showEditStoreForm,
//   setShowEditStoreForm,
//   editStoreData,
//   setEditStoreData,
//   setShowColorManagement,
//   showColorManagement,
//   setShowCompetitorManagement,
//   showCompetitorManagement,
// }) => {
//   useEffect(() => {
//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();
//     const startHour = currentHour >= 9 ? currentHour : 9;
//     const startMinute = currentHour >= 9 ? currentMinute : 0;
//     const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute
//       .toString()
//       .padStart(2, "0")} ${startHour < 12 ? "AM" : "PM"}`;
//     const endTime = "7:00 PM";
//     setNewSheetHours(`${startTime} - ${endTime}`);
//   }, [setNewSheetHours]);

//   const formatDate = (date) => {
//     if (!(date instanceof Date) || isNaN(date)) return "";
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const year = date.getFullYear().toString().slice(-2);
//     return `${month}/${day}/${year}`;
//   };

//   const handleDateChange = (date) => {
//     setNewSheetName(date); // Store as Date object
//   };

//   const handleCreateSheet = () => {
//     if (newSheetName instanceof Date && !isNaN(newSheetName)) {
//       const sheetName = formatDate(newSheetName);
//       if (sheetName) {
//         createNewSheet({ name: sheetName, hours: newSheetHours });
//       } else {
//         console.error("Failed to format sheet name");
//       }
//     } else {
//       console.log("Invalid newSheetName:", newSheetName);
//     }
//     setShowNewSheetForm(false);
//   };

//   // Dynamic personnel fields
//   const [personnelFields, setPersonnelFields] = useState([{ id: Date.now(), value: newStoreData.personnel1 || "" }]);
//   // Dynamic contact fields
//   const [contactFields, setContactFields] = useState([
//     { id: Date.now(), personName: "", email: "", phone: "", website: "" },
//   ]);

//   const addPersonnelField = () => {
//     setPersonnelFields((prev) => [...prev, { id: Date.now(), value: "" }]);
//   };

//   const updatePersonnelField = (id, value) => {
//     setPersonnelFields((prev) =>
//       prev.map((field) => (field.id === id ? { ...field, value } : field))
//     );
//   };

//   const removePersonnelField = (id) => {
//     setPersonnelFields((prev) => prev.filter((field) => field.id !== id));
//   };

//   const addContactField = () => {
//     setContactFields((prev) => [
//       ...prev,
//       { id: Date.now(), personName: "", email: "", phone: "", website: "" },
//     ]);
//   };

//   const updateContactField = (id, field, value) => {
//     setContactFields((prev) =>
//       prev.map((contact) =>
//         contact.id === id ? { ...contact, [field]: value } : contact
//       )
//     );
//   };

//   const removeContactField = (id) => {
//     setContactFields((prev) => prev.filter((contact) => contact.id !== id));
//   };

//   const handleAddStore = () => {
//     const personnel = personnelFields
//       .map((field) => field.value)
//       .filter((value) => value.trim() && value !== "Staff");
//     const contacts = contactFields.map((contact) => ({
//       personName: contact.personName,
//       email: contact.email,
//       phone: contact.phone,
//       website: contact.website,
//     }));
//     addNewStore({ ...newStoreData, personnel, contacts });
//     setShowAddStoreForm(false);
//     setPersonnelFields([{ id: Date.now(), value: "" }]);
//     setContactFields([{ id: Date.now(), personName: "", email: "", phone: "", website: "" }]);
//     setNewStoreData({
//       storeName: "",
//       address1: "",
//       address2: "",
//       personnel: [],
//       contacts: [],
//     });
//   };

//   const handleUpdateStore = () => {
//     const personnel = personnelFields
//       .map((field) => field.value)
//       .filter((value) => value.trim() && value !== "Staff");
//     const contacts = contactFields.map((contact) => ({
//       personName: contact.personName,
//       email: contact.email,
//       phone: contact.phone,
//       website: contact.website,
//     }));
//     updateStore({
//       storeId: editStoreData.storeId,
//       storeName: editStoreData.storeName,
//       address1: editStoreData.address1,
//       address2: editStoreData.address2,
//       personnel,
//       contacts,
//     });
//     setShowEditStoreForm(false);
//     setPersonnelFields([{ id: Date.now(), value: "" }]);
//     setContactFields([{ id: Date.now(), personName: "", email: "", phone: "", website: "" }]);
//     setEditStoreData({
//       storeId: null,
//       storeName: "",
//       address1: "",
//       address2: "",
//       personnel: [],
//       contacts: [],
//     });
//   };

//   useEffect(() => {
//     if (showEditStoreForm) {
//       setPersonnelFields(
//         editStoreData.personnel.length > 0
//           ? editStoreData.personnel.map((p, index) => ({ id: Date.now() + index, value: p }))
//           : [{ id: Date.now(), value: "" }]
//       );
//       setContactFields(
//         editStoreData.contacts.length > 0
//           ? editStoreData.contacts.map((c, index) => ({
//               id: Date.now() + index,
//               personName: c.personName || "",
//               email: c.email || "",
//               phone: c.phone || "",
//               website: c.website || "",
//             }))
//           : [{ id: Date.now(), personName: "", email: "", phone: "", website: "" }]
//       );
//     }
//   }, [showEditStoreForm, editStoreData]);

//   return (
//     <div className="p-1 bg-white border-r border-gray-200 h-full">
//       <ColorManagementToggle
//         setShowColorManagement={setShowColorManagement}
//         showColorManagement={showCompetitorManagement ? false : showColorManagement}
//       />
//       <CompetitorManagementToggle
//         setShowCompetitorManagement={setShowCompetitorManagement}
//         showCompetitorManagement={showColorManagement ? false : showCompetitorManagement}
//       />
//       {showNewSheetForm && (
//         <div className="bg-white rounded-md shadow-sm p-2 mb-2 border border-gray-200">
//           <h3 className="text-sm font-semibold mb-1 text-gray-900">Create New Sheet</h3>
//           <div className="grid grid-cols-2 gap-1">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Sheet Name</label>
//               <DatePicker
//                 selected={newSheetName instanceof Date && !isNaN(newSheetName) ? newSheetName : null}
//                 onChange={handleDateChange}
//                 dateFormat="MM/dd/yy"
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholderText="Select date"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Hours</label>
//               <input
//                 type="text"
//                 value={newSheetHours}
//                 onChange={(e) => setNewSheetHours(e.target.value)}
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="e.g., 9:00 AM - 7:00 PM"
//               />
//             </div>
//           </div>
//           <div className="flex gap-1 mt-2">
//             <button
//               onClick={handleCreateSheet}
//               className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
//               disabled={loading}
//             >
//               {loading ? (
//                 <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//               ) : (
//                 "Create Sheet"
//               )}
//             </button>
//             <button
//               onClick={() => setShowNewSheetForm(false)}
//               className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//       {showEditSheetModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
//           <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-sm font-semibold text-gray-900">Edit Sheet</h3>
//               <button
//                 onClick={() => {
//                   setShowEditSheetModal(false);
//                   setEditSheetId(null);
//                   setEditSheetName("");
//                   setEditSheetHours("");
//                 }}
//                 className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </div>
//             <div className="space-y-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-0.5">Sheet Name</label>
//                 <input
//                   type="text"
//                   value={editSheetName}
//                   onChange={(e) => setEditSheetName(e.target.value)}
//                   className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                   placeholder="Enter sheet name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-0.5">Hours</label>
//                 <input
//                   type="text"
//                   value={editSheetHours}
//                   onChange={(e) => setEditSheetHours(e.target.value)}
//                   className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                   placeholder="e.g., 9:00 AM - 7:00 PM"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-1 mt-2">
//               <button
//                 onClick={editSheet}
//                 className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
//                 disabled={loading || !editSheetName.trim()}
//               >
//                 {loading ? (
//                   <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowEditSheetModal(false);
//                   setEditSheetId(null);
//                   setEditSheetName("");
//                   setEditSheetHours("");
//                 }}
//                 className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDeleteSheetModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
//           <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-sm font-semibold text-gray-900">Delete Sheet</h3>
//               <button
//                 onClick={() => {
//                   setShowDeleteSheetModal(false);
//                   setDeleteSheetId(null);
//                 }}
//                 className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </div>
//             <p className="text-sm text-gray-600 mb-2">
//               Are you sure you want to delete the sheet "{sheets.find((s) => s._id === deleteSheetId)?.name}"? This action cannot be undone.
//             </p>
//             <div className="flex gap-1 mt-2">
//               <button
//                 onClick={deleteSheet}
//                 className="bg-red-600 text-white px-2 py-0.5 rounded-md hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowDeleteSheetModal(false);
//                   setDeleteSheetId(null);
//                 }}
//                 className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showAddStoreForm && (
//         <div className="bg-white rounded-md shadow-sm p-2 mb-2 border border-gray-200">
//           <h3 className="text-sm font-semibold mb-1 text-gray-900">Add New Business</h3>
//           <div className="grid grid-cols-1 gap-1">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Business Name *</label>
//               <input
//                 type="text"
//                 value={newStoreData.storeName}
//                 onChange={(e) =>
//                   setNewStoreData((prev) => ({ ...prev, storeName: e.target.value }))
//                 }
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="Enter business name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Address 1 *</label>
//               <input
//                 type="text"
//                 value={newStoreData.address1}
//                 onChange={(e) =>
//                   setNewStoreData((prev) => ({ ...prev, address1: e.target.value }))
//                 }
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="Enter primary address"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Address 2</label>
//               <input
//                 type="text"
//                 value={newStoreData.address2}
//                 onChange={(e) =>
//                   setNewStoreData((prev) => ({ ...prev, address2: e.target.value }))
//                 }
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="Enter secondary address (optional)"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Personnel</label>
//               {personnelFields.map((field, index) => (
//                 <div key={field.id} className="flex items-center gap-1 mb-1">
//                   <input
//                     type="text"
//                     value={field.value}
//                     onChange={(e) => updatePersonnelField(field.id, e.target.value)}
//                     className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                     placeholder={`Person ${index + 1}`}
//                   />
//                   {index > 0 && (
//                     <button
//                       onClick={() => removePersonnelField(field.id)}
//                       className="p-0.5 text-red-500 hover:text-red-700 transition-all"
//                     >
//                       <X className="w-2.5 h-2.5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={addPersonnelField}
//                 className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mt-1"
//               >
//                 <Plus className="w-2.5 h-2.5" /> Add Personnel
//               </button>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Contacts</label>
//               {contactFields.map((contact, index) => (
//                 <div key={contact.id} className="mb-2 p-2 border border-gray-200 rounded-md">
//                   <div className="grid grid-cols-1 gap-1">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Person Name *</label>
//                       <input
//                         type="text"
//                         value={contact.personName}
//                         onChange={(e) => updateContactField(contact.id, "personName", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Email</label>
//                       <input
//                         type="email"
//                         value={contact.email}
//                         onChange={(e) => updateContactField(contact.id, "email", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact email"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Phone</label>
//                       <input
//                         type="text"
//                         value={contact.phone}
//                         onChange={(e) => updateContactField(contact.id, "phone", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact phone"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Website</label>
//                       <input
//                         type="text"
//                         value={contact.website}
//                         onChange={(e) => updateContactField(contact.id, "website", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact website"
//                       />
//                     </div>
//                   </div>
//                   {index > 0 && (
//                     <button
//                       onClick={() => removeContactField(contact.id)}
//                       className="mt-1 p-0.5 text-red-500 hover:text-red-700 transition-all"
//                     >
//                       <X className="w-2.5 h-2.5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={addContactField}
//                 className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mt-1"
//               >
//                 <Plus className="w-2.5 h-2.5" /> Add Contact
//               </button>
//             </div>
//           </div>
//           <div className="flex gap-1 mt-2">
//             <button
//               onClick={handleAddStore}
//               className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
//               disabled={loading || !newStoreData.storeName.trim() || !newStoreData.address1.trim() || !contactFields.some(contact => contact.personName.trim())}
//             >
//               {loading ? (
//                 <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//               ) : (
//                 "Add Business"
//               )}
//             </button>
//             <button
//               onClick={() => {
//                 setShowAddStoreForm(false);
//                 setNewStoreData({
//                   storeName: "",
//                   address1: "",
//                   address2: "",
//                   personnel: [],
//                   contacts: [],
//                 });
//                 setPersonnelFields([{ id: Date.now(), value: "" }]);
//                 setContactFields([{ id: Date.now(), personName: "", email: "", phone: "", website: "" }]);
//               }}
//               className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//       {showEditStoreForm && (
//         <div className="bg-white rounded-md shadow-sm p-2 mb-2 border border-gray-200">
//           <h3 className="text-sm font-semibold mb-1 text-gray-900">Edit Business</h3>
//           <div className="grid grid-cols-1 gap-1">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Business Name *</label>
//               <input
//                 type="text"
//                 value={editStoreData.storeName}
//                 onChange={(e) =>
//                   setEditStoreData((prev) => ({ ...prev, storeName: e.target.value }))
//                 }
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="Enter business name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Address 1 *</label>
//               <input
//                 type="text"
//                 value={editStoreData.address1}
//                 onChange={(e) =>
//                   setEditStoreData((prev) => ({ ...prev, address1: e.target.value }))
//                 }
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="Enter primary address"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Address 2</label>
//               <input
//                 type="text"
//                 value={editStoreData.address2}
//                 onChange={(e) =>
//                   setEditStoreData((prev) => ({ ...prev, address2: e.target.value }))
//                 }
//                 className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                 placeholder="Enter secondary address (optional)"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Personnel</label>
//               {personnelFields.map((field, index) => (
//                 <div key={field.id} className="flex items-center gap-1 mb-1">
//                   <input
//                     type="text"
//                     value={field.value}
//                     onChange={(e) => updatePersonnelField(field.id, e.target.value)}
//                     className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                     placeholder={`Person ${index + 1}`}
//                   />
//                   {index > 0 && (
//                     <button
//                       onClick={() => removePersonnelField(field.id)}
//                       className="p-0.5 text-red-500 hover:text-red-700 transition-all"
//                     >
//                       <X className="w-2.5 h-2.5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={addPersonnelField}
//                 className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mt-1"
//               >
//                 <Plus className="w-2.5 h-2.5" /> Add Personnel
//               </button>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-0.5">Contacts</label>
//               {contactFields.map((contact, index) => (
//                 <div key={contact.id} className="mb-2 p-2 border border-gray-200 rounded-md">
//                   <div className="grid grid-cols-1 gap-1">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Person Name *</label>
//                       <input
//                         type="text"
//                         value={contact.personName}
//                         onChange={(e) => updateContactField(contact.id, "personName", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Email</label>
//                       <input
//                         type="email"
//                         value={contact.email}
//                         onChange={(e) => updateContactField(contact.id, "email", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact email"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Phone</label>
//                       <input
//                         type="text"
//                         value={contact.phone}
//                         onChange={(e) => updateContactField(contact.id, "phone", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact phone"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-0.5">Website</label>
//                       <input
//                         type="text"
//                         value={contact.website}
//                         onChange={(e) => updateContactField(contact.id, "website", e.target.value)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Contact website"
//                       />
//                     </div>
//                   </div>
//                   {index > 0 && (
//                     <button
//                       onClick={() => removeContactField(contact.id)}
//                       className="mt-1 p-0.5 text-red-500 hover:text-red-700 transition-all"
//                     >
//                       <X className="w-2.5 h-2.5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={addContactField}
//                 className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mt-1"
//               >
//                 <Plus className="w-2.5 h-2.5" /> Add Contact
//               </button>
//             </div>
//           </div>
//           <div className="flex gap-1 mt-2">
//             <button
//               onClick={handleUpdateStore}
//               className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
//               disabled={loading || !editStoreData.storeName.trim() || !editStoreData.address1.trim() || !contactFields.some(contact => contact.personName.trim())}
//             >
//               {loading ? (
//                 <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//               ) : (
//                 "Save Changes"
//               )}
//             </button>
//             <button
//               onClick={() => {
//                 setShowEditStoreForm(false);
//                 setEditStoreData({
//                   storeId: null,
//                   storeName: "",
//                   address1: "",
//                   address2: "",
//                   personnel: [],
//                   contacts: [],
//                 });
//                 setPersonnelFields([{ id: Date.now(), value: "" }]);
//                 setContactFields([{ id: Date.now(), personName: "", email: "", phone: "", website: "" }]);
//               }}
//               className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//       <div className="bg-white rounded-md shadow-sm p-2 border border-gray-200">
//         <div className="flex items-center justify-between mb-1">
//           <h3 className="text-sm font-semibold text-gray-900">Data Entry</h3>
//           <button
//             onClick={() => setShowAddStoreForm(true)}
//             className="flex items-center gap-0.5 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all"
//           >
//             <Plus className="w-2.5 h-2.5" /> Add Store
//           </button>
//         </div>
//         <div className="grid grid-cols-1 gap-1">
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Store Name *</label>
//             <div className="flex">
//               <div className="relative flex-1">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setShowStoreDropdown(true);
//                   }}
//                   onFocus={() => setShowStoreDropdown(true)}
//                   className="w-full px-1 py-0.5 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                   placeholder="Search stores..."
//                 />
//                 <Search className="absolute right-1 top-1.5 w-2.5 h-2.5 text-gray-400" />
//               </div>
//               <button
//                 onClick={() => setShowStoreDropdown(!showStoreDropdown)}
//                 className="px-1 py-0.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-all"
//               >
//                 <ChevronDown className="w-2.5 h-2.5" />
//               </button>
//             </div>
//             {showStoreDropdown && (
//               <div className="absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
//                 {filteredStores.length === 0 ? (
//                   <div className="px-1 py-0.5 text-sm text-gray-600">No stores found</div>
//                 ) : (
//                   filteredStores.map((store) => (
//                     <button
//                       key={store._id}
//                       onClick={() => {
//                         handleInputChange("storeName", store.storeName);
//                         setShowStoreDropdown(false);
//                         setSearchTerm("");
//                       }}
//                       className="w-full px-1 py-0.5 text-left hover:bg-gray-100 transition-all text-sm"
//                     >
//                       {store.storeName}
//                     </button>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Address</label>
//             <select
//               value={formData.address}
//               onChange={(e) => handleInputChange("address", e.target.value)}
//               className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//               disabled={!selectedStore}
//             >
//               <option value="">Select address</option>
//               {availableAddresses.map((address, index) => (
//                 <option key={index} value={address}>
//                   {address}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Personnel</label>
//             <select
//               value={formData.personnel}
//               onChange={(e) => handleInputChange("personnel", e.target.value)}
//               className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//               disabled={!selectedStore}
//             >
//               <option value="">Select personnel</option>
//               {availablePersonnel.map((person, index) => (
//                 <option key={index} value={person}>
//                   {person}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Insight</label>
//             <textarea
//               value={formData.insight}
//  hostage
//               onChange={(e) => handleInputChange("insight", e.target.value)}
//               className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//               rows="2"
//               placeholder="Enter insights..."
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Validation</label>
//             <div className="flex gap-1">
//               <button
//                 type="button"
//                 onClick={() => handleInputChange("validation", "Validated")}
//                 className={`flex-1 px-1 py-0.5 rounded-md text-sm transition-all ${
//                   formData.validation === "Validated"
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 Validated
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleInputChange("validation", "Not Validated")}
//                 className={`flex-1 px-1 py-0.5 rounded-md text-sm transition-all ${
//                   formData.validation === "Not Validated"
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 Not Validated
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Validation Notes</label>
//             <textarea
//               value={formData.validationNotes}
//               onChange={(e) => handleInputChange("validationNotes", e.target.value)}
//               className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//               rows="2"
//               placeholder="Enter validation notes..."
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Competitor Analysis</label>
//             <textarea
//               value={formData.competitorAnalysis}
//               onChange={(e) => handleInputChange("competitorAnalysis", e.target.value)}
//               className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//               rows="2"
//               placeholder="Competitor analysis..."
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-0.5">Images</label>
//             <div className="border-2 border-dashed border-gray-300 rounded-md p-1 hover:border-blue-400 transition-all">
//               <input
//                 type="file"
//                 id="file-upload"
//                 accept="image/jpeg, image/png, application/pdf"
//                 multiple
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="flex flex-col items-center justify-center cursor-pointer"
//               >
//                 <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
//                 <span className="text-sm text-gray-600">Upload or drag and drop</span>
//                 <span className="text-sm text-gray-500">Images, PDFs</span>
//               </label>
//             </div>
//             {uploadedFiles.length > 0 && (
//               <div className="mt-1 space-y-0.5">
//                 {uploadedFiles.map((file) => (
//                   <div
//                     key={file.id}
//                     className="flex items-center justify-between bg-gray-50 p-1 rounded-md"
//                   >
//                     <div className="flex items-center gap-1">
//                       {file.type.startsWith("image/") && file.url ? (
//                         <img
//                           src={file.url || ""}
//                           alt={file.name}
//                           className="w-4 h-4 object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="w-4 h-4 bg-blue-100 rounded-md flex items-center justify-center">
//                           <FileText className="w-2.5 h-2.5 text-blue-600" />
//                         </div>
//                       )}
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{file.name}</p>
//                         <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => removeFile(file.id)}
//                       className="p-0.5 text-red-500 hover:text-red-700 transition-all"
//                     >
//                       <X className="w-2.5 h-2.5" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         <button
//           onClick={addRow}
//           className="w-full mt-2 bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
//           disabled={loading || !formData.storeName.trim()}
//         >
//           {loading ? (
//             <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//           ) : (
//             "Add Entry"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DataEntryForm;