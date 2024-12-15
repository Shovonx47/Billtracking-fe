"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert library

export default function Receptionist() {
  const [vendorName, setVendorName] = useState("");
  const [userData, setUserData] = useState(null); // Added state for user data
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "Receptionist") {
      router.push("/");
    } else {
      setUserData(user); // Set user data if authenticated
    }
  }, []);

  const submitBill = async () => {
    try {
      const response = await fetch("http://localhost/backend/receptionist.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ vendor_name: vendorName }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit bill");
      }

      const data = await response.json();

      // Show SweetAlert pop-up with the bill number
      Swal.fire({
        icon: "success",
        title: "Bill Submitted",
        text: `Bill Number: ${data.bill_number}`,
      });
    } catch (error) {
      // Show error in SweetAlert pop-up
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div>
      {/* Upper bar */}
      <div className="bg-gray-800 text-white flex items-center justify-between px-6 py-3">
        <h1 className="text-lg font-bold">Bill Tracking System</h1>
        <nav className="flex space-x-4">
          <a href="/vendor" className="hover:text-blue-400 transition-colors">
            Vendor
          </a>
          <a href="/receptionist" className="hover:text-blue-400 transition-colors">
            Receptionist
          </a>
          <a href="/accounts" className="hover:text-blue-400 transition-colors">
            Accounts
          </a>
        </nav>

        {/* User info on the right */}
        <div className="text-sm flex flex-col items-end mr-20">
          {userData && (
            <div>
              <p>
                <span className="font-bold"></span>{userData.username}
              </p>
              <p>
                <span className="font-bold"></span>{userData.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Submit Bill</h2>
        <input
          type="text"
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={submitBill}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Bill
        </button>
      </div>
    </div>
  );
}