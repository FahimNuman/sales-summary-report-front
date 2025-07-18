import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewSheetForm = ({
  newSheetName,
  setNewSheetName,
  newSheetHours,
  setNewSheetHours,
  showNewSheetForm,
  setShowNewSheetForm,
  loading,
  createNewSheet,
}) => {
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const startHour = currentHour >= 9 ? currentHour : 9;
    const startMinute = currentHour >= 9 ? currentMinute : 0;
    const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute
      .toString()
      .padStart(2, "0")} ${startHour < 12 ? "AM" : "PM"}`;
    const endTime = "7:00 PM";
    setNewSheetHours(`${startTime} - ${endTime}`);
  }, [setNewSheetHours]);

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const handleDateChange = (date) => {
    setNewSheetName(date); // Store as Date object
  };

  const handleCreateSheet = () => {
    if (newSheetName instanceof Date && !isNaN(newSheetName)) {
      const sheetName = formatDate(newSheetName);
      if (sheetName) {
        createNewSheet({ name: sheetName, hours: newSheetHours });
      } else {
        console.error("Failed to format sheet name");
      }
    } else {
      console.log("Invalid newSheetName:", newSheetName);
    }
    setShowNewSheetForm(false);
  };

  if (!showNewSheetForm) return null;

  return (
    <div className="bg-green-300 rounded-md shadow-sm p-2 mb-2 border border-gray-200">
      <h3 className="text-sm font-semibold mb-1 text-gray-900">Create New Sheet</h3>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <label className="block text-sm font-medium text-white-700 mb-0.5">Sheet Name</label>
          <DatePicker
            selected={newSheetName instanceof Date && !isNaN(newSheetName) ? newSheetName : null}
            onChange={handleDateChange}
            dateFormat="MM/dd/yy"
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            placeholderText="Select date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Hours</label>
          <input
            type="text"
            value={newSheetHours}
            onChange={(e) => setNewSheetHours(e.target.value)}
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            placeholder="e.g., 9:00 AM - 7:00 PM"
          />
        </div>
      </div>
      <div className="flex gap-1 mt-2">
        <button
          onClick={handleCreateSheet}
          className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
          disabled={loading}
        >
          {loading ? (
            <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Create Sheet"
          )}
        </button>
        <button
          onClick={() => setShowNewSheetForm(false)}
          className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewSheetForm;