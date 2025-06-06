"use client";

import { useState, FormEvent } from "react";
import {
  Send,
  Key,
  Users,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Mail,
  Copy,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/logo";

interface Message {
  type: string;
  text: string;
}

interface OTPData {
  email: string;
  code: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  // Request OTP State
  const [requestEmail, setRequestEmail] = useState("");

  // request OTP data State
  const [requestOTPData, setRequestOTPData] = useState({
    email: "",
    token: "",
    id: "",
    createdAt: "",
    expiresAt: "",
  });

  // send OTP State
  const [sendToken, setSendToken] = useState("");

  // verify OTP State
  const [sendEmail, setSendEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Table Data State
  const [otpData, setOtpData] = useState<OTPData[]>([]);
  const [eligibleUsers, setEligibleUsers] = useState<User[]>([]);

  const [copySuccess, setCopySuccess] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      showMessage("error", "Failed to copy token");
    }
  };

  // Request OTP Handler
  const handleRequestOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!requestEmail) {
      showMessage("error", "Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mymedicines-api-xwipe.ondigitalocean.app/v1/otp/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: requestEmail }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        showMessage(
          "success",
          `OTP requested successfully for ${requestEmail}`
        );
        setRequestEmail("");
        setRequestOTPData({
          email: data.email,
          token: data.token,
          id: data.id,
          createdAt: data.createdAt,
          expiresAt: data.expiresAt,
        });
      } else {
        showMessage("error", "Failed to request OTP");
      }
    } catch (error) {
      showMessage("error", "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!sendEmail || !otpCode) {
      showMessage("error", "Please enter both email and OTP code");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual endpoint
      const response = await fetch(
        "https://mymedicines-api-xwipe.ondigitalocean.app/v1/otp/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: sendEmail,
            token: otpCode,
          }),
        }
      );

      if (response.ok) {
        showMessage("success", `OTP verified successfully`);
        setSendEmail("");
        setOtpCode("");
      } else {
        showMessage("error", "Failed to verify OTP");
      }
    } catch (error) {
      showMessage("error", "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP Handler
  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!requestOTPData.token) {
      showMessage("error", "Please enter OTP code");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(
        "https://mymedicines-api-xwipe.ondigitalocean.app/v1/otp/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: requestOTPData.token,
          }),
        }
      );

      if (response.ok) {
        showMessage("success", `OTP sent successfully`);
        setRequestOTPData({
          email: "",
          token: "",
          id: "",
          createdAt: "",
          expiresAt: "",
        });
      } else {
        showMessage("error", "Failed to send OTP");
      }
    } catch (error) {
      showMessage("error", "Network error occurred");
    } finally {
      setIsSending(false);
    }
  };

  // Fetch OTP Data
  const fetchOTPData = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual endpoint
      const response = await fetch(
        "https://mymedicines-api-xwipe.ondigitalocean.app/api/admin/otp-list"
      );
      if (response.ok) {
        const data = await response.json();
        setOtpData(data.otps || []);
        showMessage("success", "OTP data refreshed");
      } else {
        showMessage("error", "Failed to fetch OTP data");
      }
    } catch (error) {
      showMessage("error", "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Eligible Users
  const fetchEligibleUsers = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual endpoint
      const response = await fetch(
        "https://mymedicines-api-xwipe.ondigitalocean.app/api/admin/eligible-users"
      );
      if (response.ok) {
        const data = await response.json();
        setEligibleUsers(data.users || []);
        showMessage("success", "Eligible users data refreshed");
      } else {
        showMessage("error", "Failed to fetch eligible users");
      }
    } catch (error) {
      showMessage("error", "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "request", label: "Request OTP", icon: Key },
    { id: "send", label: "Send OTP", icon: Send },
    { id: "verify", label: "Verify OTP", icon: CheckCircle },
    // { id: "view", label: "View Data", icon: Users },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFF4EF] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center font-medium gap-3 ${
              message.type === "success"
                ? "bg-[#FFF4EF] text-green-700 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {message.text}
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-white rounded-lg p-3 flex items-center justify-between shadow-md"
          >
            <span className="font-medium text-gray-800">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mb-4 bg-white rounded-lg shadow-md overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#DE4C27] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop Tab Navigation */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden mb-4">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#DE4C27] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-4 lg:mt-0">
          <div className="p-4 sm:p-8">
            {/* Request OTP Tab */}
            {activeTab === "request" && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#FFF4EF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="text-[#DE4C27]" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Request OTP
                  </h2>
                  <p className="text-gray-600">
                    Generate OTP for an email address
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        value={requestEmail}
                        onChange={(e) => setRequestEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DE4C27]/75 focus:border-[#DE4C27]/75"
                        placeholder="Enter email address"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleRequestOTP(e)
                        }
                      />
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-5">
                      <p className="text-gray-600 font-bold">
                        {requestOTPData.email}
                      </p>
                      <div className="flex items-center gap-10">
                        <p className="text-gray-600 font-bold">
                          {requestOTPData.token}
                        </p>
                        {requestOTPData.token && (
                          <button
                            onClick={() =>
                              copyToClipboard(requestOTPData.token)
                            }
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="Copy token"
                          >
                            {copySuccess ? (
                              <CheckCircle
                                className="text-green-500"
                                size={16}
                              />
                            ) : (
                              <Copy className="text-gray-400" size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {requestOTPData.token && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Send className="text-[#DE4C27]" size={20} />
                          <h3 className="text-lg font-medium text-gray-800">
                            Send OTP
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Send this OTP to the user's email address
                        </p>
                        <button
                          onClick={handleSendOTP}
                          disabled={isLoading}
                          className="w-full bg-[#DE4C27] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#DE4C27]/75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <RefreshCw className="animate-spin" size={20} />
                          ) : (
                            <Send size={20} />
                          )}
                          {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                      </div>
                    )}
                  </div>

                  {requestOTPData.token ? (
                    ""
                  ) : (
                    <button
                      onClick={handleRequestOTP}
                      disabled={isLoading}
                      className="w-full bg-[#DE4C27] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#DE4C27]/75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="animate-spin" size={20} />
                      ) : (
                        <Key size={20} />
                      )}
                      {isLoading ? "Requesting..." : "Request OTP"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Send OTP Tab */}
            {activeTab === "send" && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#FFF4EF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-[#DE4C27]" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Send OTP
                  </h2>
                  <p className="text-gray-600">
                    Send OTP code to an email address
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={sendToken}
                      onChange={(e) => setSendToken(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DE4C27]/75 focus:border-[#DE4C27]/75"
                      placeholder="Enter OTP code"
                      maxLength={6}
                      onKeyPress={(e) => e.key === "Enter" && handleSendOTP(e)}
                    />
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={isSending}
                    className="w-full bg-[#DE4C27] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#DE4C27]/75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    {isSending ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Verify OTP Tab */}
            {activeTab === "verify" && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#FFF4EF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-[#DE4C27]" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-gray-600">
                    Verify OTP code sent to an email address
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        value={sendEmail}
                        onChange={(e) => setSendEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DE4C27]/75 focus:border-[#DE4C27]/75"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DE4C27]/75 focus:border-[#DE4C27]/75"
                      placeholder="Enter OTP code"
                      maxLength={6}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleVerifyOTP(e)
                      }
                    />
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full bg-[#DE4C27] text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* View Data Tab */}
            {activeTab === "view" && (
              <div>
                {/* <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#FFF4EF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-[#DE4C27]" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    View OTP Data
                  </h2>
                  <p className="text-gray-600">
                    View all generated OTPs and eligible users
                  </p>
                </div> */}

                {/* <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={fetchOTPData}
                    disabled={isLoading}
                    className="flex-1 bg-[#DE4C27] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#DE4C27]/75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <RefreshCw size={20} />
                    )}
                    Refresh OTP Data
                  </button>
                  <button
                    onClick={fetchEligibleUsers}
                    disabled={isLoading}
                    className="flex-1 bg-[#DE4C27] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#DE4C27]/75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <Users size={20} />
                    )}
                    Refresh Eligible Users
                  </button>
                </div> */}

                {/* OTP Data Table */}
                {/* <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Generated OTPs
                  </h3>
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            OTP Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expires At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {otpData.length > 0 ? (
                          otpData.map((otp, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {otp.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                {otp.code}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    otp.status === "active"
                                      ? "bg-green-100 text-[#DE4C27]"
                                      : otp.status === "used"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {otp.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {otp.createdAt}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {otp.expiresAt}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              No OTP data available. Click "Refresh OTP Data" to
                              load data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div> */}

                {/* Eligible Users Table */}
                {/* <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Eligible Users
                  </h3>
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Login
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {eligibleUsers.length > 0 ? (
                          eligibleUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    user.status === "active"
                                      ? "bg-green-100 text-[#DE4C27]"
                                      : user.status === "inactive"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.lastLogin}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              No eligible users data available. Click "Refresh
                              Eligible Users" to load data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
