import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withAuth } from "../../hoc/withAuth";

interface NavbarProps {
  onToggle: (isCollapsed: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle(newState);
  };

  return (
    <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light ${isCollapsed ? 'collapsed-nav' : ''}`} 
         style={{ width: isCollapsed ? '80px' : '280px', minHeight: '100vh', transition: 'width 0.3s ease' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {!isCollapsed && <span className="fs-4 fw-bold">Management System</span>}
        <button 
          onClick={toggleCollapse}
          className="btn btn-sm btn-outline-secondary"
          style={{ marginLeft: isCollapsed ? '0' : 'auto' }}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <div 
            className={`nav-link d-flex align-items-center ${managementOpen ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setManagementOpen(!managementOpen)}
          >
            <i className="bi bi-people-fill me-2"></i>
            {!isCollapsed && (
              <>
                <span>Management</span>
                <i className={`bi bi-chevron-${managementOpen ? 'down' : 'right'} ms-auto`}></i>
              </>
            )}
          </div>
          {!isCollapsed && managementOpen && (
            <ul className="nav flex-column ps-4">
              <li>
                <Link to="/users" className="nav-link">
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Users Management
                </Link>
              </li>
              <li>
                <Link to="/partenaires" className="nav-link">
                  <i className="bi bi-building me-2"></i>
                  Partners Management
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <hr />
      {!isCollapsed && (
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
            <i className="bi bi-person-circle me-2"></i>
            <strong>Admin</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-light text-small shadow">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      )}
      {isCollapsed && (
        <div className="text-center">
          <i className="bi bi-person-circle fs-4"></i>
        </div>
      )}
    </div>
  );
};

export default withAuth(Navbar);