import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { UploadCloud, AlertTriangle, FileText, CheckCircle, Download } from 'lucide-react';

function App() {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files) return;
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setData(response.data);
    } catch (error) {
      console.error("Upload error", error);
      alert("Ensure Backend is running on port 8000");
    }
    setLoading(false);
  };

  // --- NEW FUNCTION: DOWNLOAD REPORT ---
  const downloadReport = () => {
    if (!data) return;
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "Due_Diligence_Report.json";
    link.click();
  };
  // -------------------------------------

  const chartData = data ? Object.keys(data.summary.heatmap).map(key => ({
    name: key,
    RiskScore: data.summary.heatmap[key]
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">M&A Due Diligence AI Engine</h1>
          <p className="text-gray-500">Automated Legal Risk Assessment & Heatmaps</p>
        </div>
        {/* NEW DOWNLOAD BUTTON */}
        {data && (
          <button 
            onClick={downloadReport}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <Download size={18} className="mr-2" /> Download Report (JSON)
          </button>
        )}
      </header>

      {!data && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
            <UploadCloud size={48} className="text-blue-500 mb-4" />
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button 
              onClick={handleUpload} 
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? 'Processing Documents...' : 'Analyze Documents'}
            </button>
          </div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Acquisition Risk Index</h2>
            <div className="flex items-center justify-center h-48">
              <div className={`text-6xl font-bold ${data.summary.acquisition_risk_index > 50 ? 'text-red-500' : 'text-green-500'}`}>
                {data.summary.acquisition_risk_index}
                <span className="text-xl text-gray-400">/100</span>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm">Higher score indicates higher liability.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Red-Flag Heatmap</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="RiskScore" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold">Auto-Generated DD Report</h2>
               <button onClick={() => window.location.reload()} className="text-blue-600 text-sm hover:underline">Upload New Files</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags Detected</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.detailed_reports.map((doc, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <FileText size={16} className="mr-2 text-gray-400"/> {doc.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.risk_score > 50 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {doc.risk_score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.flags.length > 0 ? (
                          doc.flags.map((flag, fIdx) => (
                            <div key={fIdx} className="flex items-center text-red-600 mb-1">
                              <AlertTriangle size={14} className="mr-1"/> {flag.type}: {flag.desc}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={14} className="mr-1"/> No Risks Detected
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;