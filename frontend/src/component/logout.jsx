import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const accessToken =
        localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/logout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${accessToken}`,
          },

          credentials: "include",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Logout failed"
        );
        return;
      }

      // Clear local authentication
      localStorage.removeItem("user");
      localStorage.removeItem(
        "accessToken"
      );
      localStorage.removeItem(
        "refreshToken"
      );

      toast.success(
        "Logout successfully"
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );

      toast.error(
        "Something went wrong"
      );
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;