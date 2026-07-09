import React from 'react';
import Dashboard from './dashboard/dashboard';
import ClinicManagement from './clinicManagement/clinicManagement';
import AccessManagement from './accessManagement/accessManagement';
import MasterConfig from './masterConfig/masterConfig';
import './content.css';

interface ContentClinixProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
  adminName: string;
}

function ContentClinix({ telaAtiva, setTelaAtiva, adminName }: ContentClinixProps) {
  return (
    <div className="content-container">
      {(() => {
        switch (telaAtiva) {
          case 0:
            return <Dashboard />;
          case 1:
            return <ClinicManagement />;
          case 2:
            return <AccessManagement />;
          case 3:
            return <MasterConfig />;
          default:
            return <Dashboard />;
        }
      })()}
    </div>
  );
}

export default ContentClinix;
