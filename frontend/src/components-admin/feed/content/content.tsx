import React from 'react';
import Dashboard from './dashboard/dashboard';
import ServicesSpecialties from './servicesSpecialties/servicesSpecialties';
import StaffManagement from './staffManagement/staffManagement';
import ScheduleConfig from './scheduleConfig/scheduleConfig';
import './content.css';

interface ContentAdminProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
  adminName: string;
}

function ContentAdmin({ telaAtiva, setTelaAtiva, adminName }: ContentAdminProps) {
  return (
    <div className="content-container">
      {(() => {
        switch (telaAtiva) {
          case 0:
            return <Dashboard adminName={adminName} />;
          case 1:
            return <ServicesSpecialties />;
          case 2:
            return <StaffManagement />;
          case 3:
            return <ScheduleConfig />;
          default:
            return <Dashboard adminName={adminName} />;
        }
      })()}
    </div>
  );
}

export default ContentAdmin;
