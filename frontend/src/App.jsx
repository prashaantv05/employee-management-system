import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeesList from './pages/EmployeesList';
import EmployeeFormPage from './pages/EmployeeFormPage';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dashboardSelectedEmployee, setDashboardSelectedEmployee] = useState(null);

  const handleEditSelect = (emp) => {
    setSelectedEmployee(emp);
    setCurrentTab('edit');
  };

  const handleDashboardEmployeeSelect = (emp) => {
    setDashboardSelectedEmployee(emp);
    setCurrentTab('list');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            setCurrentTab={setCurrentTab}
            setSelectedEmployee={handleDashboardEmployeeSelect}
          />
        );
      case 'list':
        return (
          <EmployeesList
            setCurrentTab={setCurrentTab}
            setSelectedEmployee={setSelectedEmployee}
            selectedEmployeeForModal={dashboardSelectedEmployee}
            clearSelectedEmployee={() => setDashboardSelectedEmployee(null)}
          />
        );
      case 'add':
        return (
          <EmployeeFormPage
            mode="add"
            onSuccess={() => setCurrentTab('list')}
            onCancel={() => setCurrentTab('dashboard')}
          />
        );
      case 'edit':
        return (
          <EmployeeFormPage
            mode="edit"
            employeeToEdit={selectedEmployee}
            onSuccess={() => {
              setSelectedEmployee(null);
              setCurrentTab('list');
            }}
            onCancel={() => {
              setSelectedEmployee(null);
              setCurrentTab('list');
            }}
          />
        );
      default:
        return (
          <Dashboard
            setCurrentTab={setCurrentTab}
            setSelectedEmployee={handleDashboardEmployeeSelect}
          />
        );
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
