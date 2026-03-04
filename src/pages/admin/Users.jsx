import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { Users, Search, Edit, Trash2, Check, X } from 'lucide-react'
import './Users.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="users-page">
        <div className="page-header">
          <h2>Users</h2>
          <div className="header-actions">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users..."
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
                  <th>User</th>
                  <th>Email</th>
                  <th>Creator</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="user-avatar" />
                          ) : (
                            <div className="user-avatar-placeholder">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <span>{user.username || 'No username'}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.is_creator ? (
                          <span className="badge badge-creator">
                            <Check size={14} /> Creator
                          </span>
                        ) : (
                          <span className="badge badge-user">User</span>
                        )}
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="actions">
                          <button className="btn-icon" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button className="btn-icon btn-danger" title="Delete">
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
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{users.filter(u => u.is_creator).length}</div>
            <span className="stat-label">Creators</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
