import React, { useEffect, useState } from 'react';
import { api, clearSession, getStoredUser, getToken } from '../api';
import { Splash, Toast, Header, Footer } from '../components/layout';
import { AuthGate } from '../components/ui';
import { Home } from '../pages/home';
import { Properties, Favorites } from '../pages/properties';
import { PropertyDetail } from '../components/property';
import { Matches } from '../pages/matches';
import { Dashboard, OwnerDashboard } from '../pages/dashboard';
import { Chat } from '../pages/chat';
import { Profile } from '../pages/profile';
import { Admin } from '../pages/admin';
import { Auth } from '../pages/auth';

const publicPages = [
  'home',
  'properties',
  'matches',
  'login',
  'register',
  'property',
];

export function App() {
  const [user, setUser] = useState(getStoredUser());
  const [page, setPage] = useState('home');
  const [routeId, setRouteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const notify = (message, type = 'info') => {
    setToast({ message, type });

    window.clearTimeout(window.__rmToast);
    window.__rmToast = window.setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const navigate = (nextPage, id = null) => {
    setPage(nextPage);
    setRouteId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!getToken()) {
      setLoadingSession(false);
      return;
    }

    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => setLoadingSession(false));
  }, []);

  const logout = () => {
    clearSession();
    setUser(null);
    navigate('home');
    notify('You have been logged out safely.', 'success');
  };

  if (loadingSession) {
    return <Splash />;
  }

  const needsLogin = !publicPages.includes(page) && !user;

  if (needsLogin) {
    return (
      <>
        <Header
          user={null}
          page="home"
          navigate={navigate}
          logout={logout}
        />
        <main>
          <AuthGate onLogin={() => navigate('login')} />
        </main>
      </>
    );
  }

  let content;

  switch (page) {
    case 'home':
      content = <Home user={user} navigate={navigate} />;
      break;

    case 'properties':
      content = (
        <Properties
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'property':
      content = (
        <PropertyDetail
          id={routeId}
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'matches':
      content = (
        <Matches
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'favorites':
      content = (
        <Favorites
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'dashboard':
      content = (
        <Dashboard
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'owner':
      content = (
        <OwnerDashboard
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'chat':
      content = (
        <Chat
          user={user}
          target={routeId}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'profile':
      content = (
        <Profile
          user={user}
          onUser={setUser}
          notify={notify}
        />
      );
      break;

    case 'admin':
      content = (
        <Admin
          user={user}
          navigate={navigate}
          notify={notify}
        />
      );
      break;

    case 'login':
      content = (
        <Auth
          mode="login"
          onDone={(loggedInUser) => {
            setUser(loggedInUser);
            navigate('dashboard');
          }}
          onSwitch={() => navigate('register')}
          notify={notify}
        />
      );
      break;

    case 'register':
      content = (
        <Auth
          mode="register"
          onDone={(loggedInUser) => {
            setUser(loggedInUser);
            navigate('dashboard');
          }}
          onSwitch={() => navigate('login')}
          notify={notify}
        />
      );
      break;

    default:
      content = <Home user={user} navigate={navigate} />;
  }

  return (
    <div className="app-shell">
      <Header
        user={user}
        page={page}
        navigate={navigate}
        logout={logout}
      />

      <main>{content}</main>

      <Footer navigate={navigate} />

      {toast && <Toast {...toast} />}
    </div>
  );
}
