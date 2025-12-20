import React from 'react';
import { Outlet, Link } from 'react-router';

const AdminLayout = () => (
  <div className="drawer lg:drawer-open">
    <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
      <nav className="navbar bg-base-300 px-4">
        <label htmlFor="admin-drawer" className="btn btn-ghost lg:hidden">☰</label>
        <span className="text-lg font-semibold">Admin Dashboard</span>
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
    <div className="drawer-side">
      <label htmlFor="admin-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-64 bg-base-200 min-h-full space-y-2">
        <li><Link to="/admin">Overview</Link></li>
        <li><Link to="/admin/users">Manage Users</Link></li>
        <li><Link to="/admin/lessons">Manage Lessons</Link></li>
        <li><Link to="/dashboard">Back to Dashboard</Link></li>
        <li><Link to="/admin/reported-lessons">Reported Lessons</Link></li>
        <li><Link to="/admin/profile">Admin Profile</Link></li>
      </ul>
    </div>
  </div>
);

export default AdminLayout;