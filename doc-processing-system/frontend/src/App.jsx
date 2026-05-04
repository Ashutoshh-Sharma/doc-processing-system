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
      <div className="bg-white shadow px-6 py-3 flex justify-between">
        <h1 className="font-semibold text-lg">
          📄 Document Processing System
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setPage("dashboard")}
            className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("upload")}
            className="bg-green-500 text-white px-4 py-1 rounded cursor-pointer"
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