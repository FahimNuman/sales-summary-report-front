import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import DataEntryForm from "../components/DataEntry/DataEntryForm";
import DataTable from "./DataTable";
import ColorManagement from "./Color/ColorManagement";
import CompetitorManagement from "./Competitors/CompetitorManagement";
import ItemManagement from "./Items/ItemManagement";
import ItemManagementToggle from "./Items/ItemManagementToggle";
import { exportAllToExcel } from "@/utils/export";
import { Mail, MessageCircle, Share2, Download, Search, ChevronDown, X } from "lucide-react";

const EnhancedSalesSummaryTool = () => {
  const router = useRouter();
  const [storeData, setStoreData] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [showNewSheetForm, setShowNewSheetForm] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");
  const [newSheetHours, setNewSheetHours] = useState("3:11 PM - 7:00 PM");
  const [showEditSheetModal, setShowEditSheetModal] = useState(false);
  const [editSheetId, setEditSheetId] = useState(null);
  const [editSheetName, setEditSheetName] = useState("");
  const [editSheetHours, setEditSheetHours] = useState("");
  const [showDeleteSheetModal, setShowDeleteSheetModal] = useState(false);
  const [deleteSheetId, setDeleteSheetId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    storeName: "",
    address: "",
    personnel: "",
    insight: "",
    validation: "",
    validationNotes: "",
    files: [],
    competitorAnalysis: { competitor: "", item: "", color: "" },
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [availableAddresses, setAvailableAddresses] = useState([]);
  const [availablePersonnel, setAvailablePersonnel] = useState([]);
  const [showAddStoreForm, setShowAddStoreForm] = useState(false);
  const [newStoreData, setNewStoreData] = useState({
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [storeListSearchTerm, setStoreListSearchTerm] = useState("");
  const [showStoreListDropdown, setShowStoreListDropdown] = useState(false);
  const [colors, setColors] = useState([]);
  const [showAddColorForm, setShowAddColorForm] = useState(false);
  const [showEditColorForm, setShowEditColorForm] = useState(false);
  const [editColorData, setEditColorData] = useState({ colorId: null, name: "", hexCode: "" });
  const [showDeleteColorModal, setShowDeleteColorModal] = useState(false);
  const [deleteColorId, setDeleteColorId] = useState(null);
  const [showColorManagement, setShowColorManagement] = useState(false);
  const [competitors, setCompetitors] = useState([]);
  const [showAddCompetitorForm, setShowAddCompetitorForm] = useState(false);
  const [showEditCompetitorForm, setShowEditCompetitorForm] = useState(false);
  const [editCompetitorData, setEditCompetitorData] = useState({
    competitorId: null,
    name: "",
    address: "",
    contacts: [],
    website: "",
    notes: "",
  });
  const [showDeleteCompetitorModal, setShowDeleteCompetitorModal] = useState(false);
  const [deleteCompetitorId, setDeleteCompetitorId] = useState(null);
  const [showCompetitorManagement, setShowCompetitorManagement] = useState(false);
  const [items, setItems] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showEditItemForm, setShowEditItemForm] = useState(false);
  const [editItemData, setEditItemData] = useState({
    itemId: null,
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: { url: "", public_id: "" }, // Changed from null to object
  });
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showItemManagement, setShowItemManagement] = useState(false);
  const [newItemImage, setNewItemImage] = useState(null); // New state for add item image
  const [editItemImage, setEditItemImage] = useState(null); // New state for edit item image
  const [competitorAnalysisOptions, setCompetitorAnalysisOptions] = useState({
    competitors: [],
    items: [],
    colors: [],
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP error! status: ${response.status}, Details: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const uploadImage = async (file) => {
    if (!file) return { url: "", public_id: "" };
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return { url: data.url, public_id: data.public_id };
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image: " + error.message);
      return { url: "", public_id: "" };
    }
  };

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sheetsResponse, storesResponse, colorsResponse, competitorsResponse, itemsResponse, optionsResponse] = await Promise.all([
        fetchWithRetry(`${API_URL}/api/sheets`),
        fetchWithRetry(`${API_URL}/api/sheets/stores`),
        fetchWithRetry(`${API_URL}/api/colors`),
        fetchWithRetry(`${API_URL}/api/competitors`),
        fetchWithRetry(`${API_URL}/api/items`),
        fetchWithRetry(`${API_URL}/api/sheets/competitor-analysis-options`),
      ]);
      const fetchedSheets = await sheetsResponse.json() || [];
      setSheets(fetchedSheets);
      setStoreData(await storesResponse.json() || []);
      setColors(await colorsResponse.json() || []);
      setCompetitors(await competitorsResponse.json() || []);
      setItems(await itemsResponse.json() || []);
      setCompetitorAnalysisOptions(await optionsResponse.json() || { competitors: [], items: [], colors: [] });
      // Set activeSheet after sheets are updated
      setActiveSheet(fetchedSheets.length > 0 ? fetchedSheets[0]._id : null);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [API_URL]);
  useEffect(() => {
    if (formData.storeName) {
      const store = storeData.find((s) => s.storeName === formData.storeName);
      if (store) {
        setSelectedStore(store);
        const addresses = [store.address1 || ""].concat(store.address2 ? [store.address2] : []);
        setAvailableAddresses(addresses);
        const personnel = store.personnel ? store.personnel.filter((p) => p && p !== "Staff") : [];
        setAvailablePersonnel(personnel);
      } else {
        setSelectedStore(null);
        setAvailableAddresses([]);
        setAvailablePersonnel([]);
      }
    }
  }, [formData.storeName, storeData]);

  const filteredStores = storeData.filter((store) =>
    store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStoreList = storeData.filter((store) =>
    store.storeName.toLowerCase().includes(storeListSearchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    if (field.startsWith("competitorAnalysis.")) {
      const subField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        competitorAnalysis: { ...prev.competitorAnalysis, [subField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const isValid = validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
      if (!isValid) alert(`File ${file.name} is invalid. Only JPEG, PNG, and PDF files under 10MB are allowed.`);
      return isValid;
    });
    if (validFiles.length === 0) return;
    setLoading(true);
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        try {
          const response = await fetch(`${API_URL}/api/upload`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error(await response.text());
          const data = await response.json();
          return {
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            url: data.url,
            publicId: data.public_id,
            size: file.size,
            type: file.type,
            format: data.format,
          };
        } catch (error) {
          throw error;
        }
      });
      const results = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...results]);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...results],
      }));
    } catch (error) {
      console.error("Detailed upload error:", error);
      let errorMessage = "Upload failed";
      if (error.name === "AbortError") errorMessage = "Upload timed out (60s)";
      else if (error.message.includes("network")) errorMessage = "Network error. Please check your connection.";
      else errorMessage = error.message || errorMessage;
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
    }));
  };

  const addRow = async () => {
    if (!formData.storeName.trim() || !activeSheet) return;
    const newRow = {
      ...formData,
      files: formData.files.map((file) => ({
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.type,
      })),
    };
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/${activeSheet}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
      if (!response.ok) throw new Error(await response.text());
      const addedEntry = await response.json();
      setSheets((prev) =>
        prev.map((sheet) =>
          sheet._id === activeSheet
            ? { ...sheet, data: [...sheet.data, { ...addedEntry, id: Date.now() }] }
            : sheet
        )
      );
      setFormData({
        storeName: "",
        address: "",
        personnel: "",
        insight: "",
        validation: "",
        validationNotes: "",
        files: [],
        competitorAnalysis: { competitor: "", item: "", color: "" },
      });
      setUploadedFiles([]);
      setSelectedStore(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding entry:", error.message);
      alert("Failed to add entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addNewStore = async (newStore) => {
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStore),
      });
      if (!response.ok) throw new Error(await response.text());
      const addedStore = await response.json();
      setStoreData((prev) => [...prev, addedStore]);
    } catch (error) {
      console.error("Error adding store:", error);
      alert("Failed to add store: " + error.message);
    }
  };

  const updateStore = async (storeData) => {
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
      if (!response.ok) throw new Error(await response.text());
      const updatedStore = await response.json();
      setStoreData((prev) =>
        prev.map((store) => (store._id === storeData.storeId ? updatedStore : store))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Failed to update store: " + error.message);
      setLoading(false);
    }
  };

  const deleteStore = async (storeId) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/stores/${storeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(await response.text());
      setStoreData((prev) => prev.filter((store) => store._id !== storeId));
      alert("Store deleted successfully");
      setShowStoreListDropdown(false);
      setStoreListSearchTerm("");
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete store: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewSheet = async (data) => {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      alert("Please select a date or enter a valid sheet name");
      return;
    }
    const newSheet = {
      name: data.name,
      hours: data.hours,
    };
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSheet),
      });
      if (!response.ok) throw new Error(await response.text());
      const addedSheet = await response.json();
      setSheets((prev) => [...prev, addedSheet]);
      setActiveSheet(addedSheet._id);
      setShowNewSheetForm(false);
      setNewSheetName("");
      setNewSheetHours("3:11 PM - 7:00 PM");
      const storesResponse = await fetchWithRetry(`${API_URL}/api/sheets/stores`);
      if (storesResponse.ok) {
        const storesData = await storesResponse.json();
        setStoreData(storesData);
      }
    } catch (error) {
      console.error("Error creating sheet:", error);
      alert("Failed to create sheet: " + error.message);
    }
  };

  const editSheet = async () => {
    if (!editSheetName.trim() || !editSheetId) return;
    const updatedSheet = {
      name: editSheetName,
      hours: editSheetHours,
    };
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/${editSheetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSheet),
      });
      if (!response.ok) throw new Error(await response.text());
      const updatedSheetData = await response.json();
      setSheets((prev) =>
        prev.map((sheet) => (sheet._id === editSheetId ? { ...sheet, ...updatedSheetData } : sheet))
      );
      setShowEditSheetModal(false);
      setEditSheetId(null);
      setEditSheetName("");
      setEditSheetHours("");
    } catch (error) {
      console.error("Error updating sheet:", error);
      alert("Failed to update sheet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSheet = async () => {
    if (!deleteSheetId) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/${deleteSheetId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(await response.text());
      setSheets((prev) => prev.filter((sheet) => sheet._id !== deleteSheetId));
      if (activeSheet === deleteSheetId) {
        setActiveSheet(sheets.length > 1 ? sheets[0]._id : null);
      }
      setShowDeleteSheetModal(false);
      setDeleteSheetId(null);
    } catch (error) {
      console.error("Error deleting sheet:", error);
      alert("Failed to delete sheet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    if (!activeSheet) return;
    try {
      const response = await fetchWithRetry(`${API_URL}/api/sheets/${activeSheet}/export`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sheets.find((s) => s._id === activeSheet)?.name.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV: " + error.message);
    }
  };

  const generateShareLinks = () => {
    if (!activeSheet) return { whatsapp: "#", email: "#" };
    const currentSheet = sheets.find((s) => s._id === activeSheet) || {
      name: "No Sheet Selected",
      hours: "",
      data: [],
    };
    const reportData = `Sales Report: ${currentSheet.name}\nHours: ${currentSheet.hours}\n\nTotal Entries: ${currentSheet.data.length}`;
    const whatsappMessage = encodeURIComponent(`${reportData}\n\nView full report: [Report Link]`);
    const emailSubject = encodeURIComponent(`Sales Report - ${currentSheet.name}`);
    const emailBody = encodeURIComponent(reportData);
    return {
      whatsapp: `https://wa.me/?text=${whatsappMessage}`,
      email: `mailto:?subject=${emailSubject}&body=${emailBody}`,
    };
  };

  const handleEditStoreClick = (store) => {
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
    setShowStoreListDropdown(false);
    setStoreListSearchTerm("");
  };

  const handleAddItem = async () => {
    if (!editItemData.name.trim() || !editItemData.price) {
      alert("Please enter both an item name and price.");
      return;
    }
    setLoading(true);
    try {
      const imageData = await uploadImage(newItemImage);
      const itemData = {
        ...editItemData,
        image: imageData,
      };
      const response = await fetchWithRetry(`${API_URL}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error(await response.text());
      const addedItem = await response.json();
      setItems((prev) => [...prev, addedItem]);
      setEditItemData({
        itemId: null,
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: { url: "", public_id: "" },
      });
      setNewItemImage(null);
      setShowAddItemForm(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editItemData.name.trim() || !editItemData.price) {
      alert("Please enter both an item name and price.");
      return;
    }
    setLoading(true);
    try {
      const imageData = editItemImage ? await uploadImage(editItemImage) : editItemData.image;
      const itemData = {
        ...editItemData,
        image: imageData,
      };
      const response = await fetchWithRetry(`${API_URL}/api/items/${editItemData.itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error(await response.text());
      const updatedItem = await response.json();
      setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      setEditItemData({
        itemId: null,
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: { url: "", public_id: "" },
      });
      setEditItemImage(null);
      setShowEditItemForm(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/items/${deleteItemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(await response.text());
      setItems((prev) => prev.filter((item) => item._id !== deleteItemId));
      setShowDeleteItemModal(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentSheet = (activeSheet && sheets.find((s) => s._id === activeSheet)) || {
    name: "No Sheet Selected",
    hours: "",
    data: [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        sheets={sheets}
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        setShowNewSheetForm={setShowNewSheetForm}
        setShowShareModal={setShowShareModal}
        setEditSheetId={setEditSheetId}
        setEditSheetName={setEditSheetName}
        setEditSheetHours={setEditSheetHours}
        setShowEditSheetModal={setShowEditSheetModal}
        setDeleteSheetId={setDeleteSheetId}
        setShowDeleteSheetModal={setShowDeleteSheetModal}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        exportToCSV={exportToCSV}
        exportAllToExcel={exportAllToExcel}
      />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <div className="lg:w-[390px] w-full flex-shrink-0">
          {showColorManagement ? (
            <ColorManagement
              colors={colors}
              setColors={setColors}
              showAddColorForm={showAddColorForm}
              setShowAddColorForm={setShowAddColorForm}
              showEditColorForm={showEditColorForm}
              setShowEditColorForm={setShowEditColorForm}
              editColorData={editColorData}
              setEditColorData={setEditColorData}
              showDeleteColorModal={showDeleteColorModal}
              setShowDeleteColorModal={setShowDeleteColorModal}
              deleteColorId={deleteColorId}
              setDeleteColorId={setDeleteColorId}
              loading={loading}
              setLoading={setLoading}
              API_URL={API_URL}
              fetchWithRetry={fetchWithRetry}
            />
          ) : showCompetitorManagement ? (
            <CompetitorManagement
              competitors={competitors}
              setCompetitors={setCompetitors}
              showAddCompetitorForm={showAddCompetitorForm}
              setShowAddCompetitorForm={setShowAddCompetitorForm}
              showEditCompetitorForm={showEditCompetitorForm}
              setShowEditCompetitorForm={setShowEditCompetitorForm}
              editCompetitorData={editCompetitorData}
              setEditCompetitorData={setEditCompetitorData}
              showDeleteCompetitorModal={showDeleteCompetitorModal}
              setShowDeleteCompetitorModal={setShowDeleteCompetitorModal}
              deleteCompetitorId={deleteCompetitorId}
              setDeleteCompetitorId={setDeleteCompetitorId}
              loading={loading}
              setLoading={setLoading}
              API_URL={API_URL}
              fetchWithRetry={fetchWithRetry}
            />
          ) : showItemManagement ? (
            <ItemManagement
              items={items}
              setItems={setItems}
              showAddItemForm={showAddItemForm}
              setShowAddItemForm={setShowAddItemForm}
              showEditItemForm={showEditItemForm}
              setShowEditItemForm={setShowEditItemForm}
              editItemData={editItemData}
              setEditItemData={setEditItemData}
              showDeleteItemModal={showDeleteItemModal}
              setShowDeleteItemModal={setShowDeleteItemModal}
              deleteItemId={deleteItemId}
              setDeleteItemId={setDeleteItemId}
              loading={loading}
              setLoading={setLoading}
              API_URL={API_URL}
              fetchWithRetry={fetchWithRetry}
              newItemImage={newItemImage}
              setNewItemImage={setNewItemImage}
              editItemImage={editItemImage}
              setEditItemImage={setEditItemImage}
              handleAddItem={handleAddItem}
              handleUpdateItem={handleUpdateItem}
              handleDeleteItem={handleDeleteItem}
            />
          ) : (
            <>
              <div className="bg-white rounded-md shadow-sm p-2 mb-2 border border-gray-200">
                <h3 className="text-sm font-semibold mb-1 text-gray-900">Select Store to Edit</h3>
                <div className="relative">
                  <div className="flex">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={storeListSearchTerm}
                        onChange={(e) => {
                          setStoreListSearchTerm(e.target.value);
                          setShowStoreListDropdown(true);
                        }}
                        onFocus={() => setShowStoreListDropdown(true)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Search stores..."
                      />
                      <Search className="absolute right-1 top-1.5 w-2.5 h-2.5 text-gray-400" />
                    </div>
                    <button
                      onClick={() => setShowStoreListDropdown(!showStoreListDropdown)}
                      className="px-1 py-0.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-all"
                    >
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  {showStoreListDropdown && (
                    <div className="absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredStoreList.length === 0 ? (
                        <div className="px-1 py-0.5 text-sm text-gray-600">No stores found</div>
                      ) : (
                        filteredStoreList.map((store) => (
                          <div key={store._id} className="flex items-center justify-between px-1 py-0.5 text-sm">
                            <button
                              onClick={() => handleEditStoreClick(store)}
                              className="w-full text-left hover:bg-gray-100 transition-all"
                            >
                              {store.storeName}
                            </button>
                            <button
                              onClick={() => deleteStore(store._id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ItemManagementToggle
                setShowItemManagement={setShowItemManagement}
                showItemManagement={showItemManagement}
              />
              <DataEntryForm
  formData={formData}
  setFormData={setFormData}
  newSheetName={newSheetName}
  setNewSheetName={setNewSheetName}
  newSheetHours={newSheetHours}
  setNewSheetHours={setNewSheetHours}
  showNewSheetForm={showNewSheetForm}
  setShowNewSheetForm={setShowNewSheetForm}
  editSheetName={editSheetName}
  setEditSheetName={setEditSheetName}
  editSheetHours={editSheetHours}
  setEditSheetHours={setEditSheetHours}
  showEditSheetModal={showEditSheetModal}
  setShowEditSheetModal={setShowEditSheetModal}
  editSheetId={editSheetId}
  setEditSheetId={setEditSheetId}
  showDeleteSheetModal={showDeleteSheetModal}
  setShowDeleteSheetModal={setShowDeleteSheetModal}
  deleteSheetId={deleteSheetId}
  setDeleteSheetId={setDeleteSheetId}
  newStoreData={newStoreData}
  setNewStoreData={setNewStoreData}
  showAddStoreForm={showAddStoreForm}
  setShowAddStoreForm={setShowAddStoreForm}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  showStoreDropdown={showStoreDropdown}
  setShowStoreDropdown={setShowStoreDropdown}
  uploadedFiles={uploadedFiles}
  setUploadedFiles={setUploadedFiles}
  loading={loading}
  createNewSheet={createNewSheet}
  editSheet={editSheet}
  deleteSheet={deleteSheet}
  addRow={addRow}
  addNewStore={addNewStore}
  updateStore={updateStore}
  filteredStores={filteredStores}
  selectedStore={selectedStore}
  availableAddresses={availableAddresses}
  availablePersonnel={availablePersonnel}
  handleInputChange={handleInputChange}
  handleFileUpload={handleFileUpload}
  removeFile={removeFile}
  sheets={sheets}
  showEditStoreForm={showEditStoreForm}
  setShowEditStoreForm={setShowEditStoreForm}
  editStoreData={editStoreData}
  setEditStoreData={setEditStoreData}
  setShowColorManagement={setShowColorManagement}
  showColorManagement={showColorManagement}
  setShowCompetitorManagement={setShowCompetitorManagement}
  showCompetitorManagement={showCompetitorManagement}
  setShowItemManagement={setShowItemManagement}
  showItemManagement={showItemManagement}
  competitorAnalysisOptions={competitorAnalysisOptions}
  items={items}
  setItems={setItems}
  editItemData={editItemData}
  setEditItemData={setEditItemData}
  showDeleteItemModal={showDeleteItemModal}
  setShowDeleteItemModal={setShowDeleteItemModal}
  deleteItemId={deleteItemId}
  setDeleteItemId={setDeleteItemId}
  newItemImage={newItemImage}
  setNewItemImage={setNewItemImage}
  editItemImage={editItemImage}
  setEditItemImage={setEditItemImage}
  handleAddItem={handleAddItem}
  handleUpdateItem={handleUpdateItem}
  handleDeleteItem={handleDeleteItem}
  API_URL={API_URL}
  fetchWithRetry={fetchWithRetry}
  setLoading={setLoading} // Add this line
/>
            </>
          )}
        </div>
        <div className="flex-1 w-full px-2">
          <DataTable
            currentSheet={currentSheet}
            showValidationModal={showValidationModal}
            setShowValidationModal={setShowValidationModal}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            competitorAnalysisOptions={competitorAnalysisOptions}
            loading={loading} // Pass loading prop
          />
        </div>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs">
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-900">Share Report</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                <a
                  href={generateShareLinks().whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 w-full p-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-all text-xs"
                >
                  <MessageCircle className="w-3 h-3" /> Share via WhatsApp
                </a>
                <a
                  href={generateShareLinks().email}
                  className="flex items-center gap-1 w-full p-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-all text-xs"
                >
                  <Mail className="w-3 h-3" /> Share via Email
                </a>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">Report: {currentSheet.name}</p>
                <p className="text-xs text-gray-600">Total Entries: {currentSheet.data.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-1 z-10">
        <div className="flex gap-1">
          <button
            onClick={addRow}
            className="flex-1 bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
            disabled={!formData.storeName.trim() || !activeSheet}
          >
            Add Entry
          </button>
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-2 py-0.5 rounded-md hover:bg-green-700 transition-all text-xs"
            disabled={!activeSheet}
          >
            <Download className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="bg-purple-600 text-white px-2 py-0.5 rounded-md hover:bg-purple-700 transition-all text-xs"
            disabled={!activeSheet}
          >
            <Share2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSalesSummaryTool;



// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Header from "./Header";
// import DataEntryForm from "../components/DataEntry/DataEntryForm";
// import DataTable from "./DataTable";
// import ColorManagement from "./Color/ColorManagement"; // Corrected to import the full management component
// import CompetitorManagement from "./Competitors/CompetitorManagement";
// import { exportAllToExcel } from "@/utils/export";
// import { Mail, MessageCircle, Share2, Download, Search, ChevronDown, X } from "lucide-react";

// const EnhancedSalesSummaryTool = () => {
//   const router = useRouter();
//   const [storeData, setStoreData] = useState([]);
//   const [sheets, setSheets] = useState([]);
//   const [activeSheet, setActiveSheet] = useState(null);
//   const [showNewSheetForm, setShowNewSheetForm] = useState(false);
//   const [newSheetName, setNewSheetName] = useState(null);
//   const [newSheetHours, setNewSheetHours] = useState("3:11 PM - 7:00 PM");
//   const [showEditSheetModal, setShowEditSheetModal] = useState(false);
//   const [editSheetId, setEditSheetId] = useState(null);
//   const [editSheetName, setEditSheetName] = useState("");
//   const [editSheetHours, setEditSheetHours] = useState("");
//   const [showDeleteSheetModal, setShowDeleteSheetModal] = useState(false);
//   const [deleteSheetId, setDeleteSheetId] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showValidationModal, setShowValidationModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [formData, setFormData] = useState({
//     storeName: "",
//     address: "",
//     personnel: "",
//     insight: "",
//     validation: "",
//     validationNotes: "",
//     files: [],
//   });
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [availableAddresses, setAvailableAddresses] = useState([]);
//   const [availablePersonnel, setAvailablePersonnel] = useState([]);
//   const [showAddStoreForm, setShowAddStoreForm] = useState(false);
//   const [newStoreData, setNewStoreData] = useState({
//     storeName: "",
//     address1: "",
//     address2: "",
//     personnel: [],
//     contacts: [],
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showStoreDropdown, setShowStoreDropdown] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showEditStoreForm, setShowEditStoreForm] = useState(false);
//   const [editStoreData, setEditStoreData] = useState({
//     storeId: null,
//     storeName: "",
//     address1: "",
//     address2: "",
//     personnel: [],
//     contacts: [],
//   });
//   const [storeListSearchTerm, setStoreListSearchTerm] = useState("");
//   const [showStoreListDropdown, setShowStoreListDropdown] = useState(false);
//   const [colors, setColors] = useState([]);
//   const [showAddColorForm, setShowAddColorForm] = useState(false);
//   const [showEditColorForm, setShowEditColorForm] = useState(false);
//   const [editColorData, setEditColorData] = useState({ colorId: null, name: "", hexCode: "" });
//   const [showDeleteColorModal, setShowDeleteColorModal] = useState(false);
//   const [deleteColorId, setDeleteColorId] = useState(null);
//   const [showColorManagement, setShowColorManagement] = useState(false);
//   const [competitors, setCompetitors] = useState([]);
//   const [showAddCompetitorForm, setShowAddCompetitorForm] = useState(false);
//   const [showEditCompetitorForm, setShowEditCompetitorForm] = useState(false);
//   const [editCompetitorData, setEditCompetitorData] = useState({
//     competitorId: null,
//     name: "",
//     address: "",
//     contacts: [],
//     website: "",
//     notes: "",
//   });
//   const [showDeleteCompetitorModal, setShowDeleteCompetitorModal] = useState(false);
//   const [deleteCompetitorId, setDeleteCompetitorId] = useState(null);
//   const [showCompetitorManagement, setShowCompetitorManagement] = useState(false);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await fetch(url, options);
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         return response;
//       } catch (error) {
//         if (i === retries - 1) throw error;
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const sheetsResponse = await fetchWithRetry(`${API_URL}/api/sheets`);
//         const sheetsData = await sheetsResponse.json();
//         console.log("Fetched sheets:", sheetsData);
//         setSheets(sheetsData || []);
//         setActiveSheet(sheetsData.length > 0 ? sheetsData[0]._id : null);
//       } catch (error) {
//         console.error("Error fetching sheets:", error);
//         alert("Failed to fetch sheets: " + error.message);
//       }
//       try {
//         const storesResponse = await fetchWithRetry(`${API_URL}/api/sheets/stores`);
//         const storesData = await storesResponse.json();
//         console.log("Fetched stores:", storesData);
//         setStoreData(storesData || []);
//       } catch (error) {
//         console.error("Error fetching stores:", error);
//         alert("Failed to fetch stores: " + error.message);
//       }
//       try {
//         const colorsResponse = await fetchWithRetry(`${API_URL}/api/colors`);
//         const colorsData = await colorsResponse.json();
//         console.log("Fetched colors:", colorsData);
//         setColors(colorsData || []);
//       } catch (error) {
//         console.error("Error fetching colors:", error);
//         alert("Failed to fetch colors: " + error.message);
//       }
//       try {
//         const competitorsResponse = await fetchWithRetry(`${API_URL}/api/competitors`);
//         const competitorsData = await competitorsResponse.json();
//         console.log("Fetched competitors:", competitorsData);
//         setCompetitors(competitorsData || []);
//       } catch (error) {
//         console.error("Error fetching competitors:", error);
//         alert("Failed to fetch competitors: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [API_URL]);

//   useEffect(() => {
//     if (formData.storeName) {
//       const store = storeData.find((s) => s.storeName === formData.storeName);
//       if (store) {
//         setSelectedStore(store);
//         const addresses = [store.address1];
//         if (store.address2) addresses.push(store.address2);
//         setAvailableAddresses(addresses);
//         const personnel = store.personnel ? store.personnel.filter((p) => p && p !== "Staff") : [];
//         setAvailablePersonnel(personnel);
//       } else {
//         setSelectedStore(null);
//         setAvailableAddresses([]);
//         setAvailablePersonnel([]);
//       }
//     }
//   }, [formData.storeName, storeData]);

//   const filteredStores = storeData.filter((store) =>
//     store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredStoreList = storeData.filter((store) =>
//     store.storeName.toLowerCase().includes(storeListSearchTerm.toLowerCase())
//   );

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleFileUpload = async (event) => {
//     const files = Array.from(event.target.files);
//     const validFiles = files.filter((file) => {
//       const validTypes = ["image/jpeg", "image/png", "application/pdf"];
//       const isValid = validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
//       if (!isValid) alert(`File ${file.name} is invalid. Only JPEG, PNG, and PDF files under 10MB are allowed.`);
//       return isValid;
//     });
//     if (validFiles.length === 0) return;
//     setLoading(true);
//     try {
//       const uploadPromises = validFiles.map(async (file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 60000);
//         try {
//           const response = await fetch(`${API_URL}/api/upload`, {
//             method: "POST",
//             body: formData,
//             signal: controller.signal,
//           });
//           clearTimeout(timeoutId);
//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.details || errorData.error || "Upload failed");
//           }
//           const data = await response.json();
//           return {
//             id: `${file.name}-${Date.now()}`,
//             name: file.name,
//             url: data.url,
//             publicId: data.public_id,
//             size: file.size,
//             type: file.type,
//             format: data.format,
//           };
//         } catch (error) {
//           throw error;
//         }
//       });
//       const results = await Promise.all(uploadPromises);
//       setUploadedFiles((prev) => [...prev, ...results]);
//       setFormData((prev) => ({
//         ...prev,
//         files: [...prev.files, ...results],
//       }));
//     } catch (error) {
//       console.error("Detailed upload error:", error);
//       let errorMessage = "Upload failed";
//       if (error.name === "AbortError") errorMessage = "Upload timed out (60s)";
//       else if (error.message.includes("network")) errorMessage = "Network error. Please check your connection.";
//       else errorMessage = error.message || errorMessage;
//       alert(`Error: ${errorMessage}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFile = (fileId) => {
//     setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
//     setFormData((prev) => ({
//       ...prev,
//       files: prev.files.filter((f) => f.id !== fileId),
//     }));
//   };

//   const addRow = async () => {
//     if (!formData.storeName.trim() || !activeSheet) return;
//     const newRow = {
//       ...formData,
//       files: formData.files.map((file) => ({
//         name: file.name,
//         url: file.url,
//         size: file.size,
//         type: file.type,
//       })),
//     };
//     setLoading(true);
//     try {
//       const response = await fetchWithRetry(`${API_URL}/api/sheets/${activeSheet}/entries`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newRow),
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to add entry: ${errorText}`);
//       }
//       const addedEntry = await response.json();
//       setSheets((prev) =>
//         prev.map((sheet) =>
//           sheet._id === activeSheet
//             ? { ...sheet, data: [...sheet.data, { ...addedEntry, id: Date.now() }] }
//             : sheet
//         )
//       );
//       setFormData({
//         storeName: "",
//         address: "",
//         personnel: "",
//         insight: "",
//         validation: "",
//         validationNotes: "",
//         files: [],
//       });
//       setUploadedFiles([]);
//       setSelectedStore(null);
//       setSearchTerm("");
//     } catch (error) {
//       console.error("Error adding entry:", error.message);
//       alert("Failed to add entry: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addNewStore = async (newStore) => {
//     try {
//       const response = await fetchWithRetry(`${API_URL}/api/sheets/stores`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newStore),
//       });
//       if (!response.ok) throw new Error("Failed to add store");
//       const addedStore = await response.json();
//       setStoreData((prev) => [...prev, addedStore]);
//     } catch (error) {
//       console.error("Error adding store:", error);
//       alert("Failed to add store: " + error.message);
//     }
//   };

//   const updateStore = async (storeData) => {
//     try {
//       setLoading(true);
//       const response = await fetchWithRetry(`${API_URL}/api/sheets/stores/${storeData.storeId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           storeName: storeData.storeName,
//           address1: storeData.address1,
//           address2: storeData.address2,
//           personnel: storeData.personnel,
//           contacts: storeData.contacts,
//         }),
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to update store: ${errorText}`);
//       }
//       const updatedStore = await response.json();
//       setStoreData((prev) =>
//         prev.map((store) => (store._id === storeData.storeId ? updatedStore : store))
//       );
//       setLoading(false);
//     } catch (error) {
//       console.error("Error updating store:", error);
//       alert("Failed to update store: " + error.message);
//       setLoading(false);
//     }
//   };

//   const createNewSheet = async (data) => {
//     if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
//       alert("Please select a date or enter a valid sheet name");
//       return;
//     }
//     const newSheet = {
//       name: data.name,
//       hours: data.hours,
//     };
//     try {
//       const response = await fetchWithRetry(`${API_URL}/api/sheets`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newSheet),
//       });
//       if (!response.ok) throw new Error("Failed to create sheet");
//       const addedSheet = await response.json();
//       setSheets((prev) => [...prev, addedSheet]);
//       setActiveSheet(addedSheet._id);
//       setShowNewSheetForm(false);
//       setNewSheetName(null);
//       setNewSheetHours("3:11 PM - 7:00 PM");
//       const storesResponse = await fetchWithRetry(`${API_URL}/api/sheets/stores`);
//       if (storesResponse.ok) {
//         const storesData = await storesResponse.json();
//         setStoreData(storesData);
//       }
//     } catch (error) {
//       console.error("Error creating sheet:", error);
//       alert("Failed to create sheet: " + error.message);
//     }
//   };

//   const editSheet = async () => {
//     if (!editSheetName.trim() || !editSheetId) return;
//     const updatedSheet = {
//       name: editSheetName,
//       hours: editSheetHours,
//     };
//     setLoading(true);
//     try {
//       const response = await fetchWithRetry(`${API_URL}/api/sheets/${editSheetId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedSheet),
//       });
//       if (!response.ok) throw new Error("Failed to update sheet");
//       const updatedSheetData = await response.json();
//       setSheets((prev) =>
//         prev.map((sheet) => (sheet._id === editSheetId ? { ...sheet, ...updatedSheetData } : sheet))
//       );
//       setShowEditSheetModal(false);
//       setEditSheetId(null);
//       setEditSheetName("");
//       setEditSheetHours("");
//     } catch (error) {
//       console.error("Error updating sheet:", error);
//       alert("Failed to update sheet: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteSheet = async () => {
//     if (!deleteSheetId) return;
//     setLoading(true);
//     try {
//       const response = await fetchWithRetry(`${API_URL}/api/sheets/${deleteSheetId}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) throw new Error("Failed to delete sheet");
//       setSheets((prev) => prev.filter((sheet) => sheet._id !== deleteSheetId));
//       if (activeSheet === deleteSheetId) {
//         setActiveSheet(sheets.length > 1 ? sheets[0]._id : null);
//       }
//       setShowDeleteSheetModal(false);
//       setDeleteSheetId(null);
//     } catch (error) {
//       console.error("Error deleting sheet:", error);
//       alert("Failed to delete sheet: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToCSV = async () => {
//     if (!activeSheet) return;
//     try {
//       const response = await fetchWithRetry(`${API_URL}/api/sheets/${activeSheet}/export`);
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${sheets.find((s) => s._id === activeSheet)?.name.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error exporting CSV:", error);
//       alert("Failed to export CSV: " + error.message);
//     }
//   };

//   const generateShareLinks = () => {
//     if (!activeSheet) return { whatsapp: "#", email: "#" };
//     const currentSheet = sheets.find((s) => s._id === activeSheet) || {
//       name: "No Sheet Selected",
//       hours: "",
//       data: [],
//     };
//     const reportData = `Sales Report: ${currentSheet.name}\nHours: ${currentSheet.hours}\n\nTotal Entries: ${currentSheet.data.length}`;
//     const whatsappMessage = encodeURIComponent(`${reportData}\n\nView full report: [Report Link]`);
//     const emailSubject = encodeURIComponent(`Sales Report - ${currentSheet.name}`);
//     const emailBody = encodeURIComponent(reportData);
//     return {
//       whatsapp: `https://wa.me/?text=${whatsappMessage}`,
//       email: `mailto:?subject=${emailSubject}&body=${emailBody}`,
//     };
//   };

//   const handleEditStoreClick = (store) => {
//     setEditStoreData({
//       storeId: store._id,
//       storeName: store.storeName,
//       address1: store.address1,
//       address2: store.address2 || "",
//       personnel: store.personnel || [],
//       contacts: store.contacts || [],
//     });
//     setShowEditStoreForm(true);
//     setShowStoreListDropdown(false);
//     setStoreListSearchTerm("");
//   };

//   const currentSheet = (activeSheet && sheets.find((s) => s._id === activeSheet)) || {
//     name: "No Sheet Selected",
//     hours: "",
//     data: [],
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <Header
//         sheets={sheets}
//         activeSheet={activeSheet}
//         setActiveSheet={setActiveSheet}
//         setShowNewSheetForm={setShowNewSheetForm}
//         setShowShareModal={setShowShareModal}
//         setEditSheetId={setEditSheetId}
//         setEditSheetName={setEditSheetName}
//         setEditSheetHours={setEditSheetHours}
//         setShowEditSheetModal={setShowEditSheetModal}
//         setDeleteSheetId={setDeleteSheetId}
//         setShowDeleteSheetModal={setShowDeleteSheetModal}
//         isMobileMenuOpen={isMobileMenuOpen}
//         setIsMobileMenuOpen={setIsMobileMenuOpen}
//         exportToCSV={exportToCSV}
//         exportAllToExcel={exportAllToExcel}
//       />
//       <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
//         <div className="lg:w-[390px] w-full flex-shrink-0">
//           {showColorManagement ? (
//             <ColorManagement
//               colors={colors}
//               setColors={setColors}
//               showAddColorForm={showAddColorForm}
//               setShowAddColorForm={setShowAddColorForm}
//               showEditColorForm={showEditColorForm}
//               setShowEditColorForm={setShowEditColorForm}
//               editColorData={editColorData}
//               setEditColorData={setEditColorData}
//               showDeleteColorModal={showDeleteColorModal}
//               setShowDeleteColorModal={setShowDeleteColorModal}
//               deleteColorId={deleteColorId}
//               setDeleteColorId={setDeleteColorId}
//               loading={loading}
//               setLoading={setLoading}
//               API_URL={API_URL}
//               fetchWithRetry={fetchWithRetry}
//             />
//           ) : showCompetitorManagement ? (
//             <CompetitorManagement
//               competitors={competitors}
//               setCompetitors={setCompetitors}
//               showAddCompetitorForm={showAddCompetitorForm}
//               setShowAddCompetitorForm={setShowAddCompetitorForm}
//               showEditCompetitorForm={showEditCompetitorForm}
//               setShowEditCompetitorForm={setShowEditCompetitorForm}
//               editCompetitorData={editCompetitorData}
//               setEditCompetitorData={setEditCompetitorData}
//               showDeleteCompetitorModal={showDeleteCompetitorModal}
//               setShowDeleteCompetitorModal={setShowDeleteCompetitorModal}
//               deleteCompetitorId={deleteCompetitorId}
//               setDeleteCompetitorId={setDeleteCompetitorId}
//               loading={loading}
//               setLoading={setLoading}
//               API_URL={API_URL}
//               fetchWithRetry={fetchWithRetry}
//             />
//           ) : (
//             <>
//               <div className="bg-white rounded-md shadow-sm p-2 mb-2 border border-gray-200">
//                 <h3 className="text-sm font-semibold mb-1 text-gray-900">Select Store to Edit</h3>
//                 <div className="relative">
//                   <div className="flex">
//                     <div className="relative flex-1">
//                       <input
//                         type="text"
//                         value={storeListSearchTerm}
//                         onChange={(e) => {
//                           setStoreListSearchTerm(e.target.value);
//                           setShowStoreListDropdown(true);
//                         }}
//                         onFocus={() => setShowStoreListDropdown(true)}
//                         className="w-full px-1 py-0.5 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                         placeholder="Search stores..."
//                       />
//                       <Search className="absolute right-1 top-1.5 w-2.5 h-2.5 text-gray-400" />
//                     </div>
//                     <button
//                       onClick={() => setShowStoreListDropdown(!showStoreListDropdown)}
//                       className="px-1 py-0.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-all"
//                     >
//                       <ChevronDown className="w-2.5 h-2.5" />
//                     </button>
//                   </div>
//                   {showStoreListDropdown && (
//                     <div className="absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
//                       {filteredStoreList.length === 0 ? (
//                         <div className="px-1 py-0.5 text-sm text-gray-600">No stores found</div>
//                       ) : (
//                         filteredStoreList.map((store) => (
//                           <button
//                             key={store._id}
//                             onClick={() => handleEditStoreClick(store)}
//                             className="w-full px-1 py-0.5 text-left hover:bg-gray-100 transition-all text-sm"
//                           >
//                             {store.storeName}
//                           </button>
//                         ))
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <DataEntryForm
//                 formData={formData}
//                 setFormData={setFormData}
//                 newSheetName={newSheetName}
//                 setNewSheetName={setNewSheetName}
//                 newSheetHours={newSheetHours}
//                 setNewSheetHours={setNewSheetHours}
//                 showNewSheetForm={showNewSheetForm}
//                 setShowNewSheetForm={setShowNewSheetForm}
//                 editSheetName={editSheetName}
//                 setEditSheetName={setEditSheetName}
//                 editSheetHours={editSheetHours}
//                 setEditSheetHours={setEditSheetHours}
//                 showEditSheetModal={showEditSheetModal}
//                 setShowEditSheetModal={setShowEditSheetModal}
//                 editSheetId={editSheetId}
//                 setEditSheetId={setEditSheetId}
//                 showDeleteSheetModal={showDeleteSheetModal}
//                 setShowDeleteSheetModal={setShowDeleteSheetModal}
//                 deleteSheetId={deleteSheetId}
//                 setDeleteSheetId={setDeleteSheetId}
//                 newStoreData={newStoreData}
//                 setNewStoreData={setNewStoreData}
//                 showAddStoreForm={showAddStoreForm}
//                 setShowAddStoreForm={setShowAddStoreForm}
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 showStoreDropdown={showStoreDropdown}
//                 setShowStoreDropdown={setShowStoreDropdown}
//                 uploadedFiles={uploadedFiles}
//                 setUploadedFiles={setUploadedFiles}
//                 loading={loading}
//                 createNewSheet={createNewSheet}
//                 editSheet={editSheet}
//                 deleteSheet={deleteSheet}
//                 addRow={addRow}
//                 addNewStore={addNewStore}
//                 updateStore={updateStore}
//                 filteredStores={filteredStores}
//                 selectedStore={selectedStore}
//                 availableAddresses={availableAddresses}
//                 availablePersonnel={availablePersonnel}
//                 handleInputChange={handleInputChange}
//                 handleFileUpload={handleFileUpload}
//                 removeFile={removeFile}
//                 sheets={sheets}
//                 showEditStoreForm={showEditStoreForm}
//                 setShowEditStoreForm={setShowEditStoreForm}
//                 editStoreData={editStoreData}
//                 setEditStoreData={setEditStoreData}
//                 setShowColorManagement={setShowColorManagement}
//                 setShowCompetitorManagement={setShowCompetitorManagement}
//                 showCompetitorManagement={showCompetitorManagement}
//                 showColorManagement={showColorManagement} // Added missing prop
//               />
//             </>
//           )}
//         </div>
//         <div className="flex-1 w-full px-2">
//           <DataTable
//             currentSheet={currentSheet}
//             showValidationModal={showValidationModal}
//             setShowValidationModal={setShowValidationModal}
//             selectedRow={selectedRow}
//             setSelectedRow={setSelectedRow}
//           />
//         </div>
//       </div>
//       {showShareModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-xs">
//             <div className="p-3">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-xs font-semibold text-gray-900">Share Report</h3>
//                 <button
//                   onClick={() => setShowShareModal(false)}
//                   className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </div>
//               <div className="space-y-1">
//                 <a
//                   href={generateShareLinks().whatsapp}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-1 w-full p-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-all text-xs"
//                 >
//                   <MessageCircle className="w-3 h-3" /> Share via WhatsApp
//                 </a>
//                 <a
//                   href={generateShareLinks().email}
//                   className="flex items-center gap-1 w-full p-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-all text-xs"
//                 >
//                   <Mail className="w-3 h-3" /> Share via Email
//                 </a>
//               </div>
//               <div className="mt-3 pt-2 border-t border-gray-200">
//                 <p className="text-xs text-gray-600">Report: {currentSheet.name}</p>
//                 <p className="text-xs text-gray-600">Total Entries: {currentSheet.data.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-1 z-10">
//         <div className="flex gap-1">
//           <button
//             onClick={addRow}
//             className="flex-1 bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
//             disabled={!formData.storeName.trim() || !activeSheet}
//           >
//             Add Entry
//           </button>
//           <button
//             onClick={exportToCSV}
//             className="bg-green-600 text-white px-2 py-0.5 rounded-md hover:bg-green-700 transition-all text-xs"
//             disabled={!activeSheet}
//           >
//             <Download className="w-2.5 h-2.5" />
//           </button>
//           <button
//             onClick={() => setShowShareModal(true)}
//             className="bg-purple-600 text-white px-2 py-0.5 rounded-md hover:bg-purple-700 transition-all text-xs"
//             disabled={!activeSheet}
//           >
//             <Share2 className="w-2.5 h-2.5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedSalesSummaryTool;