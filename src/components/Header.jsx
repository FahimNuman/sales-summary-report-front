"use client";
import React, { useState } from "react";
import { Plus, Download, FileText, Share2, ChevronDown, Edit, Trash2 } from "lucide-react";

const Header = ({
  sheets,
  activeSheet,
  setActiveSheet,
  setShowNewSheetForm,
  setShowShareModal,
  setEditSheetId,
  setEditSheetName,
  setEditSheetHours,
  setShowEditSheetModal,
  setDeleteSheetId,
  setShowDeleteSheetModal,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  exportToCSV,
  exportAllToExcel,
}) => {
  // Debug log to inspect sheets prop
  console.log("Header sheets prop:", sheets);

  return (
    <div>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Sales Summary</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isMobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="mt-3 space-y-1.5">
            <button
              onClick={() => exportToCSV()}
              className="w-full flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
              disabled={!activeSheet}
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
            <button
              onClick={exportAllToExcel}
              className="w-full flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 text-sm"
            >
              <Download className="w-3 h-3" />
              Export All Sheets
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
              disabled={!activeSheet}
            >
              <Share2 className="w-3 h-3" />
              Share Report
            </button>
            <button
              onClick={() => setShowNewSheetForm(true)}
              className="w-full flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-sm"
            >
              <Plus className="w-3 h-3" />
              New Sheet
            </button>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white rounded-1xl shadow-lg p-4 mb-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Sales Summary Tool
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              disabled={!activeSheet}
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>
            <button
              onClick={() => exportToCSV()}
              className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              disabled={!activeSheet}
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
            <button
              onClick={exportAllToExcel}
              className="flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              <Download className="w-3 h-3" />
              Export All Sheets
            </button>
          </div>
        </div>

        {/* Sheet Tabs */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar py-1">
          {sheets && Array.isArray(sheets) && sheets.length > 0 ? (
            sheets.map((sheet) => (
              <div
                key={sheet._id}
                className="group flex items-center bg-white border rounded-md px-2 py-1.5 gap-1 transition-all duration-200 whitespace-nowrap text-sm max-w-[160px] hover:shadow-sm border-gray-300"
              >
                <button
                  onClick={() => setActiveSheet(sheet._id)}
                  className={`truncate text-left font-medium flex-1 ${
                    activeSheet === sheet._id ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {sheet.name}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditSheetId(sheet._id);
                      setEditSheetName(sheet.name);
                      setEditSheetHours(sheet.hours);
                      setShowEditSheetModal(true);
                    }}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteSheetId(sheet._id);
                      setShowDeleteSheetModal(true);
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              {sheets === undefined ? "Loading sheets..." : "No sheets available"}
            </p>
          )}
          <button
            onClick={() => setShowNewSheetForm(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all duration-200 text-sm whitespace-nowrap"
          >
            <Plus className="w-3 h-3" />
            New Sheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;