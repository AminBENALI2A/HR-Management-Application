import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { withAuth } from "../../hoc/withAuth";
import { API_BASE_URL } from "../../utils/config";

interface NavbarProps {
  onToggle: (isCollapsed: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle(newState);
  };

  // Close management dropdown when navbar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setManagementOpen(false);
    }
  }, [isCollapsed]);

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  async function handleLogout(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("Successful logout");
        // Clear any client-side state if needed
        // localStorage.removeItem('user'); // if you store user data
        // sessionStorage.clear(); // if you use session storage
        
        navigate("/auth");
      } else {
        // Handle specific error responses
        const errorData = await response.json().catch(() => ({}));
        console.error("Logout failed:", errorData.message || response.statusText);
        
        // Still navigate to login on server errors (optional)
        navigate("/auth");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally still redirect on network errors
      navigate("/auth");
    }
  }

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 bg-white ${
        isCollapsed ? "collapsed-nav" : ""
      }`}
      style={{
        width: isCollapsed ? "80px" : "280px",
        minHeight: "100vh",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header */}
      <div 
        className="d-flex justify-content-between align-items-center border-bottom"
        style={{
          padding: "1.5rem 1.25rem",
          borderBottom: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
        }}
      >
        {!isCollapsed && (
          <div className="d-flex align-items-center">
            <div 
              className="rounded-2 me-2 d-flex align-items-center justify-content-center"
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#3b82f6",
              }}
            >
              <i className="bi bi-grid-3x3-gap-fill text-white" style={{ fontSize: "14px" }}></i>
            </div>
            <span 
              className="fw-semibold"
              style={{ 
                fontSize: "1.1rem",
                color: isCollapsed ? "#9ca3af" : "#1f2937",
                letterSpacing: "-0.025em",
                transition: "color 0.2s ease"
              }}
            >
              Dashboard
            </span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="btn p-2 rounded-2"
          style={{
            border: "1px solid #e5e7eb",
            backgroundColor: "white",
            color: "#6b7280",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          <i 
            className={`bi ${isCollapsed ? "bi-chevron-right" : "bi-chevron-left"}`}
            style={{ fontSize: "14px" }}
          ></i>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-grow-1" style={{ padding: "1.5rem 1rem" }}>
        <nav>
          <ul className="nav flex-column" style={{ gap: "0.25rem" }}>
            <li className="nav-item">
              <div
                className={`nav-link d-flex align-items-center rounded-2 ${
                  managementOpen ? "" : ""
                }`}
                style={{
                  cursor: isCollapsed ? "default" : "pointer",
                  padding: "0.75rem",
                  color: isCollapsed ? "#9ca3af" : "#374151",
                  fontWeight: "500",
                  fontSize: "0.925rem",
                  transition: "all 0.2s ease",
                  border: "none",
                  backgroundColor: (isCollapsed || !managementOpen) ? "transparent" : "#f3f4f6",
                  pointerEvents: isCollapsed ? "none" : "auto",
                }}
                onClick={() => !isCollapsed && setManagementOpen(!managementOpen)}
                onMouseEnter={(e) => {
                  if (!managementOpen && !isCollapsed) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCollapsed) {
                    e.currentTarget.style.backgroundColor = managementOpen ? "#f3f4f6" : "transparent";
                  }
                }}
              >
                <div 
                  className="rounded-1 me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: isCollapsed ? "#e5e7eb" : (managementOpen ? "#3b82f6" : "#e5e7eb"),
                    transition: "all 0.2s ease",
                  }}
                >
                  <i 
                    className="bi bi-people-fill" 
                    style={{ 
                      fontSize: "11px",
                      color: isCollapsed ? "#9ca3af" : (managementOpen ? "white" : "#6b7280")
                    }}
                  ></i>
                </div>
                {!isCollapsed && (
                  <>
                    <span style={{ flex: 1 }}>Management</span>
                    <i
                      className={`bi bi-chevron-${managementOpen ? "down" : "right"}`}
                      style={{ 
                        fontSize: "12px",
                        color: isCollapsed ? "#d1d5db" : "#9ca3af",
                        transition: "transform 0.2s ease"
                      }}
                    ></i>
                  </>
                )}
              </div>
              
              {!isCollapsed && managementOpen && (
                <ul 
                  className="nav flex-column mt-1"
                  style={{ 
                    paddingLeft: "2rem",
                    gap: "0.125rem"
                  }}
                >
                  <li>
                    <Link 
                      to="/users" 
                      className={`nav-link rounded-2 d-flex align-items-center ${
                        isActiveRoute("/users") ? "active" : ""
                      }`}
                      style={{
                        padding: "0.625rem 0.75rem",
                        color: isActiveRoute("/users") ? "#3b82f6" : "#6b7280",
                        backgroundColor: isActiveRoute("/users") ? "#eff6ff" : "transparent",
                        fontWeight: isActiveRoute("/users") ? "500" : "400",
                        fontSize: "0.875rem",
                        transition: "all 0.2s ease",
                        textDecoration: "none",
                        border: isActiveRoute("/users") ? "1px solid #dbeafe" : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActiveRoute("/users")) {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                          e.currentTarget.style.color = "#374151";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActiveRoute("/users")) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#6b7280";
                        }
                      }}
                    >
                      <i className="bi bi-person-lines-fill me-2" style={{ fontSize: "14px" }}></i>
                      Users Management
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/partenaires" 
                      className={`nav-link rounded-2 d-flex align-items-center ${
                        isActiveRoute("/partenaires") ? "active" : ""
                      }`}
                      style={{
                        padding: "0.625rem 0.75rem",
                        color: isActiveRoute("/partenaires") ? "#3b82f6" : "#6b7280",
                        backgroundColor: isActiveRoute("/partenaires") ? "#eff6ff" : "transparent",
                        fontWeight: isActiveRoute("/partenaires") ? "500" : "400",
                        fontSize: "0.875rem",
                        transition: "all 0.2s ease",
                        textDecoration: "none",
                        border: isActiveRoute("/partenaires") ? "1px solid #dbeafe" : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActiveRoute("/partenaires")) {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                          e.currentTarget.style.color = "#374151";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActiveRoute("/partenaires")) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#6b7280";
                        }
                      }}
                    >
                      <i className="bi bi-building me-2" style={{ fontSize: "14px" }}></i>
                      Partners Management
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Profile Section */}
      <div 
        className="border-top"
        style={{
          borderTop: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
        }}
      >
        {!isCollapsed ? (
          <div className="dropdown p-3">
            <button
              type="button"
              className="d-flex align-items-center text-decoration-none dropdown-toggle border-0 bg-transparent w-100"
              data-bs-toggle="dropdown"
              style={{
                color: "#374151",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
            <div 
              className="rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#e5e7eb",
                color: "#6b7280",
              }}
            >
              <i className="bi bi-person-fill" style={{ fontSize: "18px" }}></i>
            </div>
            <div className="d-flex flex-column">
              <span style={{ fontWeight: "500", fontSize: "0.925rem" }}>Admin User</span>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Administrator</span>
            </div>
            </button>
            <ul 
              className="dropdown-menu dropdown-menu-end shadow-lg border-0"
              style={{
                borderRadius: "0.75rem",
                padding: "0.5rem",
                marginTop: "0.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <li>
                <button 
                  type="button"
                  className="dropdown-item rounded-2 border-0 bg-transparent w-100 text-start" 
                  style={{
                    padding: "0.625rem 0.75rem",
                    fontSize: "0.875rem",
                    color: "#374151",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <i className="bi bi-person me-2" style={{ fontSize: "14px" }}></i>
                  Profile
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="dropdown-item rounded-2 border-0 bg-transparent w-100 text-start" 
                  style={{
                    padding: "0.625rem 0.75rem",
                    fontSize: "0.875rem",
                    color: "#374151",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <i className="bi bi-gear me-2" style={{ fontSize: "14px" }}></i>
                  Settings
                </button>
              </li>
              <li><hr className="dropdown-divider my-2" style={{ borderColor: "#f3f4f6" }} /></li>
              <li>
                <button 
                  type="button"
                  className="dropdown-item rounded-2 border-0 bg-transparent w-100 text-start" 
                  style={{
                    padding: "0.625rem 0.75rem",
                    fontSize: "0.875rem",
                    color: "#dc2626",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2" style={{ fontSize: "14px" }}></i>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="text-center p-3">
            <div 
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#e5e7eb",
                color: "#6b7280",
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              <i className="bi bi-person-fill" style={{ fontSize: "16px" }}></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(Navbar);