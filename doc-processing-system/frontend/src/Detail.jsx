import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:8000";

function Detail({ docId, goBack }) {
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [editable, setEditable] = useState("");
  const [status, setStatus] = useState("");

  // Fetch logs + result
  useEffect(() => {
    if (!docId) return;

    const interval = setInterval(async () => {
      try {
        // logs
        const logsRes = await axios.get(`${BASE}/logs/${docId}`);
        setLogs(logsRes.data);

        // status + result
        const res = await axios.get(`${BASE}/status/${docId}`);
        setStatus(res.data.status);

        if (res.data.result) {
          const parsed = JSON.parse(res.data.result);
          setResult(parsed);
          setEditable(JSON.stringify(parsed, null, 2));
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [docId]);

  // Export JSON
  const exportJSON = () => {
    const blob = new Blob([editable], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `doc_${docId}.json`;
    a.click();
  };

  // Export CSV
  const exportCSV = () => {
    try {
      const data = JSON.parse(editable);

      const csv = Object.entries(data)
        .map(([key, val]) =>
          `${key},${Array.isArray(val) ? val.join("|") : val}`
        )
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `doc_${docId}.csv`;
      a.click();
    } catch {
      alert("Invalid JSON");
    }
  };

  // Retry
  const retry = async () => {
    await axios.post(`${BASE}/retry/${docId}`);
    setLogs([]);
    setResult(null);
  };

  // Finalize
  const finalize = async () => {
    await axios.post(`${BASE}/finalize/${docId}`);
    alert("Finalized successfully");
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back */}
      <button
        onClick={goBack}
        className="mb-4 bg-gray-300 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <div className="mb-3">
        <span className="font-semibold">Status: </span>
        <span className="capitalize">{status}</span>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Processing Logs</h3>

        {logs.length === 0 && (
          <p className="text-sm text-gray-500">No logs yet...</p>
        )}

        {logs.map((l, i) => (
          <div
            key={i}
            className="text-sm bg-gray-100 p-2 rounded mb-1"
          >
            {l}
          </div>
        ))}
      </div>

      {result && (
        <div className="bg-white p-4 rounded shadow">

          <h3 className="font-semibold mb-3">Result</h3>

          <p><b>Title:</b> {result.title}</p>

          <p className="mt-2">
            <b>Summary:</b> {result.summary}
          </p>

          <div className="mt-2">
            <b>Keywords:</b>
            <ul className="list-disc ml-5">
              {result.keywords.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>

          <textarea
            className="w-full border p-3 rounded mt-4 font-mono text-sm"
            rows={10}
            value={editable}
            onChange={(e) => setEditable(e.target.value)}
          />

          {/* buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">

            <button
              onClick={exportJSON}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Download JSON
            </button>

            <button
              onClick={exportCSV}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Download CSV
            </button>

            <button
              onClick={retry}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Retry
            </button>

            <button
              onClick={finalize}
              className="bg-purple-500 text-white px-3 py-1 rounded"
            >
              Finalize
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;