import React, { useState } from "react";
import { uploadFile } from "./api";

function Upload({ goToDetail }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(20);

      const res = await uploadFile(file);

      setProgress(100);

      setTimeout(() => {
        goToDetail(res.data.doc_id);
      }, 500);

    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">

      <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

      <input
        type="file"
        className="w-full border p-2 rounded cursor-pointer"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="mt-4 w-full py-2 bg-green-500 text-white rounded cursor-pointer"
      >
        Upload
      </button>

      {loading && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-green-500 h-3 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;