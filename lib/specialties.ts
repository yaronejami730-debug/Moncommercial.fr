export type SpecialtyCategory = {
  key: string;
  label: string;
  icon: string;
  groups: { label: string; items: string[] }[];
};

export const SPECIALTY_CATALOG: SpecialtyCategory[] = [
  {
    key: 'technique',
    label: 'Métiers techniques (terrain)',
    icon: 'construction',
    groups: [
      {
        label: 'Chauffage / thermique',
        items: [
          'Chauffagiste',
          'Installateur pompe à chaleur (PAC)',
          'Technicien chaudière (gaz / fioul / granulés)',
          'Plombier chauffagiste',
          'Frigoriste (clim + PAC)',
          'Technicien maintenance chauffage',
        ],
      },
      {
        label: 'Isolation',
        items: [
          'Isolateur thermique (combles, murs, sols)',
          'Façadier (ITE)',
          'Étancheur',
          'Plaquiste (doublage isolant)',
        ],
      },
      {
        label: 'Menuiserie / ouvertures',
        items: [
          'Menuisier (fenêtres, portes)',
          'Poseur de menuiseries',
          'Storiste (volets, protections solaires)',
        ],
      },
      {
        label: 'Ventilation',
        items: [
          'Installateur VMC (simple / double flux)',
          'Technicien qualité de l’air',
        ],
      },
    ],
  },
  {
    key: 'enr',
    label: 'Énergies renouvelables',
    icon: 'solar_power',
    groups: [
      {
        label: 'Photovoltaïque',
        items: [
          'Installateur panneaux solaires',
          'Électricien photovoltaïque',
          'Technicien raccordement ENEDIS',
          'Bureau d’étude solaire',
        ],
      },
      {
        label: 'Solaire thermique',
        items: [
          'Installateur chauffe-eau solaire',
          'Technicien systèmes solaires combinés',
        ],
      },
    ],
  },
  {
    key: 'electricite',
    label: 'Électricité / énergie',
    icon: 'bolt',
    groups: [
      {
        label: 'Électricité',
        items: [
          'Électricien bâtiment',
          'Technicien domotique',
          'Installateur bornes de recharge (IRVE)',
          'Technicien smart home / gestion énergie',
        ],
      },
    ],
  },
  {
    key: 'audit',
    label: 'Audit / étude / conseil',
    icon: 'analytics',
    groups: [
      {
        label: 'Études & diagnostic',
        items: [
          'Auditeur énergétique',
          'Diagnostiqueur immobilier (DPE)',
          'Thermicien',
          'Bureau d’études thermiques',
          'Conseiller rénovation (France Rénov’)',
        ],
      },
    ],
  },
  {
    key: 'encadrement',
    label: 'Encadrement / gestion de chantier',
    icon: 'engineering',
    groups: [
      {
        label: 'Encadrement',
        items: [
          'Conducteur de travaux',
          'Chef de chantier',
          'Maître d’œuvre',
          'Architecte spécialisé rénovation',
        ],
      },
    ],
  },
  {
    key: 'commercial',
    label: 'Commercial / business',
    icon: 'handshake',
    groups: [
      {
        label: 'Commercial',
        items: [
          'Commercial rénovation énergétique',
          'Apporteur d’affaires',
          'Téléprospecteur (call center)',
          'Setter / closer',
          'Responsable partenariat',
          'Mandataire énergie',
          'Courtier en travaux',
        ],
      },
    ],
  },
  {
    key: 'aides',
    label: 'Administratif / aides',
    icon: 'receipt_long',
    groups: [
      {
        label: 'Dossiers & subventions',
        items: [
          'Monteur de dossiers aides (MaPrimeRénov’)',
          'Gestionnaire CEE',
          'Assistant administratif rénovation',
          'Expert subventions',
          'AMO (Assistant à maîtrise d’ouvrage)',
        ],
      },
    ],
  },
  {
    key: 'fournisseurs',
    label: 'Fournisseurs / industrie',
    icon: 'factory',
    groups: [
      {
        label: 'Fournisseurs',
        items: [
          'Fabricant de PAC',
          'Fournisseur panneaux solaires',
          'Grossiste matériel (Rexel, Sonepar…)',
          'Plateforme logistique',
        ],
      },
    ],
  },
  {
    key: 'controle',
    label: 'Contrôle / certification',
    icon: 'verified',
    groups: [
      {
        label: 'Contrôle',
        items: [
          'Organisme RGE (Qualibat, Qualit’EnR)',
          'Bureau de contrôle',
          'Inspecteur conformité',
        ],
      },
    ],
  },
  {
    key: 'nouveaux',
    label: 'Nouveaux métiers',
    icon: 'trending_up',
    groups: [
      {
        label: 'En forte croissance',
        items: [
          'Expert rénovation globale',
          'Coordinateur énergétique',
          'Spécialiste autoconsommation',
          'Consultant optimisation énergétique',
          'Data énergie / suivi consommation',
        ],
      },
    ],
  },
];

export const ALL_SPECIALTIES: string[] = SPECIALTY_CATALOG.flatMap((cat) =>
  cat.groups.flatMap((g) => g.items)
);

export const FEATURED_SPECIALTIES = [
  { icon: 'solar_power', label: 'Photovoltaïque', match: 'Installateur panneaux solaires', color: 'text-brand bg-brand-soft' },
  { icon: 'heat_pump', label: 'Pompe à chaleur', match: 'Installateur pompe à chaleur (PAC)', color: 'text-verify bg-verify-soft' },
  { icon: 'roofing', label: 'Isolation', match: 'Isolateur thermique (combles, murs, sols)', color: 'text-ink bg-paper-tint' },
  { icon: 'bolt', label: 'Borne IRVE', match: 'Installateur bornes de recharge (IRVE)', color: 'text-brand bg-brand-soft' },
  { icon: 'handshake', label: 'Commercial rénovation', match: 'Commercial rénovation énergétique', color: 'text-star bg-[#fef3c7]' },
  { icon: 'receipt_long', label: 'Aides MaPrimeRénov’', match: 'Monteur de dossiers aides (MaPrimeRénov’)', color: 'text-verify bg-verify-soft' },
];
