import React from 'react';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <ul className="space-y-2">
            <li>View Users</li>
            <li>Manage Roles</li>
            <li>User Permissions</li>
          </ul>
        </div>

        {/* System Settings */}
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <ul className="space-y-2">
            <li>General Settings</li>
            <li>Security Settings</li>
            <li>Email Configuration</li>
          </ul>
        </div>

        {/* Analytics */}
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <ul className="space-y-2">
            <li>User Activity</li>
            <li>System Logs</li>
            <li>Performance Metrics</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 