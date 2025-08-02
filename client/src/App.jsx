// client/src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './components/AuthRoutes';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AuthRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;