import { useState } from "react";

export default function ReportReader({ onBack, language }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError(null);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const res = await fetch("http://localhost:8000/api/read-report", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Could not read the report.");
      }
    } catch (err) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-teal-600 text-xl tracking-wide">MEDIBRIDGE</h1>
            <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-lg">
              Report Reader
            </span>
          </div>
          <button
            onClick={onBack}
            className="text-sm font-bold text-gray-600 hover:text-teal-600 transition-colors border border-gray-200 px-4 py-2 rounded-xl"
          >
            Back to dashboard
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-800 text-lg mb-2">Upload Your Medical Report</h2>
          <p className="text-sm text-gray-500 mb-5">
            Upload a blood test, X-ray report, prescription, or any medical document.
            We will explain it in simple language and in your preferred language.
            Supports images and PDFs.
          </p>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all">
            <span className="text-3xl mb-3">📄</span>
            <span className="text-sm font-bold text-gray-600 mb-1">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-400">
              JPG, PNG, PDF supported — max 10MB
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xl">📎</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                className="text-xs font-bold text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          )}

          {preview && (
            <img
              src={preview}
              alt="Report preview"
              className="mt-4 rounded-xl max-h-64 object-contain border border-gray-100"
            />
          )}

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-5 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Reading your report..." : "Explain This Report"}
            </button>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-4">

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">
                  {result.report_type}
                </span>
              </div>

              <div className="space-y-5">

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Summary</p>
                  <div className="w-full h-px bg-gray-100 mb-2" />
                  <p className="text-gray-800 text-sm">{result.summary}</p>
                </div>

                {result.key_findings && result.key_findings.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Key Findings</p>
                    <div className="w-full h-px bg-gray-100 mb-3" />
                    <ul className="space-y-2">
                      {result.key_findings.map((finding, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-teal-500 font-bold mt-0.5">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={result.abnormal_values === "None" || !result.abnormal_values
                  ? "bg-green-50 rounded-xl p-4 border border-green-100"
                  : "bg-orange-50 rounded-xl p-4 border border-orange-100"
                }>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                    result.abnormal_values === "None" || !result.abnormal_values
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}>
                    Abnormal Values
                  </p>
                  <p className={`text-sm ${
                    result.abnormal_values === "None" || !result.abnormal_values
                      ? "text-green-800"
                      : "text-orange-800"
                  }`}>
                    {result.abnormal_values === "None" || !result.abnormal_values
                      ? "All values appear to be within normal range."
                      : result.abnormal_values
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">What This Means For You</p>
                  <div className="w-full h-px bg-gray-100 mb-2" />
                  <p className="text-gray-800 text-sm">{result.what_it_means}</p>
                </div>

                {result.questions_for_doctor && result.questions_for_doctor.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                      Questions to Ask Your Doctor
                    </p>
                    <ul className="space-y-2">
                      {result.questions_for_doctor.map((q, i) => (
                        <li key={i} className="flex gap-2 text-sm text-blue-800">
                          <span className="font-bold">{i + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">
                    Explanation in Your Language
                  </p>
                  <p className="text-teal-800 text-sm leading-relaxed">
                    {result.explanation_in_user_language}
                  </p>
                </div>

                <p className="text-xs text-gray-400 border-t pt-4">
                  {result.disclaimer}
                </p>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}