import { useState, useEffect } from "react";

export default function ApprovalMatrixPage() {
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get token from localStorage (matches the current auth system)
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access Approval Matrix.</p>
        </div>
      </div>
    );
  }

  // Determine the correct URL based on hostname
  const host = window.location.hostname;
  const baseUrl = host.includes("newerp.marathonrealty") 
    ? "https://testui.lockated.com" 
    : "https://ui.lockated.com";
  
  const iframeUrl = `${baseUrl}/approval-materics?token=${token}`;

  return (
    <div className="h-full w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)]">
        <iframe 
          src={iframeUrl}
          style={{ 
            width: "100%", 
            height: "100%", 
            border: "none",
            borderRadius: "0.5rem"
          }}
          title="Approval Matrix Management"
          loading="lazy"
        />
      </div>
    </div>
  );
}
