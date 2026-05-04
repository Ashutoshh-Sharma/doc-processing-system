import React, { useState } from "react";
import Upload from "./Upload";
import Dashboard from "./Dashboard";
import Detail from "./Detail";

function App() {
  const [page, setPage] = useState("dashboard");
  const [docId, setDocId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          📄 Document Processing System
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setPage("dashboard")}
            className="px-4 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("upload")}
            className="px-4 py-1 bg-green-500 text-white rounded cursor-pointer"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="p-6">

        {page === "upload" && (
          <Upload
            goToDetail={(id) => {
              setDocId(id);
              setPage("detail");
            }}
          />
        )}

        {page === "dashboard" && (
          <Dashboard
            openDetail={(id) => {
              setDocId(id);
              setPage("detail");
            }}
          />
        )}

        {page === "detail" && (
          <Detail
            docId={docId}
            goBack={() => setPage("dashboard")}
          />
        )}
      </div>
    </div>
  );
}

export default App;