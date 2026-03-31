import { useState, useEffect } from 'react'
import { adminUsersService } from '../../lib/supabaseDatabase'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Users, Search, Trash2, Check } from 'lucide-react'
import './Users.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Fetch admin users from Supabase
      const adminData = await adminUsersService.getAll()
      setUsers(adminData || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this admin user? This action cannot be undone.')) return

    try {
      await adminUsersService.delete(userId)
      fetchUsers()
      toast.success('Admin user removed successfully!')
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="users-page">
        <div className="page-header">
          <h2>Admin Users</h2>
          <div className="header-actions">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search admin users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No admin users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar-placeholder">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        {user.is_super_admin ? (
                          <span className="badge badge-admin">
                            <Check size={14} /> Super Admin
                          </span>
                        ) : (
                          <span className="badge badge-user">Admin</span>
                        )}
                      </td>
                      <td>{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Remove Admin"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="users-stats">
          <div className="stat-box">
            <Users size={24} color="#ff6b35" />
            <div>
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Admin Users</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{users.filter(u => u.is_super_admin).length}</div>
            <span className="stat-label">Super Admins</span>
          </div>
        </div>

        <div className="add-admin-notice">
          <p>To add a new admin user, create their account in Supabase Auth and add a record to the admin_users table.</p>
        </div>
      </div>
    </AdminLayout>
  )
}
