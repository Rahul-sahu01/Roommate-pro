import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Stat } from '../components/dashboard';

export function Admin({ user, notify }) {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);

  const loadAdminData = async () => {
    try {
      const [statsData, propertyData, userData] = await Promise.all([
        api('/admin/stats'),
        api('/admin/properties'),
        api('/admin/users'),
      ]);

      setStats(statsData);
      setProperties(propertyData);
      setUsers(userData);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const changePropertyStatus = async (id, status) => {
    try {
      await api(`/admin/properties/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      notify(`Listing ${status}.`, 'success');
      loadAdminData();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;

    try {
      await api(`/admin/users/${id}`, {
        method: 'DELETE',
      });

      notify('User deleted.', 'success');
      loadAdminData();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow dark">
              <span /> ADMIN CONTROL CENTER
            </div>
            <h1>Keep RoomMate Pro healthy.</h1>
            <p>Review listings, users and marketplace activity.</p>
          </div>
        </div>

        {stats && (
          <div className="stats-grid six">
            <Stat label="Users" value={stats.users} />
            <Stat label="Tenants" value={stats.tenants} />
            <Stat label="Owners" value={stats.owners} />
            <Stat label="Listings" value={stats.properties} />
            <Stat label="Pending" value={stats.pending} />
            <Stat label="Applications" value={stats.applications} />
          </div>
        )}

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Property approvals</h3>
                <p>
                  Approve high-quality listings and reject incomplete ones.
                </p>
              </div>
            </div>

            <div className="admin-table">
              {properties.map((property) => (
                <div className="admin-row" key={property._id}>
                  <div>
                    <b>{property.title}</b>
                    <small>
                      {property.owner?.email} · {property.city}
                    </small>
                  </div>

                  <span className={`pill ${property.status}`}>
                    {property.status}
                  </span>

                  <div className="row-actions">
                    {property.status !== 'approved' && (
                      <button
                        className="btn tiny primary"
                        onClick={() =>
                          changePropertyStatus(property._id, 'approved')
                        }
                      >
                        Approve
                      </button>
                    )}

                    {property.status !== 'rejected' && (
                      <button
                        className="btn tiny ghost"
                        onClick={() =>
                          changePropertyStatus(property._id, 'rejected')
                        }
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Users</h3>
                <p>Manage accounts and roles.</p>
              </div>
            </div>

            <div className="admin-table">
              {users.map((account) => (
                <div className="admin-row" key={account._id}>
                  <div>
                    <b>{account.name}</b>
                    <small>{account.email}</small>
                  </div>

                  <span className="pill">{account.role}</span>

                  <button
                    className="btn tiny danger"
                    disabled={String(account._id) === String(user.id)}
                    onClick={() => deleteUser(account._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
