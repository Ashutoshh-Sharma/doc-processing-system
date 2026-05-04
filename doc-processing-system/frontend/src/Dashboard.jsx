import React, { useEffect, useState } from "react";
import { getDocuments } from "./api";

function Dashboard({ openDetail }) {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const res = await getDocuments();
    setDocs(res.data);
  };

  const filteredDocs = docs.filter((d) => {
    const matchSearch = d.filename
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : d.status === filter;

    return matchSearch && matchFilter;
  });

  const getColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "processing") return "bg-yellow-100 text-yellow-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Documents</h2>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredDocs.map((d) => (
          <div
            key={d.id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="font-semibold">{d.filename}</h3>

            <span
              className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getColor(
                d.status
              )}`}
            >
              {d.status}
            </span>

            <button
              onClick={() => openDetail(d.id)}
              className="mt-3 w-full bg-blue-500 text-white py-1 rounded cursor-pointer"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;