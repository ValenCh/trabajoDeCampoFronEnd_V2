import React from 'react';

const TABS = [
  { key: 'personas',   label: 'Personas',   icon: 'fa-users' },
  { key: 'equipos',    label: 'Equipos',     icon: 'fa-laptop' },
  { key: 'documentos', label: 'Documentos',  icon: 'fa-file' },
];

const MemoriaDetalleTabs = ({ activeTab, onTabChange, conteos }) => {
  return (
    <div className="memoria-detalle-tabs">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`memoria-tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          <i className={`fa-solid ${tab.icon}`} />
          {tab.label} ({conteos[tab.key] ?? 0})
        </button>
      ))}
    </div>
  );
};

export default MemoriaDetalleTabs;
