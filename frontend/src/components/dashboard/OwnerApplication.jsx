import React from 'react';
import { api } from '../../api';
import { initials } from '../../utils/format';

export function OwnerApplication({ application, reload, notify }) {
  const updateStatus = async (status) => {
    try {
      await api(`/applications/${application._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      notify(`Application ${status}.`, 'success');
      reload();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="owner-app">
      <div className="avatar">{initials(application.tenant?.name)}</div>

      <div>
        <b>{application.tenant?.name}</b>
        <small>
          {application.property?.title} · {application.tenant?.email}
        </small>
      </div>

      <span className={`pill ${application.status}`}>
        {application.status}
      </span>

      <div className="row-actions">
        {application.status === 'pending' && (
          <>
            <button
              className="btn tiny primary"
              onClick={() => updateStatus('accepted')}
            >
              Accept
            </button>
            <button
              className="btn tiny ghost"
              onClick={() => updateStatus('rejected')}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}
