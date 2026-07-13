import React, { useEffect, useState } from 'react';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import SidebarAdmin from '../../components-admin/feed/sidebar/sidebar';
import ContentAdmin from '../../components-admin/feed/content/content';
import { validateAdminFeed } from '../../services/adminService';
import './admin-feed.css';

function AdminFeed() {
  const [telaAtiva, setTelaAtiva] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [clinicName, setClinicName] = useState('');

  useEffect(() => {
    // TODO: validar sessão/permissão do administrador junto ao backend real.
    validateAdminFeed().then((data) => {
      setAdminName(data.admin.person_name);
      setClinicName(data.admin.clinic_name);
    });
  }, []);

  return (
    <div className="feed-wrapper">
      <NavbarGeneral />
      <div className="page-container">
        <SidebarAdmin telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <ContentAdmin
            telaAtiva={telaAtiva}
            setTelaAtiva={setTelaAtiva}
            adminName={adminName}
            clinicName={clinicName}
          />
        </main>
      </div>
    </div>
  );
}

export default AdminFeed;
