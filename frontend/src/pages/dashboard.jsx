import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { money } from '../utils/format';
import { PropertyForm } from '../components/property';
import {
  DashboardHead,
  Stat,
  ApplicationRow,
  QuickActions,
  OwnerApplication,
} from '../components/dashboard';

export function Dashboard({ user, navigate, notify }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api('/applications')
      .then(setApplications)
      .catch((error) => notify(error.message, 'error'));
  }, []);

  return (
    <section className="page">
      <div className="container">
        <DashboardHead user={user} navigate={navigate} />

        <div className="stats-grid">
          <Stat label="Saved homes" value={user?.favoriteCount ?? '—'} />
          <Stat label="Applications" value={applications.length} />
          <Stat
            label="Profile"
            value={`${user?.profileCompletion || 70}%`}
          />
          <Stat label="Account" value="Active" />
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>My applications</h3>
                <p>Track every application in one place.</p>
              </div>

              <button
                className="text-btn"
                onClick={() => navigate('properties')}
              >
                Browse homes →
              </button>
            </div>

            {applications.length ? (
              <div className="application-list">
                {applications.map((application) => (
                  <ApplicationRow
                    key={application._id}
                    application={application}
                  />
                ))}
              </div>
            ) : (
              <div className="soft-empty">
                You haven't applied to a home yet.
              </div>
            )}
          </section>

          <QuickActions navigate={navigate} />
        </div>
      </div>
    </section>
  );
}

export function OwnerDashboard({ user, navigate, notify }) {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadDashboard = async () => {
    try {
      const [propertyData, applicationData] = await Promise.all([
        api('/owner/properties'),
        api('/applications'),
      ]);

      setProperties(propertyData);
      setApplications(applicationData);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const approvedCount = properties.filter(
    (property) => property.status === 'approved'
  ).length;

  const pendingCount = properties.filter(
    (property) => property.status === 'pending'
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === 'accepted'
  ).length;

  return (
    <section className="page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow dark">
              <span /> OWNER HUB
            </div>
            <h1>Your rentals, all in one place.</h1>
            <p>
              Publish listings, review applications and keep your rental
              pipeline organized.
            </p>
          </div>

          <button
            className="btn primary"
            onClick={() => setShowForm(true)}
          >
            + Add listing
          </button>
        </div>

        <div className="stats-grid">
          <Stat label="Active listings" value={approvedCount} />
          <Stat label="Awaiting approval" value={pendingCount} />
          <Stat label="Applications" value={applications.length} />
          <Stat label="Accepted" value={acceptedCount} />
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Your properties</h3>
                <p>Manage listing status and visibility.</p>
              </div>
            </div>

            {properties.length ? (
              <div className="application-list">
                {properties.map((property) => (
                  <div className="owner-row-line" key={property._id}>
                    <div>
                      <b>{property.title}</b>
                      <small>
                        {property.city} · {money(property.rent)}
                      </small>
                    </div>

                    <span className={`pill ${property.status}`}>
                      {property.status}
                    </span>

                    <button
                      className="text-btn"
                      onClick={() => navigate('property', property._id)}
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="soft-empty">
                You haven't created a listing yet.
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Latest applications</h3>
                <p>Respond quickly to serious tenants.</p>
              </div>
            </div>

            {applications.length ? (
              applications
                .slice(0, 6)
                .map((application) => (
                  <OwnerApplication
                    key={application._id}
                    application={application}
                    reload={loadDashboard}
                    notify={notify}
                  />
                ))
            ) : (
              <div className="soft-empty">No applications yet.</div>
            )}
          </section>
        </div>
      </div>

      {showForm && (
        <PropertyForm
          close={() => setShowForm(false)}
          notify={notify}
          onDone={loadDashboard}
        />
      )}
    </section>
  );
}
