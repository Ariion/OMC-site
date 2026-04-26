/* ═══════════════════════════════════════════════════
   OMC — GUIDE MÉDICAL v3.0
   Données complètes avec schémas anatomiques SVG
═══════════════════════════════════════════════════ */

// ── SVG Anatomiques ──────────────────────────────
const SVG = {

  // Schéma corps humain simplifié
  corps: `<svg viewBox="0 0 240 440" xmlns="http://www.w3.org/2000/svg" style="height:360px;">
    <defs>
      <radialGradient id="bg-g" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#1e3a5f" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#060d18" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="240" height="440" fill="url(#bg-g)" rx="12"/>
    <!-- Tête -->
    <ellipse cx="120" cy="38" rx="28" ry="34" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
    <!-- Cou -->
    <rect x="110" y="70" width="20" height="18" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.6"/>
    <!-- Tronc -->
    <path d="M75 88 L165 88 L170 210 L70 210 Z" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7"/>
    <!-- Colonne vertébrale -->
    <line x1="120" y1="88" x2="120" y2="210" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
    <!-- Clavicules -->
    <path d="M88 92 Q100 86 110 90" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.7"/>
    <path d="M152 92 Q140 86 130 90" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.7"/>
    <!-- Côtes -->
    <path d="M90 105 Q120 98 150 105" fill="none" stroke="#64748b" stroke-width="1" opacity="0.6"/>
    <path d="M88 118 Q120 111 152 118" fill="none" stroke="#64748b" stroke-width="1" opacity="0.6"/>
    <path d="M87 131 Q120 124 153 131" fill="none" stroke="#64748b" stroke-width="1" opacity="0.6"/>
    <path d="M87 144 Q120 137 153 144" fill="none" stroke="#64748b" stroke-width="1" opacity="0.6"/>
    <path d="M88 157 Q120 151 152 157" fill="none" stroke="#64748b" stroke-width="1" opacity="0.5"/>
    <!-- Sternum -->
    <rect x="114" y="90" width="12" height="70" rx="2" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.6"/>
    <!-- Coeur -->
    <path d="M107 115 Q107 108 114 108 Q120 108 120 115 Q120 108 126 108 Q133 108 133 115 Q133 125 120 135 Q107 125 107 115Z" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.2" opacity="0.8"/>
    <!-- Poumons -->
    <path d="M90 100 Q82 105 80 135 Q80 155 90 165 Q100 155 100 135 Q100 110 92 100Z" fill="rgba(56,189,248,0.1)" stroke="#7dd3fc" stroke-width="1" opacity="0.7"/>
    <path d="M150 100 Q158 105 160 135 Q160 155 150 165 Q140 155 140 135 Q140 110 148 100Z" fill="rgba(56,189,248,0.1)" stroke="#7dd3fc" stroke-width="1" opacity="0.7"/>
    <!-- Foie -->
    <ellipse cx="108" cy="180" rx="22" ry="14" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1" opacity="0.7"/>
    <!-- Estomac -->
    <ellipse cx="130" cy="183" rx="12" ry="10" fill="rgba(34,197,94,0.1)" stroke="#22c55e" stroke-width="1" opacity="0.6"/>
    <!-- Bras gauche -->
    <path d="M75 88 L55 88 L48 160 L62 160 L68 210" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
    <!-- Bras droit -->
    <path d="M165 88 L185 88 L192 160 L178 160 L172 210" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
    <!-- Mains -->
    <ellipse cx="55" cy="168" rx="8" ry="12" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.5"/>
    <ellipse cx="185" cy="168" rx="8" ry="12" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.5"/>
    <!-- Bassin -->
    <path d="M70 210 Q80 230 120 232 Q160 230 170 210" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity="0.7"/>
    <ellipse cx="120" cy="222" rx="30" ry="12" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.4"/>
    <!-- Jambe gauche -->
    <path d="M95 232 L88 320 L88 390" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
    <path d="M105 232 L100 320 L100 390" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.4"/>
    <!-- Jambe droite -->
    <path d="M145 232 L152 320 L152 390" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
    <path d="M135 232 L140 320 L140 390" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.4"/>
    <!-- Pieds -->
    <ellipse cx="94" cy="397" rx="12" ry="7" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.5"/>
    <ellipse cx="146" cy="397" rx="12" ry="7" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.5"/>
    <!-- Genoux -->
    <circle cx="94" cy="318" r="8" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.5"/>
    <circle cx="146" cy="318" r="8" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.5"/>
    <!-- Labels -->
    <text x="156" y="42" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" opacity="0.8" font-weight="700">CRÂNE</text>
    <line x1="148" y1="40" x2="148" y2="38" stroke="#7dd3fc" stroke-width="0.7" opacity="0.6"/>
    <text x="154" y="108" font-family="Rajdhani,sans-serif" font-size="9" fill="#fca5a5" opacity="0.9" font-weight="700">COEUR</text>
    <text x="54" y="128" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" opacity="0.8" font-weight="700">POUMONS</text>
    <text x="84" y="195" font-family="Rajdhani,sans-serif" font-size="9" fill="#fcd34d" opacity="0.8" font-weight="700">FOIE</text>
    <text x="130" y="202" font-family="Rajdhani,sans-serif" font-size="9" fill="#86efac" opacity="0.8" font-weight="700">ESTOMAC</text>
    <text x="128" y="238" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" opacity="0.7" font-weight="700">BASSIN</text>
  </svg>`,

  // Schéma squelette membres
  squelette_bras: `<svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg" style="height:260px;">
    <rect width="180" height="320" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Omoplate -->
    <path d="M60 20 L100 10 L115 50 L90 65 L60 60 Z" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Clavicule -->
    <path d="M40 25 Q70 18 100 25" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity="0.8"/>
    <!-- Humérus -->
    <rect x="82" y="65" width="16" height="100" rx="8" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Coude -->
    <circle cx="90" cy="172" r="10" fill="rgba(56,189,248,0.08)" stroke="#7dd3fc" stroke-width="1.2"/>
    <!-- Radius -->
    <path d="M84 182 Q78 240 76 270" fill="none" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Cubitus -->
    <path d="M96 182 Q102 240 104 270" fill="none" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Poignet -->
    <ellipse cx="90" cy="278" rx="16" ry="8" fill="rgba(56,189,248,0.08)" stroke="#7dd3fc" stroke-width="1.2"/>
    <!-- Phalanges -->
    <line x1="72" y1="286" x2="68" y2="310" stroke="#38bdf8" stroke-width="1" opacity="0.7"/>
    <line x1="80" y1="286" x2="78" y2="312" stroke="#38bdf8" stroke-width="1" opacity="0.7"/>
    <line x1="88" y1="286" x2="88" y2="314" stroke="#38bdf8" stroke-width="1" opacity="0.7"/>
    <line x1="96" y1="286" x2="98" y2="312" stroke="#38bdf8" stroke-width="1" opacity="0.7"/>
    <line x1="104" y1="286" x2="108" y2="308" stroke="#38bdf8" stroke-width="1" opacity="0.7"/>
    <!-- Labels -->
    <text x="118" y="30" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">CLAVICULE</text>
    <text x="118" y="50" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">OMOPLATE</text>
    <text x="4" y="120" font-family="Rajdhani,sans-serif" font-size="9" fill="#38bdf8" font-weight="700">HUMÉRUS</text>
    <text x="4" y="178" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">COUDE</text>
    <text x="110" y="220" font-family="Rajdhani,sans-serif" font-size="9" fill="#38bdf8" font-weight="700">RADIUS</text>
    <text x="8" y="240" font-family="Rajdhani,sans-serif" font-size="9" fill="#38bdf8" font-weight="700">CUBITUS</text>
    <text x="4" y="280" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">CARPES</text>
  </svg>`,

  squelette_jambe: `<svg viewBox="0 0 180 380" xmlns="http://www.w3.org/2000/svg" style="height:300px;">
    <rect width="180" height="380" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Os iliaque -->
    <path d="M50 10 Q60 5 120 8 Q140 10 145 35 Q130 50 110 48 L90 48 L70 48 Q55 48 50 35 Z" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Fémur -->
    <path d="M85 48 Q82 50 80 100 L80 180 Q80 185 90 185 Q100 185 100 180 L100 100 Q98 50 95 48Z" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Rotule -->
    <ellipse cx="90" cy="192" rx="12" ry="10" fill="rgba(125,211,252,0.15)" stroke="#7dd3fc" stroke-width="1.3"/>
    <!-- Tibia -->
    <path d="M83 202 Q82 270 82 310" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.8"/>
    <!-- Péroné -->
    <path d="M98 204 Q100 270 100 310" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.7"/>
    <!-- Cheville -->
    <ellipse cx="90" cy="318" rx="14" ry="8" fill="rgba(56,189,248,0.08)" stroke="#7dd3fc" stroke-width="1.2"/>
    <!-- Pied -->
    <path d="M76 326 Q70 340 65 360 Q80 365 90 362 Q100 365 115 360 Q110 340 104 326Z" fill="rgba(56,189,248,0.07)" stroke="#38bdf8" stroke-width="1.2" opacity="0.7"/>
    <!-- Labels -->
    <text x="4" y="28" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">OS ILIAQUE</text>
    <text x="4" y="120" font-family="Rajdhani,sans-serif" font-size="9" fill="#38bdf8" font-weight="700">FÉMUR</text>
    <text x="112" y="193" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">ROTULE</text>
    <text x="4" y="255" font-family="Rajdhani,sans-serif" font-size="9" fill="#38bdf8" font-weight="700">TIBIA</text>
    <text x="106" y="275" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">PÉRONÉ</text>
    <text x="4" y="355" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">TARSE / PIED</text>
  </svg>`,

  // Schéma cerveau
  cerveau: `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style="height:200px;">
    <rect width="300" height="220" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Fond cerveau -->
    <ellipse cx="150" cy="100" rx="110" ry="85" fill="rgba(167,139,250,0.06)" stroke="#a78bfa" stroke-width="1.5" opacity="0.7"/>
    <!-- Lobe frontal -->
    <path d="M60 95 Q60 50 100 40 Q130 35 145 55 Q120 60 105 80 Q90 95 85 105Z" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.3" opacity="0.8"/>
    <!-- Lobe pariétal -->
    <path d="M145 55 Q175 40 200 55 Q215 70 210 95 Q195 90 175 80 Q160 70 145 75Z" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.3" opacity="0.8"/>
    <!-- Lobe temporal -->
    <path d="M60 110 Q55 140 65 165 Q85 175 110 170 Q120 155 115 135 Q100 120 85 110Z" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="1.3" opacity="0.8"/>
    <!-- Lobe occipital -->
    <path d="M200 100 Q220 120 215 155 Q205 175 185 178 Q165 175 155 160 Q150 140 160 120 Q180 115 200 100Z" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1.3" opacity="0.8"/>
    <!-- Cervelet -->
    <ellipse cx="150" cy="180" rx="50" ry="28" fill="rgba(249,115,22,0.12)" stroke="#f97316" stroke-width="1.3" opacity="0.8"/>
    <!-- Tronc cérébral -->
    <rect x="135" y="155" width="30" height="45" rx="8" fill="rgba(244,114,182,0.12)" stroke="#f472b6" stroke-width="1.3" opacity="0.8"/>
    <!-- Sillons -->
    <path d="M90 70 Q110 65 130 72" fill="none" stroke="#a78bfa" stroke-width="0.7" opacity="0.5"/>
    <path d="M80 88 Q100 82 125 88" fill="none" stroke="#a78bfa" stroke-width="0.7" opacity="0.5"/>
    <path d="M170 62 Q190 68 205 78" fill="none" stroke="#a78bfa" stroke-width="0.7" opacity="0.5"/>
    <!-- Sillon central -->
    <path d="M145 55 Q140 80 135 110" fill="none" stroke="#c4b5fd" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7"/>
    <!-- Labels -->
    <text x="62" y="70" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">FRONTAL</text>
    <text x="178" y="56" font-family="Rajdhani,sans-serif" font-size="9" fill="#86efac" font-weight="700">PARIÉTAL</text>
    <text x="30" y="148" font-family="Rajdhani,sans-serif" font-size="9" fill="#fcd34d" font-weight="700">TEMPORAL</text>
    <text x="210" y="145" font-family="Rajdhani,sans-serif" font-size="9" fill="#fca5a5" font-weight="700">OCCIPITAL</text>
    <text x="118" y="185" font-family="Rajdhani,sans-serif" font-size="9" fill="#fdba74" font-weight="700">CERVELET</text>
    <text x="100" y="168" font-family="Rajdhani,sans-serif" font-size="9" fill="#f9a8d4" font-weight="700">TRONC</text>
  </svg>`,

  // Schéma coeur
  coeur: `<svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg" style="height:210px;">
    <rect width="260" height="240" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Aorte -->
    <path d="M115 45 Q100 20 80 15 Q60 12 55 30" fill="none" stroke="#ef4444" stroke-width="2.5" opacity="0.8"/>
    <path d="M115 45 Q130 10 160 15 Q185 18 190 40" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.7"/>
    <!-- Artère pulmonaire -->
    <path d="M120 60 Q110 35 95 30 Q80 28 75 42" fill="none" stroke="#7dd3fc" stroke-width="2" opacity="0.8"/>
    <!-- Veines cave -->
    <path d="M48 75 Q38 80 38 100" fill="none" stroke="#60a5fa" stroke-width="2.5" opacity="0.8"/>
    <path d="M48 155 Q38 150 38 135" fill="none" stroke="#60a5fa" stroke-width="2.5" opacity="0.8"/>
    <!-- Corps du coeur -->
    <path d="M48 75 Q38 70 42 55 Q50 40 68 42 Q85 44 90 60 Q95 45 108 42 Q125 38 133 55 Q140 68 135 85 Q140 100 138 120 Q130 155 100 180 Q88 190 80 185 Q65 178 55 165 Q42 145 44 125 Q46 105 48 75Z" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.5" opacity="0.9"/>
    <!-- Septum -->
    <path d="M90 60 Q88 100 85 155 Q82 175 82 185" fill="none" stroke="#fca5a5" stroke-width="1" stroke-dasharray="4,2" opacity="0.6"/>
    <!-- Oreillette gauche -->
    <path d="M130 75 Q145 65 165 70 Q180 78 178 95 Q175 110 160 115 Q145 115 135 105Z" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1.3" opacity="0.8"/>
    <!-- Oreillette droite -->
    <path d="M48 75 Q35 70 32 88 Q30 105 42 115 Q55 120 68 112Z" fill="rgba(96,165,250,0.12)" stroke="#60a5fa" stroke-width="1.3" opacity="0.8"/>
    <!-- Labels -->
    <text x="138" y="90" font-family="Rajdhani,sans-serif" font-size="9" fill="#fca5a5" font-weight="700">ORE. GAUCHE</text>
    <text x="6" y="97" font-family="Rajdhani,sans-serif" font-size="9" fill="#93c5fd" font-weight="700">ORE. DROITE</text>
    <text x="52" y="130" font-family="Rajdhani,sans-serif" font-size="9" fill="#93c5fd" font-weight="700">VENT. DROIT</text>
    <text x="92" y="148" font-family="Rajdhani,sans-serif" font-size="9" fill="#fca5a5" font-weight="700">VENT. GAUCHE</text>
    <text x="50" y="18" font-family="Rajdhani,sans-serif" font-size="9" fill="#ef4444" font-weight="700">AORTE</text>
    <text x="55" y="35" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">ART. PULM.</text>
    <text x="4" y="108" font-family="Rajdhani,sans-serif" font-size="9" fill="#93c5fd" font-weight="700">VEINE CAVE</text>
    <!-- Valves (pointillés) -->
    <ellipse cx="90" cy="90" rx="14" ry="8" fill="none" stroke="#fcd34d" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.7"/>
    <text x="98" y="88" font-family="Rajdhani,sans-serif" font-size="7" fill="#fcd34d" opacity="0.8">VALVE</text>
  </svg>`,

  // Schéma colonne vertébrale
  colonne: `<svg viewBox="0 0 180 360" xmlns="http://www.w3.org/2000/svg" style="height:300px;">
    <rect width="180" height="360" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Cervicales C1-C7 -->
    ${[...Array(7)].map((_, i) => `
    <rect x="65" y="${18 + i * 20}" width="50" height="16" rx="4"
      fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.2" opacity="0.8"/>
    <text x="72" y="${30 + i * 20}" font-family="Rajdhani,sans-serif" font-size="8" fill="#38bdf8" font-weight="700">C${i + 1}</text>
    ${i < 6 ? `<rect x="83" y="${34 + i * 20}" width="14" height="4" rx="2" fill="rgba(100,116,139,0.3)"/>` : ''}`).join('')}
    <!-- Dorsales D1-D12 -->
    ${[...Array(12)].map((_, i) => `
    <rect x="65" y="${168 + i * 13}" width="50" height="10" rx="3"
      fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="1" opacity="0.8"/>
    <text x="72" y="${177 + i * 13}" font-family="Rajdhani,sans-serif" font-size="7" fill="#f59e0b" font-weight="700">D${i + 1}</text>`).join('')}
    <!-- Lombaires L1-L5 -->
    ${[...Array(5)].map((_, i) => `
    <rect x="62" y="${336 + i * 14}" width="56" height="12" rx="3"
      fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.1" opacity="0.8"/>
    <text x="72" y="${346 + i * 14}" font-family="Rajdhani,sans-serif" font-size="8" fill="#22c55e" font-weight="700">L${i + 1}</text>`).join('')}
    <!-- Sacrum (position ajustée pour tenir dans le SVG) -->
    <rect x="60" y="408" width="60" height="28" rx="6" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1.2" opacity="0.8"/>
    <text x="74" y="426" font-family="Rajdhani,sans-serif" font-size="8" fill="#a78bfa" font-weight="700">SACRUM</text>
    <!-- Labels section -->
    <text x="4" y="30" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">CERV.</text>
    <text x="4" y="178" font-family="Rajdhani,sans-serif" font-size="9" fill="#fcd34d" font-weight="700">DORS.</text>
    <text x="4" y="344" font-family="Rajdhani,sans-serif" font-size="9" fill="#86efac" font-weight="700">LOMB.</text>
  </svg>`,

  // Schéma poumons
  poumons: `<svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" style="height:190px;">
    <rect width="260" height="220" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Trachée -->
    <rect x="122" y="10" width="16" height="50" rx="6" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.5" opacity="0.9"/>
    <!-- Bifurcation -->
    <path d="M122 58 Q90 65 75 80" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
    <path d="M138 58 Q170 65 185 80" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
    <!-- Bronches -->
    <path d="M75 80 Q65 90 68 110 Q70 130 75 140" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.7"/>
    <path d="M185 80 Q195 90 192 110 Q190 130 185 140" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.7"/>
    <!-- Poumon gauche -->
    <path d="M40 80 Q25 95 22 130 Q20 165 40 185 Q60 195 80 185 Q95 170 95 145 Q95 110 90 85 Q75 70 60 72 Q48 74 40 80Z" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
    <!-- Lobules gauches -->
    <path d="M40 80 Q55 100 60 130" fill="none" stroke="#7dd3fc" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
    <path d="M75 75 Q70 110 65 145" fill="none" stroke="#7dd3fc" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
    <!-- Poumon droit -->
    <path d="M220 80 Q235 95 238 130 Q240 165 220 185 Q200 195 180 185 Q165 170 165 145 Q165 110 170 85 Q185 70 200 72 Q212 74 220 80Z" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
    <!-- Lobules droits -->
    <path d="M220 80 Q205 100 200 130" fill="none" stroke="#7dd3fc" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
    <path d="M185 75 Q190 110 195 145" fill="none" stroke="#7dd3fc" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
    <!-- Plèvre (pointillés) -->
    <path d="M35 78 Q18 95 16 133 Q14 168 36 188 Q58 200 82 188 Q98 172 100 148" fill="none" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.5"/>
    <!-- Labels -->
    <text x="110" y="22" font-family="Rajdhani,sans-serif" font-size="9" fill="#7dd3fc" font-weight="700">TRACHÉE</text>
    <text x="28" y="135" font-family="Rajdhani,sans-serif" font-size="10" fill="#38bdf8" font-weight="700">GAUCHE</text>
    <text x="194" y="135" font-family="Rajdhani,sans-serif" font-size="10" fill="#38bdf8" font-weight="700">DROIT</text>
    <text x="2" y="200" font-family="Rajdhani,sans-serif" font-size="8" fill="#fcd34d" opacity="0.8" font-weight="700">PLÈVRE</text>
    <text x="100" y="75" font-family="Rajdhani,sans-serif" font-size="8" fill="#7dd3fc" font-weight="700">BRONCHES</text>
  </svg>`,

  // Schéma circulation sanguine
  circulation: `<svg viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg" style="height:210px;">
    <rect width="280" height="240" fill="rgba(10,22,40,0.5)" rx="10"/>
    <!-- Coeur centre -->
    <ellipse cx="140" cy="110" rx="30" ry="35" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.8" opacity="0.9"/>
    <text x="124" y="105" font-family="Rajdhani,sans-serif" font-size="9" fill="#fca5a5" font-weight="700">COEUR</text>
    <!-- Artères (rouge) = départ du coeur -->
    <!-- Aorte montante -->
    <path d="M140 75 L140 20 Q140 10 130 10 L100 10" fill="none" stroke="#ef4444" stroke-width="2.5" opacity="0.8"/>
    <!-- Artère vers poumons -->
    <path d="M125 95 Q90 80 65 85 Q50 90 48 110" fill="none" stroke="#7dd3fc" stroke-width="2" opacity="0.8"/>
    <!-- Artère descendante (aorte) -->
    <path d="M140 145 Q140 175 140 210" fill="none" stroke="#ef4444" stroke-width="2.5" opacity="0.8"/>
    <!-- Branches artérielles -->
    <path d="M140 170 Q110 175 85 180 Q70 185 65 195" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.7"/>
    <path d="M140 170 Q165 175 190 180 Q205 185 208 195" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.7"/>
    <!-- Veines cave (bleues) = retour vers le coeur -->
    <path d="M155 95 Q200 75 220 85 Q240 95 238 115 Q235 135 220 140 Q200 145 165 140" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.8"/>
    <!-- Veine cave inférieure -->
    <path d="M155 130 Q155 165 155 210" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.8"/>
    <!-- Capillaires -->
    <circle cx="100" cy="10" r="3" fill="#ef4444" opacity="0.7"/>
    <circle cx="65" cy="195" r="3" fill="#ef4444" opacity="0.7"/>
    <circle cx="208" cy="195" r="3" fill="#ef4444" opacity="0.7"/>
    <circle cx="48" cy="130" r="3" fill="#7dd3fc" opacity="0.7"/>
    <circle cx="238" cy="115" r="3" fill="#60a5fa" opacity="0.7"/>
    <!-- Flèches direction -->
    <polygon points="140,12 136,22 144,22" fill="#ef4444" opacity="0.8"/>
    <polygon points="140,208 136,198 144,198" fill="#60a5fa" opacity="0.8"/>
    <!-- Poumons -->
    <ellipse cx="55" cy="108" rx="22" ry="28" fill="rgba(56,189,248,0.08)" stroke="#7dd3fc" stroke-width="1" opacity="0.7"/>
    <text x="34" y="112" font-family="Rajdhani,sans-serif" font-size="8" fill="#7dd3fc" font-weight="700">POUMONS</text>
    <!-- Organes -->
    <ellipse cx="230" cy="115" rx="25" ry="30" fill="rgba(34,197,94,0.08)" stroke="#22c55e" stroke-width="1" opacity="0.6"/>
    <text x="215" y="118" font-family="Rajdhani,sans-serif" font-size="7" fill="#86efac" font-weight="700">ORGANES</text>
    <!-- Légende -->
    <rect x="10" y="210" width="10" height="4" fill="#ef4444" opacity="0.8" rx="2"/>
    <text x="23" y="215" font-family="Rajdhani,sans-serif" font-size="8" fill="#fca5a5" font-weight="700">ARTÈRES (O₂)</text>
    <rect x="10" y="222" width="10" height="4" fill="#60a5fa" opacity="0.8" rx="2"/>
    <text x="23" y="227" font-family="Rajdhani,sans-serif" font-size="8" fill="#93c5fd" font-weight="700">VEINES (CO₂)</text>
    <rect x="10" y="234" width="10" height="4" fill="#7dd3fc" opacity="0.8" rx="2"/>
    <text x="23" y="239" font-family="Rajdhani,sans-serif" font-size="8" fill="#7dd3fc" font-weight="700">CIRC. PULMONAIRE</text>
  </svg>`,

  // Schéma ECG simplifié
  ecg: `<svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" style="height:90px;">
    <rect width="300" height="100" fill="rgba(10,22,40,0.8)" rx="8"/>
    <!-- Grille -->
    ${[...Array(6)].map((_, i) => `<line x1="0" y1="${i*20}" x2="300" y2="${i*20}" stroke="#1e3a5f" stroke-width="0.5" opacity="0.5"/>`).join('')}
    ${[...Array(16)].map((_, i) => `<line x1="${i*20}" y1="0" x2="${i*20}" y2="100" stroke="#1e3a5f" stroke-width="0.5" opacity="0.5"/>`).join('')}
    <!-- Trace ECG normal -->
    <polyline points="0,50 20,50 25,45 30,50 35,50 38,48 42,30 46,65 50,50 55,50 65,50 68,48 72,30 76,65 80,50 85,50 95,50 98,48 102,30 106,65 110,50 115,50 125,50 128,48 132,30 136,65 140,50 145,50 155,50 158,48 162,30 166,65 170,50 175,50 185,50 188,48 192,30 196,65 200,50 205,50 215,50 218,48 222,30 226,65 230,50 235,50 245,50 248,48 252,30 256,65 260,50 265,50 280,50"
      fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.9"/>
    <!-- Labels -->
    <text x="8" y="12" font-family="Rajdhani,sans-serif" font-size="8" fill="#22c55e" font-weight="700" opacity="0.8">ECG NORMAL — SINUSAL</text>
    <text x="200" y="12" font-family="Rajdhani,sans-serif" font-size="8" fill="#64748b" font-weight="700">72 bpm</text>
    <!-- Ondes labels -->
    <text x="28" y="44" font-family="Rajdhani,sans-serif" font-size="7" fill="#7dd3fc" opacity="0.7">P</text>
    <text x="43" y="28" font-family="Rajdhani,sans-serif" font-size="7" fill="#fca5a5" opacity="0.8">R</text>
    <text x="51" y="72" font-family="Rajdhani,sans-serif" font-size="7" fill="#fcd34d" opacity="0.7">S</text>
  </svg>`,
};

// ══════════════════════════════════════════════════
// BASE DE DONNÉES MÉDICALE COMPLÈTE
// ══════════════════════════════════════════════════
const DATA = [

  // ─── ANATOMIE ───────────────────────────────────

  {
    id: "anat-corps", title: "Corps Humain — Vue d'ensemble",
    cat: "anatomie", tags: ["anatomie", "référence"],
    dot: "dot-blue", tagColors: ["ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Schéma général</div>
        <div class="anatomy-figure">
          ${SVG.corps}
          <figcaption>Vue Antérieure — Corps Humain OMC</figcaption>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Grandes régions anatomiques</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Céphalique & Cervicale</h5>
            <ul>
              <li>Crâne (8 os) + Face (14 os)</li>
              <li>Cerveau, Tronc cérébral, Cervelet</li>
              <li>Cou : trachée, oesophage, carotides</li>
            </ul>
            <h5>Thoracique</h5>
            <ul>
              <li>Cage : sternum + 12 paires de côtes</li>
              <li>Coeur, Poumons, Oesophage, Aorte</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Abdominale & Pelvienne</h5>
            <ul>
              <li>Foie, Rate, Pancréas, Estomac</li>
              <li>Intestin grêle + Gros intestin</li>
              <li>Reins, Uretères, Vessie</li>
            </ul>
            <h5>Membres</h5>
            <ul>
              <li>Supérieurs : épaule → doigts</li>
              <li>Inférieurs : hanche → orteils</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },

  {
    id: "anat-squelette", title: "Squelette — Os & Classification",
    cat: "anatomie", tags: ["anatomie", "os"],
    dot: "dot-blue", tagColors: ["ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Membres supérieurs & inférieurs</div>
        <div class="anatomy-grid">
          <div class="anatomy-figure">
            ${SVG.squelette_bras}
            <figcaption>Membre Supérieur</figcaption>
          </div>
          <div class="anatomy-figure">
            ${SVG.squelette_jambe}
            <figcaption>Membre Inférieur</figcaption>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Classification des os</div>
        <table class="dt">
          <thead><tr><th>Type</th><th>Exemples</th><th>Rôle</th></tr></thead>
          <tbody>
            <tr><td><strong>Os plats</strong></td><td>Crâne, sternum, omoplates, iliaque, rotule</td><td>Protection des organes</td></tr>
            <tr><td><strong>Os longs</strong></td><td>Humérus, radius, cubitus, fémur, tibia, péroné</td><td>Levier pour le mouvement</td></tr>
            <tr><td><strong>Os courts</strong></td><td>Vertèbres, carpes, tarses, phalanges</td><td>Amortissement, précision</td></tr>
            <tr><td><strong>Os sésamoïdes</strong></td><td>Rotule, os sésamoïdes du pied</td><td>Protection des tendons</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Fractures — Classification</div>
        <table class="dt">
          <thead><tr><th>Type</th><th>Description</th><th>CAT</th></tr></thead>
          <tbody>
            <tr><td><strong>Fermée simple</strong></td><td>Os cassé, peau intacte</td><td>Réduction + Attelle/Résine</td></tr>
            <tr><td><strong>Fermée déplacée</strong></td><td>Fragments décalés</td><td>Réduction en traction + Immobilisation</td></tr>
            <tr><td><strong>Ouverte</strong></td><td>Os sort à travers la peau</td><td>Lavage + Ostéosynthèse chirurgicale</td></tr>
            <tr><td><strong>Comminutive</strong></td><td>Multiples fragments</td><td>Chirurgie reconstruction</td></tr>
            <tr><td><strong>En bois vert</strong></td><td>Fracture incomplète (enfant)</td><td>Attelle simple</td></tr>
          </tbody>
        </table>
        <div class="ibox info">⚠️ Après toute réduction → vérifier <strong>pouls distal</strong> (artère non pincée) et <strong>sensibilité</strong> (nerf non lésé).</div>
      </div>
    `
  },

  {
    id: "anat-colonne", title: "Colonne Vertébrale",
    cat: "anatomie", tags: ["anatomie", "vertèbres"],
    dot: "dot-blue", tagColors: ["ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Schéma rachis complet</div>
        <div class="anatomy-grid single">
          <div class="anatomy-figure">
            ${SVG.colonne}
            <figcaption>Colonne Vertébrale — Vue Latérale</figcaption>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Segments</div>
        <table class="dt">
          <thead><tr><th>Segment</th><th>Nb</th><th>Code</th><th>Pathologie</th></tr></thead>
          <tbody>
            <tr><td><strong>Cervicales</strong></td><td>7</td><td>C1 (Atlas) → C7</td><td>Cervicalgie, torticolis, fracture Atlas</td></tr>
            <tr><td><strong>Dorsales</strong></td><td>12</td><td>D1 → D12</td><td>Dorsalgie, fracture tassement</td></tr>
            <tr><td><strong>Lombaires</strong></td><td>5</td><td>L1 → L5</td><td>Lombalgie, hernie discale, sciatique</td></tr>
            <tr><td><strong>Sacrées</strong></td><td>5 (fusionnées)</td><td>Sacrum</td><td>Fractures pelviennes</td></tr>
            <tr><td><strong>Coccygiennes</strong></td><td>3–5</td><td>Coccyx</td><td>Coccydynie</td></tr>
          </tbody>
        </table>
        <div class="ibox danger">🚨 Tout AVP ou chute importante → <strong>collier cervical + matelas coquille</strong> systématique. Ne jamais mobiliser sans immobilisation préalable.</div>
      </div>
    `
  },

  {
    id: "anat-cerveau", title: "Cerveau — Anatomie & Lobes",
    cat: "anatomie", tags: ["anatomie", "neurologie"],
    dot: "dot-purple", tagColors: ["ct-purple"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Schéma cérébral</div>
        <div class="anatomy-figure">
          ${SVG.cerveau}
          <figcaption>Lobes cérébraux — Vue Latérale Gauche</figcaption>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Fonctions par lobe</div>
        <table class="dt">
          <thead><tr><th>Structure</th><th>Fonctions principales</th><th>Lésion → Déficit</th></tr></thead>
          <tbody>
            <tr><td><strong>Lobe Frontal</strong></td><td>Pensée, planification, motricité volontaire, personnalité</td><td>Paralysie motrice, aphasie de Broca</td></tr>
            <tr><td><strong>Lobe Pariétal</strong></td><td>Sensibilité, toucher, orientation spatiale</td><td>Perte de sensibilité, apraxie</td></tr>
            <tr><td><strong>Lobe Occipital</strong></td><td>Vision, reconnaissance visuelle</td><td>Cécité corticale, agnosie visuelle</td></tr>
            <tr><td><strong>Lobe Temporal</strong></td><td>Audition, mémoire, reconnaissance des visages</td><td>Aphasie de Wernicke, amnésie</td></tr>
            <tr><td><strong>Cervelet</strong></td><td>Coordination, équilibre, précision des gestes</td><td>Ataxie, instabilité</td></tr>
            <tr><td><strong>Tronc cérébral</strong></td><td>Respiration, rythme cardiaque, éveil</td><td>Coma, mort cérébrale</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Hématomes intracrâniens</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Types</h5>
            <ul>
              <li><strong>Extra-dural</strong> : entre os du crâne et dure-mère. Artère méningée. Urgence.</li>
              <li><strong>Sous-dural</strong> : entre dure-mère et arachnoïde. Veine corticale.</li>
              <li><strong>Intra-cérébral</strong> : dans le parenchyme. AVC hémorragique.</li>
              <li><strong>Sous-arachnoïdien</strong> : entre arachnoïde et pie-mère.</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Signes d'alarme</h5>
            <ul>
              <li>Céphalée brutale intense ("coup de tonnerre")</li>
              <li>Perte de conscience</li>
              <li>Trouble du langage, asymétrie faciale</li>
              <li>Anisocorie (pupilles asymétriques)</li>
              <li>Vomissements en jet</li>
            </ul>
            <div class="ibox danger">🚨 Scanner cérébral en urgence absolue.</div>
          </div>
        </div>
      </div>
    `
  },

  {
    id: "anat-coeur", title: "Coeur — Anatomie Cardiaque",
    cat: "anatomie", tags: ["anatomie", "cardiologie"],
    dot: "dot-red", tagColors: ["ct-red"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Schéma cardiaque</div>
        <div class="anatomy-figure">
          ${SVG.coeur}
          <figcaption>Coeur — Vue Antérieure (coupes)</figcaption>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Structure</div>
        <div class="two-col">
          <div class="col-b">
            <h5>4 Cavités</h5>
            <ul>
              <li><strong>Oreillette droite</strong> : reçoit le sang veineux (veine cave)</li>
              <li><strong>Ventricule droit</strong> : propulse vers les poumons</li>
              <li><strong>Oreillette gauche</strong> : reçoit le sang oxygéné (veines pulmonaires)</li>
              <li><strong>Ventricule gauche</strong> : propulse vers le corps (aorte)</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>4 Valves</h5>
            <ul>
              <li><strong>Tricuspide</strong> : OD → VD</li>
              <li><strong>Pulmonaire</strong> : VD → artère pulmonaire</li>
              <li><strong>Mitrale (bicuspide)</strong> : OG → VG</li>
              <li><strong>Aortique</strong> : VG → aorte</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Tracé ECG normal</div>
        ${SVG.ecg}
        <table class="dt" style="margin-top:10px;">
          <thead><tr><th>Onde</th><th>Correspond à</th></tr></thead>
          <tbody>
            <tr><td><strong>Onde P</strong></td><td>Dépolarisation des oreillettes</td></tr>
            <tr><td><strong>Complexe QRS</strong></td><td>Dépolarisation ventriculaire (contraction)</td></tr>
            <tr><td><strong>Onde T</strong></td><td>Repolarisation ventriculaire</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  {
    id: "anat-poumons", title: "Poumons — Anatomie Respiratoire",
    cat: "anatomie", tags: ["anatomie", "urgence"],
    dot: "dot-blue", tagColors: ["ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Schéma pulmonaire</div>
        <div class="anatomy-figure">
          ${SVG.poumons}
          <figcaption>Poumons — Vue Antérieure avec Trachée & Bronches</figcaption>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Structure</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Poumon Gauche</h5>
            <ul>
              <li>2 lobes (sup. + inf.)</li>
              <li>Lobule lingulaire</li>
              <li>Entouré de la plèvre gauche</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Poumon Droit</h5>
            <ul>
              <li>3 lobes (sup. + moy. + inf.)</li>
              <li>Plus volumineux</li>
              <li>Entouré de la plèvre droite</li>
            </ul>
          </div>
        </div>
        <div class="ibox info">Voies respiratoires : Nez/Bouche → Pharynx → Larynx → Trachée → Bronches souches → Bronchioles → Alvéoles (échanges O₂/CO₂).</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Pathologies critiques</div>
        <table class="dt">
          <thead><tr><th>Pathologie</th><th>Mécanisme</th><th>CAT immédiate</th></tr></thead>
          <tbody>
            <tr><td><strong>Pneumothorax</strong></td><td>Air dans espace pleural → collapsus pulmonaire</td><td>Drainage thoracique à l'aiguille</td></tr>
            <tr><td><strong>Hémothorax</strong></td><td>Sang dans la plèvre</td><td>Drainage + transfusion si besoin</td></tr>
            <tr><td><strong>Embolie pulmonaire</strong></td><td>Caillot dans artère pulmonaire</td><td>Anticoagulants + fibrinolytiques</td></tr>
            <tr><td><strong>SDRA</strong></td><td>Syndrome de détresse respiratoire aiguë</td><td>Intubation + ventilation protectrice</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  {
    id: "anat-circulation", title: "Circulation Sanguine — Artères & Veines",
    cat: "anatomie", tags: ["anatomie", "hématologie"],
    dot: "dot-red", tagColors: ["ct-red", "ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Schéma circulatoire</div>
        <div class="anatomy-figure">
          ${SVG.circulation}
          <figcaption>Double Circulation — Schéma Simplifié</figcaption>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Principales artères & veines</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Artères principales</h5>
            <ul>
              <li>Aorte (arc + desc.)</li>
              <li>Carotide primitive</li>
              <li>Sous-clavière / Axillaire / Brachiale</li>
              <li>Radiale / Cubitale</li>
              <li>Mésentérique sup.</li>
              <li>Rénale</li>
              <li>Iliaque / Fémorale / Tibiale</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Grandes veines</h5>
            <ul>
              <li>Veine cave sup. / inf.</li>
              <li>Jugulaire int. / ext.</li>
              <li>Sous-clavière / Axillaire</li>
              <li>Céphalique / Basilique</li>
              <li>Porte (foie)</li>
              <li>Rénale</li>
              <li>Saphène / Fémorale</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },

  // ─── CARDIOLOGIE ────────────────────────────────

  {
    id: "cardio-idm", title: "Infarctus du Myocarde (IDM)",
    cat: "cardiologie", tags: ["urgence vitale", "cardiologie"],
    dot: "dot-red", tagColors: ["ct-danger", "ct-red"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Définition</div>
        <p>Nécrose d'une zone du myocarde due à l'occlusion d'une artère coronaire par un thrombus. Chaque minute perdue = des cellules cardiaques détruites définitivement.</p>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Signes cliniques</div>
        <div class="pill-grid">
          <span class="pill">Douleur thoracique intense</span>
          <span class="pill">Irradiation bras gauche</span>
          <span class="pill">Irradiation mâchoire</span>
          <span class="pill">Douleur dorsale</span>
          <span class="pill">Sueurs froides</span>
          <span class="pill">Pâleur</span>
          <span class="pill">Nausées</span>
          <span class="pill">Anxiété</span>
          <span class="pill">Dyspnée</span>
        </div>
        <div class="ibox danger">🚨 IDM silencieux possible (diabétiques, femmes) : dyspnée + fatigue inexpliquée sans douleur typique.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Protocole OMC</div>
        <ol class="steps">
          <li>Position demi-assise, repos strict</li>
          <li>Oxygène nasal 3–5 L/min</li>
          <li>Monitoring scopique continu : ECG + TA + SpO₂</li>
          <li>Pose VVP (18G minimum) + Garde-veine G5%</li>
          <li>Prélèvement sanguin : <strong>Troponine en priorité</strong>, NFS, TP/INR, D-Dimères</li>
          <li>Troponine positive → <strong>Fibrinolytique IV en urgence</strong></li>
          <li>Transfert vers salle de cathétérisme / chirurgie cardiaque</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">ECG en IDM</div>
        ${SVG.ecg}
        <p style="margin-top:8px;">Signes ECG : sus-décalage du segment ST (courant de lésion), onde Q de nécrose, troubles du rythme.</p>
      </div>
    `
  },

  {
    id: "cardio-rcp", title: "Réanimation Cardio-Pulmonaire (RCP)",
    cat: "cardiologie", tags: ["urgence vitale", "protocole"],
    dot: "dot-red", tagColors: ["ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Indications</div>
        <p>Arrêt cardio-respiratoire (ACR) : absence de pouls + absence de respiration normale. Délai critique : <strong>chaque minute sans RCP = 10% de chances de survie en moins.</strong></p>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Protocole RCP Avancé OMC</div>
        <ol class="steps">
          <li>Allonger sur surface dure. Alerter l'équipe + appeler défibrillateur.</li>
          <li>Vérifier absence de pouls carotidien (10 secondes max).</li>
          <li>Débuter massage cardiaque externe (MCE) : 30 compressions / 2 insufflations.</li>
          <li>Poser 2 VVP de gros calibre (16–18G) dès que possible.</li>
          <li>Scopage patient : identifier le rythme (FV, TV, asystolie, AESP).</li>
          <li>Choc électrique si FV/TV sans pouls → 200J biphasique.</li>
          <li>Adrénaline 1mg IV toutes les 3–5 min.</li>
          <li>Intubation endotrachéale + ventilation mécanique 10/min.</li>
          <li>Canule de Guedel si non intubé pour maintien des VA.</li>
        </ol>
        <div class="ibox danger">🔴 Ne JAMAIS interrompre le MCE plus de 10 secondes. Rotation des intervenants toutes les 2 minutes.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Médicaments cardiotoniques</div>
        <table class="dt">
          <thead><tr><th>Médicament</th><th>Indication</th><th>Dose</th></tr></thead>
          <tbody>
            <tr><td><strong>Adrénaline</strong></td><td>Asystolie, FV réfractaire</td><td>1mg IV / 3–5 min</td></tr>
            <tr><td><strong>Amiodarone</strong></td><td>FV/TV après 3 chocs</td><td>300mg IV bolus</td></tr>
            <tr><td><strong>Atropine</strong></td><td>Bradycardie severe, asystolie</td><td>0.5mg IV</td></tr>
            <tr><td><strong>Bicarbonate Na</strong></td><td>Acidose sévère</td><td>1mEq/kg IV</td></tr>
            <tr><td><strong>Sulfate Mg</strong></td><td>Torsades de pointes, hypomagnésémie</td><td>2g IV en 10 min</td></tr>
            <tr><td><strong>Noradrénaline</strong></td><td>Choc vasoplégique post-ACR</td><td>Perfusion titrée</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  {
    id: "cardio-thrombose", title: "Thrombose — Phlébite & Embolie",
    cat: "cardiologie", tags: ["urgence", "hématologie"],
    dot: "dot-red", tagColors: ["ct-red", "ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Types de thrombose</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Veineuse (Phlébite/TVP)</h5>
            <ul>
              <li>Localisation : veines profondes (jambe +++)</li>
              <li>Causes : alitement, cancer, contraceptif, chirurgie</li>
              <li>Signes : douleur mollet, œdème, rougeur, chaleur, signe de Homans +</li>
              <li>Complication : <strong>Embolie pulmonaire mortelle</strong></li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Artérielle</h5>
            <ul>
              <li>Localisation : artères coronaires, cérébrales, périphériques</li>
              <li>Causes : athérosclérose, FA, HTA</li>
              <li>Signes : douleur aiguë, ischémie d'aval</li>
              <li>→ IDM (coronaire), AVC (cérébrale), ischémie membre</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Diagnostics biologiques</div>
        <div class="pill-grid">
          <span class="pill">D-Dimères ↑</span>
          <span class="pill">Écho-Doppler veineux</span>
          <span class="pill">Angioscan pulmonaire</span>
          <span class="pill">TP/INR</span>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Traitements</div>
        <table class="dt">
          <thead><tr><th>Situation</th><th>Traitement</th></tr></thead>
          <tbody>
            <tr><td>TVP confirmée</td><td>Héparine IV + relais anticoagulant oral 3–6 mois</td></tr>
            <tr><td>Embolie pulmonaire massive</td><td>Fibrinolytique (Alteplase) en urgence + Héparine</td></tr>
            <tr><td>AVC ischémique ≤ 4h30</td><td>Thrombolyse IV (Alteplase) ± Thromboectomie ≤ 6h</td></tr>
            <tr><td>IDM ST+ ≤ 12h</td><td>Angioplastie primaire OU fibrinolyse si délai imposé</td></tr>
          </tbody>
        </table>
        <div class="ibox danger">🚨 AVC : <strong>Time is brain</strong> — chaque minute = 1,9 million de neurones perdus. Thromboectomie dans les 6h.</div>
      </div>
    `
  },

  // ─── HÉMATOLOGIE ─────────────────────────────────

  {
    id: "hema-sang", title: "Le Sang — Composition & Groupes",
    cat: "hematologie", tags: ["hématologie", "référence"],
    dot: "dot-red", tagColors: ["ct-red"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Composition du sang</div>
        <table class="dt">
          <thead><tr><th>Composant</th><th>Nom scientifique</th><th>Rôle</th><th>Volume</th></tr></thead>
          <tbody>
            <tr><td><strong>Plasma</strong></td><td>—</td><td>Transport (protéines, albumine, immunoglobulines, facteurs de coagulation)</td><td>55%</td></tr>
            <tr><td><strong>Globules Rouges</strong></td><td>Érythrocytes / Hématies</td><td>Transport O₂/CO₂ via hémoglobine. Détermine les groupes ABO et Rhésus.</td><td>44%</td></tr>
            <tr><td><strong>Globules Blancs</strong></td><td>Leucocytes</td><td>Défense immunitaire, production d'anticorps. Normes : 4 000–10 000/mm³.</td><td rowspan="2">1%</td></tr>
            <tr><td><strong>Plaquettes</strong></td><td>Thrombocytes</td><td>Hémostase primaire, coagulation, cicatrisation des plaies</td></tr>
          </tbody>
        </table>
        <div class="ibox info">Volume sanguin adulte : <strong>4,5 à 6 litres</strong>. Perte &gt; 30% → choc hémorragique. Remplissage Ringer Lactate + transfusion.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Groupes sanguins & compatibilité</div>
        <table class="dt">
          <thead><tr><th>Groupe</th><th>Antigènes GR</th><th>Anticorps plasma</th><th>Peut recevoir de</th><th>Peut donner à</th></tr></thead>
          <tbody>
            <tr><td><strong>A</strong></td><td>A</td><td>Anti-B</td><td>A, O</td><td>A, AB</td></tr>
            <tr><td><strong>B</strong></td><td>B</td><td>Anti-A</td><td>B, O</td><td>B, AB</td></tr>
            <tr><td><strong>AB</strong></td><td>A + B</td><td>—</td><td>A, B, AB, O ✅</td><td>AB</td></tr>
            <tr><td><strong>O</strong></td><td>—</td><td>Anti-A + Anti-B</td><td>O</td><td>A, B, AB, O ✅</td></tr>
          </tbody>
        </table>
        <div class="ibox warning">⚠️ O négatif = donneur universel. En urgence hémorragique sans groupage → O négatif. AB positif = receveur universel (plasma).</div>
      </div>
    `
  },

  {
    id: "hema-anemie", title: "Anémie — Déficit Hémoglobine",
    cat: "hematologie", tags: ["hématologie", "fréquent"],
    dot: "dot-red", tagColors: ["ct-red", "ct-amber"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Définition & Seuils</div>
        <p>Diminution du taux d'hémoglobine circulante en dessous des valeurs normales, entraînant une hypoxie tissulaire.</p>
        <table class="dt">
          <thead><tr><th>Population</th><th>Seuil Hb (g/dL)</th><th>Transfusion si</th></tr></thead>
          <tbody>
            <tr><td>Homme adulte</td><td>&lt; 13 g/dL</td><td rowspan="4">&lt; 7–8 g/dL (selon tolérance)</td></tr>
            <tr><td>Femme adulte</td><td>&lt; 12 g/dL</td></tr>
            <tr><td>Femme enceinte</td><td>&lt; 10,5 g/dL</td></tr>
            <tr><td>Nouveau-né</td><td>&lt; 14 g/dL</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Étiologies</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Anémies Centrales</h5>
            <ul>
              <li>Carence en Fer (ferriprive — la + fréquente)</li>
              <li>Carence B12 (Biermer / maladie auto-immune)</li>
              <li>Carence B9 (folates)</li>
              <li>Aplasie médullaire</li>
              <li>Anémie rénale (déficit EPO)</li>
              <li>Envahissement médullaire (leucémie)</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Anémies Périphériques</h5>
            <ul>
              <li>Hémorragie aiguë ou chronique</li>
              <li>Hémolyse (destruction GR)</li>
              <li>Drépanocytose (génétique — GR en faucille)</li>
              <li>Thalassémie (génétique — déficit globine)</li>
              <li>Anémie hémolytique auto-immune (AHAI)</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Symptômes & Prise en charge</div>
        <div class="pill-grid">
          <span class="pill">Fatigue extrême</span><span class="pill">Vertiges</span>
          <span class="pill">Pâleur cutanée et muqueuses</span><span class="pill">Tachycardie</span>
          <span class="pill">Essoufflement à l'effort</span><span class="pill">Céphalées</span>
          <span class="pill">Extrémités froides</span><span class="pill">Ongles cassants</span>
        </div>
        <ol class="steps">
          <li>NFS (Hémogramme) : taux Hb + VGM</li>
          <li>Si VGM abaissé (microcytaire) → Bilan Fer, ferritine</li>
          <li>Si VGM élevé (macrocytaire) → Bilan B12, folates</li>
          <li>Si Hb &lt; 7 g/dL ou mal tolérée → <strong>Transfusion CGR en urgence</strong></li>
          <li>Traitement étiologique : Fer PO/IV, B12 IM, folates, EPO</li>
        </ol>
      </div>
    `
  },

  {
    id: "hema-leucemie", title: "Leucémie — Cancer du Sang",
    cat: "hematologie", tags: ["hématologie", "oncologie"],
    dot: "dot-red", tagColors: ["ct-red", "ct-purple"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Définition</div>
        <p>Cancer hématologique caractérisé par la prolifération incontrôlée de cellules immatures (blastes) dans la moelle osseuse, envahissant le sang et parfois les organes.</p>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Classification</div>
        <table class="dt">
          <thead><tr><th>Type</th><th>Description</th><th>Évolution</th></tr></thead>
          <tbody>
            <tr><td><strong>LAL (Lymphoblastique Aiguë)</strong></td><td>Enfant +++ . Lymphocytes immatures</td><td>Rapide, urgente. Bonne réponse chimo.</td></tr>
            <tr><td><strong>LAM (Myéloïde Aiguë)</strong></td><td>Adulte. Granulocytes/monocytes immatures</td><td>Rapide, pronostic variable</td></tr>
            <tr><td><strong>LLC (Lymphoïde Chronique)</strong></td><td>Sujet âgé. Lymphocytes matures</td><td>Lente, souvent asymptomatique</td></tr>
            <tr><td><strong>LMC (Myéloïde Chronique)</strong></td><td>Chr. Philadelphie. Granulocytes</td><td>Phases chronique → accélérée → blastique</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Signes cliniques</div>
        <div class="pill-grid">
          <span class="pill">Fatigue intense</span><span class="pill">Fièvre inexpliquée</span>
          <span class="pill">Infections répétées</span><span class="pill">Hémorragies spontanées</span>
          <span class="pill">Ganglions volumineux</span><span class="pill">Rate élargie</span>
          <span class="pill">Douleurs osseuses</span><span class="pill">Pâleur</span>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Traitements</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Traitements</h5>
            <ul>
              <li>Chimiothérapie intensive</li>
              <li>Immunothérapie (anticorps monoclonaux)</li>
              <li>Thérapie ciblée (Imatinib pour LMC)</li>
              <li>Greffe de cellules souches hématopoïétiques</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Surveillance</h5>
            <ul>
              <li>NFS hebdomadaire pendant traitement</li>
              <li>Myélogramme pour évaluation réponse</li>
              <li>Chambre stérile si neutropénie sévère</li>
              <li>Suivi 5 ans post-rémission</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },

  {
    id: "hema-sepsis", title: "Septicémie & Choc Septique",
    cat: "hematologie", tags: ["urgence vitale", "infectiologie"],
    dot: "dot-red", tagColors: ["ct-danger", "ct-teal"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Définitions (critères Sepsis-3)</div>
        <table class="dt">
          <thead><tr><th>Entité</th><th>Définition</th><th>Mortalité</th></tr></thead>
          <tbody>
            <tr><td><strong>Infection</strong></td><td>Présence d'un agent infectieux + réponse de l'hôte</td><td>Faible</td></tr>
            <tr><td><strong>Sepsis</strong></td><td>Dysfonction d'organe menaçant le pronostic vital (score SOFA ≥ 2)</td><td>10–20%</td></tr>
            <tr><td><strong>Choc septique</strong></td><td>Sepsis + hypotension résistante au remplissage + lactate &gt; 2 mmol/L</td><td>30–50%</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Critères SIRS</div>
        <div class="pill-grid">
          <span class="pill">Température &gt; 38.3°C ou &lt; 36°C</span>
          <span class="pill">FC &gt; 90 bpm</span>
          <span class="pill">FR &gt; 20/min</span>
          <span class="pill">Leucocytes &gt; 12 000 ou &lt; 4 000/mm³</span>
          <span class="pill">Lactates ↑</span>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Protocole SEPSIS BUNDLE (1h)</div>
        <ol class="steps">
          <li>Mesure des <strong>lactates sanguins</strong></li>
          <li><strong>Hémocultures ×2</strong> AVANT antibiothérapie (ne pas retarder pour ça)</li>
          <li>Antibiothérapie IV large spectre <strong>dans la 1ère heure</strong></li>
          <li>Remplissage vasculaire : <strong>Ringer Lactate 30 ml/kg</strong> en 3h si hypotension</li>
          <li>Noradrénaline si choc : TA moyenne ≥ 65 mmHg</li>
          <li>Monitoring : SvO₂, diurèse (sonde vésicale), lactates de contrôle</li>
        </ol>
        <div class="ibox danger">🚨 Chaque heure de retard à l'antibiothérapie = augmentation de 7% de la mortalité.</div>
      </div>
    `
  },

  // ─── INFECTIOLOGIE ─────────────────────────────

  {
    id: "infecto-overview", title: "Infectiologie — Vue d'ensemble",
    cat: "infectiologie", tags: ["infectiologie", "référence"],
    dot: "dot-teal", tagColors: ["ct-teal"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">4 sous-disciplines</div>
        <table class="dt">
          <thead><tr><th>Discipline</th><th>Agent pathogène</th><th>Exemples OMC</th></tr></thead>
          <tbody>
            <tr><td><strong>Virologie</strong></td><td>Virus</td><td>VIH, Hépatites B/C, Herpès, Zona, Grippe, Covid-19</td></tr>
            <tr><td><strong>Bactériologie</strong></td><td>Bactéries</td><td>Pneumonie, Méningite, Septicémie, Pyélonéphrite, Choléra</td></tr>
            <tr><td><strong>Mycologie</strong></td><td>Champignons</td><td>Candidose, Aspergillose, Mucormycose</td></tr>
            <tr><td><strong>Parasitologie</strong></td><td>Parasites</td><td>Paludisme, Malaria, Maladie de Lyme, Ténia</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Chaîne de l'infection</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Éléments nécessaires</h5>
            <ul>
              <li>Agent infectieux (virulence, pathogénicité)</li>
              <li>Réservoir (humain, animal, environnement)</li>
              <li>Mode de transmission (contact, gouttelettes, air, sang)</li>
              <li>Porte d'entrée (peau lésée, muqueuses, tube digestif)</li>
              <li>Hôte réceptif (immunodéprimé +++)</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Prévention OMC</h5>
            <ul>
              <li>Hygiène des mains (SHA — lavage 30s minimum)</li>
              <li>Équipements de protection (gants, masque FFP2, lunettes)</li>
              <li>Isolement protecteur ou contact selon pathologie</li>
              <li>Antibiothérapie prophylactique si indiquée</li>
              <li>Vaccination du personnel (Hépatite B, grippe, DTP)</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Infections nosocomiales OMC</div>
        <div class="ibox warning">⚠️ Infection contractée à l'hôpital. Germes résistants fréquents (BMR : SARM, BLSE). Déclaration obligatoire. Enquête épidémiologique systématique.</div>
      </div>
    `
  },

  {
    id: "infecto-bacterio", title: "Bactériologie & Antibiogramme",
    cat: "infectiologie", tags: ["infectiologie", "antibiotiques"],
    dot: "dot-teal", tagColors: ["ct-teal", "ct-amber"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Étapes du diagnostic bactériologique</div>
        <ol class="steps">
          <li>Prélèvement : hémocultures, ECBU, LCR, expectorations, pus (AVANT antibiothérapie !)</li>
          <li>Mise en culture sur milieux adaptés (24–72h)</li>
          <li>Identification de la bactérie (morphologie, biochimie, MALDI-TOF)</li>
          <li>Antibiogramme : tester la sensibilité aux antibiotiques disponibles</li>
          <li>Adapter l'antibiothérapie selon les résultats</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Principales bactéries & antibiotiques</div>
        <table class="dt">
          <thead><tr><th>Bactérie</th><th>Pathologie</th><th>Antibiothérapie 1ère ligne</th></tr></thead>
          <tbody>
            <tr><td><strong>Streptococcus pneumoniae</strong></td><td>Pneumonie, méningite</td><td>Amoxicilline, C3G (céfotaxime)</td></tr>
            <tr><td><strong>E. coli</strong></td><td>Pyélonéphrite, septicémie</td><td>C3G, fluoroquinolones</td></tr>
            <tr><td><strong>Staphylococcus aureus</strong></td><td>Abcès, ostéite, endocardite</td><td>Cloxacilline (si sensible), vancomycine (SARM)</td></tr>
            <tr><td><strong>Mycobacterium tuberculosis</strong></td><td>Tuberculose</td><td>RHZE (4 antibiotiques 6 mois)</td></tr>
            <tr><td><strong>Clostridium difficile</strong></td><td>Diarrhée post-antibio</td><td>Métronidazole / Vancomycine PO</td></tr>
          </tbody>
        </table>
        <div class="ibox danger">🔴 Résistances : SARM (staph. résistant méticilline), BHRe, BLSE. Usage raisonné des antibiotiques obligatoire pour éviter la résistance.</div>
      </div>
    `
  },

  {
    id: "infecto-meningite", title: "Méningite Bactérienne",
    cat: "infectiologie", tags: ["urgence vitale", "infectiologie", "neurologie"],
    dot: "dot-teal", tagColors: ["ct-danger", "ct-teal"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Triade méningée classique</div>
        <div class="pill-grid">
          <span class="pill">Fièvre élevée</span>
          <span class="pill">Céphalée intense</span>
          <span class="pill">Raideur de nuque</span>
        </div>
        <p style="margin-top:10px;">+ Photophobie, phonophobie, vomissements en jet, signe de Kernig, signe de Brudzinski.</p>
        <div class="ibox danger">🚨 Purpura fulminans (taches pourpres non effaçables) = méningocoque → <strong>Ceftriaxone IV/IM immédiat sans attendre la PL</strong>. Urgence absolue.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Protocole OMC</div>
        <ol class="steps">
          <li>Si purpura → Ceftriaxone 2g IV <strong>immédiatement</strong> (sans attendre bilan)</li>
          <li>Scanner cérébral si déficit neurologique avant PL</li>
          <li>Ponction lombaire (PL) : LCR trouble, hyperprotéinorachie, hypoglycorachie, cellules ↑</li>
          <li>Hémocultures ×2 avant antibiothérapie si possible</li>
          <li>Corticothérapie : Dexaméthasone 0.15 mg/kg/6h × 4j (si pneumocoque)</li>
          <li>Isolement gouttelettes 24h après antibiothérapie efficace</li>
          <li>Prophylaxie entourage (Rifampicine 2j si méningocoque)</li>
        </ol>
      </div>
    `
  },

  // ─── NEUROLOGIE ──────────────────────────────────

  {
    id: "neuro-avc", title: "AVC — Accident Vasculaire Cérébral",
    cat: "neurologie", tags: ["urgence vitale", "neurologie"],
    dot: "dot-purple", tagColors: ["ct-danger", "ct-purple"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Types d'AVC</div>
        <div class="two-col">
          <div class="col-b">
            <h5>AVC Ischémique (80%)</h5>
            <ul>
              <li>Occlusion artérielle (caillot)</li>
              <li>Thrombose cérébrale ou embolie (FA, cardiopathie)</li>
              <li>Traitement : thrombolyse ≤ 4h30 + thromboectomie ≤ 6h</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>AVC Hémorragique (20%)</h5>
            <ul>
              <li>Rupture artérielle (HTA +++)</li>
              <li>Anévrisme rompu (hémorragie sous-arachnoïdienne)</li>
              <li>Contre-indication à la thrombolyse !</li>
              <li>Traitement : neurochirurgie si indiqué</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Score FAST — Reconnaissance rapide</div>
        <div class="highlight-box">
          <h5>F.A.S.T.</h5>
          <ul>
            <li><strong>F</strong>ace : asymétrie faciale, déviation commissure</li>
            <li><strong>A</strong>rm : faiblesse d'un bras, chute de bras</li>
            <li><strong>S</strong>peech : trouble de parole, aphasie, dysarthrie</li>
            <li><strong>T</strong>ime : chaque minute compte — appel urgences immédiat</li>
          </ul>
        </div>
        <div class="ibox danger">🚨 <strong>Time is brain</strong> : 1,9 million neurones détruits par minute. Thromboectomie mécanique ≤ 6h → 65% de réduction des séquelles.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Protocole OMC</div>
        <ol class="steps">
          <li>Bilan neurologique rapide : FAST, conscience (Glasgow), pupilles</li>
          <li>Glucométrie (éliminer hypoglycémie mimant AVC)</li>
          <li>TA (NE PAS traiter une HTA élevée sauf si &gt; 220/120)</li>
          <li>Scanner cérébral sans injection en urgence</li>
          <li>Si ischémique ≤ 4h30 et pas de contre-indication → Alteplase 0.9 mg/kg IV</li>
          <li>Avis neurochirurgie si hémorragique</li>
          <li>Scope + VVP + Sérum physiologique (ne pas perfuser de G5%)</li>
        </ol>
      </div>
    `
  },

  {
    id: "neuro-coma", title: "Glasgow & Évaluation Neurologique",
    cat: "neurologie", tags: ["neurologie", "protocole"],
    dot: "dot-purple", tagColors: ["ct-purple", "ct-amber"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Score de Glasgow (GCS)</div>
        <table class="dt">
          <thead><tr><th>Composante</th><th>Réponse</th><th>Score</th></tr></thead>
          <tbody>
            <tr><td rowspan="4"><strong>Ouverture des Yeux (Y)</strong></td><td>Spontanée</td><td>4</td></tr>
            <tr><td>Au bruit</td><td>3</td></tr>
            <tr><td>À la douleur</td><td>2</td></tr>
            <tr><td>Nulle</td><td>1</td></tr>
            <tr><td rowspan="5"><strong>Réponse Verbale (V)</strong></td><td>Orientée</td><td>5</td></tr>
            <tr><td>Confuse</td><td>4</td></tr>
            <tr><td>Mots</td><td>3</td></tr>
            <tr><td>Sons</td><td>2</td></tr>
            <tr><td>Nulle</td><td>1</td></tr>
            <tr><td rowspan="6"><strong>Réponse Motrice (M)</strong></td><td>Obéit</td><td>6</td></tr>
            <tr><td>Orientée (localise)</td><td>5</td></tr>
            <tr><td>Évitement (retrait)</td><td>4</td></tr>
            <tr><td>Flexion anormale</td><td>3</td></tr>
            <tr><td>Extension (décérébration)</td><td>2</td></tr>
            <tr><td>Nulle</td><td>1</td></tr>
          </tbody>
        </table>
        <div class="ibox warning">GCS ≤ 8 = <strong>intubation requise</strong> (protection des voies aériennes). GCS = 3 = coma profond.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Réactivité pupillaire</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Myosis (pupille petite)</h5>
            <ul>
              <li>Réactivité normale (réflexe photomoteur présent)</li>
              <li>Intoxication opiacés / morphine</li>
              <li>Lésion protubérantielle</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Mydriase (pupille grande)</h5>
            <ul>
              <li>Atteinte neurologique grave</li>
              <li>Engagement temporal</li>
              <li>Mort cérébrale si <strong>bilatérale aréactive</strong></li>
              <li>Atropine, cocaïne</li>
            </ul>
          </div>
        </div>
        <div class="ibox danger">🚨 Anisocorie (pupilles asymétriques) = compression du nerf III par engagement temporal → Scanner urgent.</div>
      </div>
    `
  },

  {
    id: "neuro-epilepsie", title: "Épilepsie & État de Mal",
    cat: "neurologie", tags: ["neurologie", "urgence"],
    dot: "dot-purple", tagColors: ["ct-purple", "ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Types de crises</div>
        <table class="dt">
          <thead><tr><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>Tonico-clonique (grand mal)</strong></td><td>Phase tonique (rigidité) + phase clonique (convulsions) + phase postcritique</td></tr>
            <tr><td><strong>Absence (petit mal)</strong></td><td>Rupture brève du contact, regard fixe, pas de chute. Enfant +++</td></tr>
            <tr><td><strong>Partielle simple</strong></td><td>Un membre ou une zone. Conscience conservée</td></tr>
            <tr><td><strong>Partielle complexe</strong></td><td>Automatismes, conscience altérée</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Conduite à tenir</div>
        <ol class="steps">
          <li>Protéger la tête, ne rien mettre dans la bouche, ne pas retenir les mouvements</li>
          <li>Chronométrer la crise</li>
          <li>Position latérale de sécurité (PLS) en phase postcritique</li>
          <li>Oxygène nasal</li>
          <li>Si crise &gt; 5 min → <strong>État de mal épileptique</strong> : Diazépam 10mg IV ou Clonazépam 1mg IV</li>
          <li>Si résistant → Phénytoine / Keppra IV</li>
          <li>EEG + bilan biologique (glycémie, ionogramme, NFS)</li>
        </ol>
        <div class="ibox danger">🚨 État de mal épileptique (&gt; 30 min ou crises répétées sans récupération) = urgence neurologique absolue → risque de lésions cérébrales irréversibles.</div>
      </div>
    `
  },

  // ─── CHIRURGIE ───────────────────────────────────

  {
    id: "chir-asepsie", title: "Asepsie & Protocole Chirurgical",
    cat: "chirurgie", tags: ["chirurgie", "protocole"],
    dot: "dot-amber", tagColors: ["ct-amber", "ct-green"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Mise en condition</div>
        <ol class="steps">
          <li>Transfert synchronisé brancard → table d'opération. Découpe immédiate des vêtements.</li>
          <li>Branchement moniteur : électrodes ECG + brassard TA + capteur SpO₂.</li>
          <li>Pose VVP (18G minimum) + perfusion NaCl (Sérum physiologique).</li>
          <li>Lecture et annonce des constantes : Pouls, TA, SpO₂, FR.</li>
          <li>Analgésie systématique avant tout geste douloureux.</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Asepsie chirurgicale — Règle absolue</div>
        <div class="ibox danger">🔴 <strong>RÈGLE ABSOLUE</strong> : Après lavage, mains maintenues au-dessus de la taille et sous les épaules. Tout contact non stérile = recommencer le lavage complet.</div>
        <ol class="steps">
          <li>Lavage chirurgical mains + avant-bras jusqu'aux coudes — Bétadine rouge moussante (5 min).</li>
          <li>Rinçage mains orientées vers le HAUT (eau sale coule vers les coudes).</li>
          <li>Séchage stérile + habillage casaque stérile aidé par l'assistant.</li>
          <li>Gants stériles (méthode fermée).</li>
          <li>Badigeon zone opératoire : Bétadine jaune (du centre vers la périphérie).</li>
          <li>Installation des champs stériles autour de la zone opératoire.</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Anesthésie</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Locale</h5>
            <ul>
              <li>Agent : Xylocaïne (lidocaïne)</li>
              <li>Injection en périphérie de la lésion</li>
              <li>Patient conscient → maintenir contact verbal</li>
              <li>Doses max : 3–5 mg/kg</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Générale</h5>
            <ul>
              <li>Induction : Propofol + Fentanyl ± Kétamine</li>
              <li>Curare si intubation difficile</li>
              <li>Intubation oro-trachéale + respirateur</li>
              <li>Protection oculaire (cornées)</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },

  {
    id: "chir-trauma", title: "Traumatologie — 4 Cas Cliniques",
    cat: "chirurgie", tags: ["chirurgie", "urgence", "trauma"],
    dot: "dot-amber", tagColors: ["ct-amber", "ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Cas 1 — Fracture Fermée Déplacée</div>
        <ol class="steps">
          <li>Palpation prudente, évaluation de la déformation</li>
          <li>Réduction : traction dans l'axe + coup sec + contre-poids</li>
          <li>Vérification impérative : pouls distal + sensibilité distale</li>
          <li>Immobilisation : attelle → résine/plâtre après 48h (désenflement)</li>
          <li>Radiographies contrôle post-réduction</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Cas 2 — Fracture Ouverte</div>
        <ol class="steps">
          <li>Lavage abondant haute pression sérum bétadiné (élimination corps étrangers)</li>
          <li>Parage chirurgical (excision tissus nécrosés)</li>
          <li>Ostéosynthèse : plaques titane + vis + fixateur externe si contamination</li>
          <li>Fermeture musculaire. Peau : pansement gras ou drain (prévention abcès)</li>
          <li>Antibioprophylaxie systématique (Amoxicilline-clavulanate)</li>
          <li>Vaccination antitétanique vérifier</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Cas 3 — Plaie par Arme Blanche (PAB)</div>
        <ol class="steps">
          <li>Écarteurs pour ouvrir le champ visuel</li>
          <li>Aspiration continue du sang (localisation source hémorragique)</li>
          <li>Hémostase : compresses + bistouri électrique (vaisseaux)</li>
          <li>Suture plan par plan : muscles → fascia → tissu sous-cutané → peau</li>
          <li>Drain si risque de collection</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Cas 4 — Hémorragie Interne</div>
        <ol class="steps">
          <li>Transfusion massive O négatif si chute TA rapide</li>
          <li>Laparotomie exploraire d'urgence (large incision médiane)</li>
          <li>Packing hémostatique (champs compressifs)</li>
          <li>Identification artère lésée → clamp vasculaire + ligature définitive</li>
          <li>Damage control si instable : fermeture temporaire, réanimation, reprendre à 48h</li>
        </ol>
        <div class="ibox danger">🚨 Triade létale : Hypothermie + Acidose + Coagulopathie. Prévenir par chauffage patient, transfusion de produits frais congelés et plasma.</div>
      </div>
    `
  },

  {
    id: "chir-postop", title: "Post-Opératoire & Complications",
    cat: "chirurgie", tags: ["chirurgie", "protocole"],
    dot: "dot-amber", tagColors: ["ct-amber", "ct-green"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Protocole de sortie de bloc</div>
        <ol class="steps">
          <li>Nettoyage plaie + résidus Bétadine péri-lésionnels</li>
          <li>Pansement stérile compressif adapté</li>
          <li>Retrait équipements souillés (casaque, gants) → DASRI</li>
          <li>Extubation si ventilation spontanée efficace (VT &gt; 5mL/kg, FR &lt; 20)</li>
          <li>Transfert délicat (technique de glissement) vers lit de réveil</li>
          <li><strong>Rebranchement immédiat</strong> moniteur mural (scope, TA, SpO₂)</li>
          <li>Rédaction Compte-Rendu Opératoire (CRO) complet</li>
        </ol>
        <div class="ibox danger">🔴 Ne jamais laisser un patient post-opératoire non monitoré, même brièvement.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Complications post-opératoires à surveiller</div>
        <table class="dt">
          <thead><tr><th>Complication</th><th>Délai</th><th>Signes</th><th>CAT</th></tr></thead>
          <tbody>
            <tr><td><strong>Hémorragie</strong></td><td>H0–H24</td><td>TA ↓, FC ↑, pansement saturé</td><td>Compression + reprise chirurgie</td></tr>
            <tr><td><strong>Hématome</strong></td><td>H12–48</td><td>Gonflement, douleur, ecchymose</td><td>Drainage si compressif</td></tr>
            <tr><td><strong>Infection/Abcès</strong></td><td>J5–J10</td><td>Fièvre, rougeur, pus, chaleur locale</td><td>Ouverture + drainage + ATB</td></tr>
            <tr><td><strong>Déhiscence</strong></td><td>J5–J15</td><td>Ouverture cicatrice</td><td>Resuture si aseptique</td></tr>
            <tr><td><strong>TVP/Embolie</strong></td><td>J2–J14</td><td>Douleur mollet, dyspnée</td><td>Héparine + Écho-Doppler</td></tr>
            <tr><td><strong>Iléus</strong></td><td>J1–J4</td><td>Pas de transit, distension</td><td>Repos digestif + kiné</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  // ─── PROTOCOLES ──────────────────────────────────

  {
    id: "proto-bilans", title: "Bilans Biologiques — Guide complet",
    cat: "protocole", tags: ["protocole", "référence", "biologie"],
    dot: "dot-green", tagColors: ["ct-green", "ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Marqueurs sanguins essentiels</div>
        <table class="dt">
          <thead><tr><th>Marqueur</th><th>Recherche</th><th>Valeurs normales</th></tr></thead>
          <tbody>
            <tr><td><strong>Troponine I/T</strong></td><td>Nécrose myocardique (IDM)</td><td>&lt; 0.04 ng/mL</td></tr>
            <tr><td><strong>D-Dimères</strong></td><td>Phlébite, embolie pulmonaire</td><td>&lt; 0.5 mg/L</td></tr>
            <tr><td><strong>CRP</strong></td><td>Inflammation systémique, infection</td><td>&lt; 5 mg/L</td></tr>
            <tr><td><strong>PCT (Procalcitonine)</strong></td><td>Sepsis bactérien (spécifique ++)</td><td>&lt; 0.1 ng/mL</td></tr>
            <tr><td><strong>Lactates</strong></td><td>Hypoperfusion tissulaire (choc)</td><td>&lt; 2 mmol/L</td></tr>
            <tr><td><strong>TP / INR</strong></td><td>Coagulation (INR &gt; 3 = risque hémorragique)</td><td>TP &gt; 70% / INR ≈ 1</td></tr>
            <tr><td><strong>NFS — Hb</strong></td><td>Anémie</td><td>H: 13-17 g/dL / F: 12-16 g/dL</td></tr>
            <tr><td><strong>NFS — Plaquettes</strong></td><td>Thrombopénie / thrombocytose</td><td>150 000 – 400 000/mm³</td></tr>
            <tr><td><strong>NFS — GB</strong></td><td>Infection si ↑, immunodépression si ↓</td><td>4 000 – 10 000/mm³</td></tr>
            <tr><td><strong>Créatinine / Urée</strong></td><td>Insuffisance rénale</td><td>Créat : 60–110 µmol/L</td></tr>
            <tr><td><strong>Glycémie</strong></td><td>Diabète, hypoglycémie</td><td>0.7–1.1 g/L à jeun</td></tr>
            <tr><td><strong>Ionogramme</strong></td><td>Na, K, Ca, Mg, Cl, Bicarbonates</td><td>Na: 135-145 / K: 3.5-5 mEq/L</td></tr>
            <tr><td><strong>Gaz du sang (ABG)</strong></td><td>pH, PaO2, PaCO2, HCO3 (ponction radiale)</td><td>pH 7.35–7.45 / PaO₂ &gt; 80 mmHg</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Autres prélèvements</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Microbiologie</h5>
            <ul>
              <li>Hémocultures ×2 (AVANT ATB)</li>
              <li>ECBU (urines stériles)</li>
              <li>Coproculture (selles)</li>
              <li>LCR si méningite</li>
              <li>Prélèvement de gorge / nasopharynx</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Imagerie complémentaire</h5>
            <ul>
              <li>Radio pulmonaire</li>
              <li>Écho abdominale</li>
              <li>Écho-Doppler (caillots)</li>
              <li>ECG 12 dérivations</li>
              <li>Scanner / IRM si indication</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },

  {
    id: "proto-pmv", title: "Plan Multiples Victimes (PMV)",
    cat: "protocole", tags: ["protocole", "urgence vitale", "commandement"],
    dot: "dot-green", tagColors: ["ct-danger", "ct-amber"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Définition & Déclenchement</div>
        <div class="ibox warning">⚠️ PMV = situation avec <strong>minimum 4 victimes simultanées</strong>. Contextes : fusillades, explosions, attentats, accidents de la route majeurs.</div>
        <ol class="steps">
          <li>Décréter la situation PMV + appeler <strong>immédiatement</strong> un haut gradé (chef d'équipe)</li>
          <li>En attendant : tour de toutes les victimes, gestes d'urgence vitaux</li>
          <li>À l'arrivée du haut gradé : obéissance stricte, plus de décision autonome</li>
          <li>Triage des victimes (voir catégories START)</li>
          <li>Limiter usage radio au maximum</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Triage START</div>
        <table class="dt">
          <thead><tr><th>Catégorie</th><th>Code</th><th>Description</th><th>Priorité</th></tr></thead>
          <tbody>
            <tr><td><strong>Décédé / Agonie</strong></td><td style="color:#64748b;">⬛ NOIR</td><td>Sans vie ou décès inévitable</td><td>0 — ne pas mobiliser ressources</td></tr>
            <tr><td><strong>Urgence absolue</strong></td><td style="color:#ef4444;">🔴 ROUGE</td><td>Pronostic vital immédiat engagé</td><td>1 — prise en charge immédiate</td></tr>
            <tr><td><strong>Urgence relative</strong></td><td style="color:#f59e0b;">🟡 JAUNE</td><td>Peut attendre 1–2h</td><td>2 — délai court acceptable</td></tr>
            <tr><td><strong>Non urgent</strong></td><td style="color:#22c55e;">🟢 VERT</td><td>Blessure légère, autonome</td><td>3 — dernière priorité</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  {
    id: "proto-solutés", title: "Solutés, Perfusion & Voies Veineuses",
    cat: "protocole", tags: ["protocole", "pharmacologie"],
    dot: "dot-green", tagColors: ["ct-green", "ct-orange"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Solutés courants</div>
        <table class="dt">
          <thead><tr><th>Soluté</th><th>Composition</th><th>Indication</th></tr></thead>
          <tbody>
            <tr><td><strong>NaCl 0.9% (Sérum physio)</strong></td><td>9g NaCl/L</td><td>Garde-veine, lavage, dilution médicaments, remplissage d'urgence</td></tr>
            <tr><td><strong>Glucose 5% (G5%)</strong></td><td>50g glucose/L</td><td>Apport calorique, hypoglycémie, garde-veine pour médicaments incompatibles avec NaCl</td></tr>
            <tr><td><strong>Ringer Lactate</strong></td><td>Na, K, Ca, Cl, Lactate</td><td>Remplissage vasculaire (hémorragie, déshydratation, brûlures)</td></tr>
            <tr><td><strong>Albumine 4%</strong></td><td>Albumine humaine</td><td>Hypoalbuminémie, remplissage (cirrhose, sepsis)</td></tr>
            <tr><td><strong>Gélatines/HEA</strong></td><td>Colloïdes</td><td>Remplissage (usage limité aux situations d'urgence)</td></tr>
          </tbody>
        </table>
        <div class="ibox info">Choix du calibre VVP : <strong>18G (vert)</strong> ou <strong>16G (gris)</strong> pour urgences. Plus gros calibre = débit plus rapide.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Voies d'abord vasculaires</div>
        <div class="two-col">
          <div class="col-b">
            <h5>VVP (Voie Veineuse Périphérique)</h5>
            <ul>
              <li>Sites : pli du coude, avant-bras, dos de la main</li>
              <li>À éviter : MI (thrombose), bras parétique, côté mastectomie</li>
              <li>Asepsie : SHA + compresse alcoolisée + garrot</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>VVC (Voie Veineuse Centrale)</h5>
            <ul>
              <li>Sites : jugulaire int., sous-clavière, fémoral</li>
              <li>Indications : drogues vasoactives, nutrition parentérale, mesure PVC</li>
              <li>Pose sous écho-guidage recommandée</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },

  // ─── PHARMACOLOGIE ───────────────────────────────

  {
    id: "pharma-urgence", title: "Pharmacologie — Médicaments d'Urgence",
    cat: "pharmacologie", tags: ["pharmacologie", "urgence"],
    dot: "dot-orange", tagColors: ["ct-orange", "ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Médicaments vitaux</div>
        <table class="dt">
          <thead><tr><th>Médicament</th><th>Classe</th><th>Indication</th><th>Voie</th></tr></thead>
          <tbody>
            <tr><td><strong>Adrénaline</strong></td><td>Catécholamine</td><td>ACR, choc anaphylactique, bradycardie sévère</td><td>IV, IM (anaphylaxie)</td></tr>
            <tr><td><strong>Noradrénaline</strong></td><td>Vasoconstricteur</td><td>Choc septique, vasoplégie</td><td>IV (seringue électrique)</td></tr>
            <tr><td><strong>Atropine</strong></td><td>Anticholinergique</td><td>Bradycardie, asystolie</td><td>IV rapide</td></tr>
            <tr><td><strong>Naloxone</strong></td><td>Antagoniste opiacés</td><td>Surdosage morphine/opiacés</td><td>IV, IM, nasal</td></tr>
            <tr><td><strong>Alteplase (tPA)</strong></td><td>Fibrinolytique</td><td>AVC ischémique, IDM, EP massive</td><td>IV (bolus + perfusion)</td></tr>
            <tr><td><strong>Héparine</strong></td><td>Anticoagulant</td><td>TVP, EP, IDM, FA</td><td>IV (HBPM = SC)</td></tr>
            <tr><td><strong>Amiodarone</strong></td><td>Antiarythmique</td><td>FV, TV, FA</td><td>IV lent (150mg/10min)</td></tr>
            <tr><td><strong>Diazépam/Clonazépam</strong></td><td>Benzodiazépine</td><td>Convulsions, état de mal</td><td>IV, IM, rectal</td></tr>
            <tr><td><strong>Propofol</strong></td><td>Hypnotique</td><td>Induction anesthésie générale</td><td>IV titré</td></tr>
            <tr><td><strong>Fentanyl</strong></td><td>Opiacé fort</td><td>Analgésie chirurgicale, AG</td><td>IV, nasal</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Antidotes essentiels</div>
        <table class="dt">
          <thead><tr><th>Toxique</th><th>Antidote</th></tr></thead>
          <tbody>
            <tr><td>Opiacés / Morphine / Héroïne</td><td><strong>Naloxone</strong> 0.4–2 mg IV/IM</td></tr>
            <tr><td>Benzodiazépines</td><td><strong>Flumazénil</strong> 0.2 mg IV</td></tr>
            <tr><td>Monoxyde de carbone</td><td><strong>Oxygène pur 100%</strong> (masque haute concentration)</td></tr>
            <tr><td>Organophosphorés (pesticides)</td><td><strong>Atropine</strong> + Pralidoxime</td></tr>
            <tr><td>Paracétamol</td><td><strong>N-acétylcystéine (NAC)</strong> IV</td></tr>
            <tr><td>AVK (surdosage anticoagulants)</td><td><strong>Vitamine K</strong> + PPSB (CCP) si hémorragie grave</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  {
    id: "pharma-courant", title: "Médicaments Courants par Symptôme",
    cat: "pharmacologie", tags: ["pharmacologie", "référence"],
    dot: "dot-orange", tagColors: ["ct-orange"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Catalogue thérapeutique OMC</div>
        <table class="dt">
          <thead><tr><th>Symptôme / Indication</th><th>Médicament</th><th>Classe</th></tr></thead>
          <tbody>
            <tr><td>Douleur légère</td><td><strong>Paracétamol</strong> 1g</td><td>Antalgique palier 1</td></tr>
            <tr><td>Douleur modérée</td><td><strong>Tramadol / Codéine</strong></td><td>Antalgique palier 2</td></tr>
            <tr><td>Douleur intense</td><td><strong>Morphine</strong> IV titrée</td><td>Opiacé fort palier 3</td></tr>
            <tr><td>Soin douloureux (amnésie)</td><td><strong>Hypnovel</strong> (midazolam)</td><td>Benzodiazépine</td></tr>
            <tr><td>Sédation légère</td><td><strong>MEOPA / Kalinox</strong></td><td>N₂O + O₂ 50/50</td></tr>
            <tr><td>Vomissements</td><td><strong>Primpéran</strong> (métoclopramide)</td><td>Anti-émétique</td></tr>
            <tr><td>Diarrhées</td><td><strong>Imodium</strong> (lopéramide)</td><td>Anti-diarrhéique</td></tr>
            <tr><td>Constipation</td><td><strong>Duphalac / Movicol</strong></td><td>Laxatif osmotique</td></tr>
            <tr><td>Spasmes digestifs</td><td><strong>Spasfon / Débridat</strong></td><td>Antispasmodique</td></tr>
            <tr><td>Réaction allergique légère</td><td><strong>Cetirizine / Loratadine</strong></td><td>Antihistaminique H1</td></tr>
            <tr><td>Choc anaphylactique</td><td><strong>Adrénaline</strong> 0.5mg IM</td><td>Catécholamine</td></tr>
            <tr><td>Inflammation</td><td><strong>Ibuprofène / Kétoprofène</strong></td><td>AINS</td></tr>
            <tr><td>Oedème cérébral</td><td><strong>Mannitol 20%</strong> IV</td><td>Diurétique osmotique</td></tr>
            <tr><td>Hypoglycémie</td><td><strong>G30%</strong> IV + G10% entretien</td><td>Glucose hypertonique</td></tr>
            <tr><td>Hyperglycémie / Diabète</td><td><strong>Insuline rapide</strong></td><td>Hypoglycémiant</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  // ─── URGENCE ─────────────────────────────────────

  {
    id: "urg-polytrauma", title: "Polytraumatisé — Bilan ABCDE",
    cat: "urgence", tags: ["urgence vitale", "trauma", "protocole"],
    dot: "dot-red", tagColors: ["ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Bilan primaire ABCDE</div>
        <div class="highlight-box">
          <h5>Ordre prioritaire d'évaluation</h5>
          <ul>
            <li><strong>A — Airway</strong> : Libération des voies aériennes (bascule tête, canule Guedel, IOT)</li>
            <li><strong>B — Breathing</strong> : Ventilation efficace (SpO₂, FR, symétrie, pneumothorax)</li>
            <li><strong>C — Circulation</strong> : Contrôle hémorragies, TA, pouls, compression, garrot</li>
            <li><strong>D — Disability</strong> : Neurologique (Glasgow, pupilles, déficit moteur)</li>
            <li><strong>E — Exposure</strong> : Déshabiller, hypothermie, chercher toutes les lésions</li>
          </ul>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Prise en charge initiale</div>
        <ol class="steps">
          <li>Collier cervical + matelas coquille si mécanisme violent</li>
          <li>Oxygène masque haute concentration 15 L/min</li>
          <li>2 VVP gros calibre (16G) + Ringer Lactate</li>
          <li>Bilan sanguin (groupe, NFS, coag, lactatémie, alcoolémie)</li>
          <li>Antalgiques : morphine IV 0.1 mg/kg titrée</li>
          <li>Réchauffer le patient (couverture de survie)</li>
          <li>Bilan radiologique : radio thorax + bassin (trauma grave)</li>
          <li>Scanner corps entier (body scan) si mécanisme lésionnel sévère</li>
        </ol>
        <div class="ibox danger">🚨 Hypotension + tachycardie + pâleur = choc hémorragique jusqu'à preuve du contraire. Transfusion O négatif sans attendre groupage.</div>
      </div>
    `
  },

  {
    id: "urg-resp", title: "Détresse Respiratoire Aiguë",
    cat: "urgence", tags: ["urgence vitale", "protocole"],
    dot: "dot-red", tagColors: ["ct-danger", "ct-blue"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Étiologies à éliminer en urgence</div>
        <div class="pill-grid">
          <span class="pill">Pneumothorax</span><span class="pill">Embolie pulmonaire</span>
          <span class="pill">OAP (œdème pulmonaire)</span><span class="pill">Crise d'asthme sévère</span>
          <span class="pill">Obstruction corps étranger</span><span class="pill">Laryngospasme</span>
          <span class="pill">BPCO décompensée</span><span class="pill">Sepsis pulmonaire</span>
        </div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Protocole</div>
        <ol class="steps">
          <li>Position demi-assise (jambes pendantes si OAP)</li>
          <li>Oxygène nasal → masque → masque haute concentration selon SpO₂ cible</li>
          <li>SpO₂ cible : 94–98% (88–92% si BPCO)</li>
          <li>Auscultation + radio thorax en urgence</li>
          <li>Si corps étranger → manœuvre de Heimlich</li>
          <li>Si pneumothorax compressif → exsufflation à l'aiguille (2e EIC, ligne médio-claviculaire)</li>
          <li>Si OAP → diurétiques (Furosémide 40mg IV) + dérivés nitrés (si TA permet)</li>
          <li>Si SpO₂ &lt; 90% malgré O₂ → VNI ou intubation</li>
        </ol>
        <div class="ibox danger">🚨 Trachéotomie d'urgence si obstruction haute inaccessible (corps étranger enclavé) : incision antérieure du cou entre cartilage thyroïde et cricoïde.</div>
      </div>
    `
  },

  {
    id: "urg-overdose", title: "Overdoses & Intoxications",
    cat: "urgence", tags: ["urgence", "toxicologie", "pharmacologie"],
    dot: "dot-red", tagColors: ["ct-red", "ct-purple"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Bilan initial</div>
        <ol class="steps">
          <li>Interrogatoire victime / témoins : produit(s), dose, heure ingestion, circonstances</li>
          <li>Constantes : TA, FC, FR, SpO₂, T°, glycémie, Glasgow</li>
          <li>Toxicologie sanguine et urinaire</li>
          <li>ECG (allongement QTc, arythmies)</li>
          <li>Bilan hépatique si paracétamol</li>
        </ol>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Syndromes toxiques</div>
        <table class="dt">
          <thead><tr><th>Syndrome</th><th>Signes</th><th>Produits</th></tr></thead>
          <tbody>
            <tr><td><strong>Opiacé</strong></td><td>Myosis, bradypnée, coma, bradycardie</td><td>Morphine, héroïne, codéine, méthadone</td></tr>
            <tr><td><strong>Cholinergique</strong></td><td>Bradycardie, myosis, sueurs, hypersalivation, bronchospasme</td><td>Organophosphorés, carbamates</td></tr>
            <tr><td><strong>Sympathomimétique</strong></td><td>Mydriase, tachycardie, HTA, agitation, hyperthermie</td><td>Cocaïne, amphétamines, ecstasy</td></tr>
            <tr><td><strong>Sérotoninergique</strong></td><td>Hyperthermie, tremblements, agitation, myoclonies</td><td>IRS, IMAO, tramadol, ecstasy</td></tr>
            <tr><td><strong>Anticholinergique</strong></td><td>Mydriase, tachycardie, rétention urinaire, confusion, peau sèche</td><td>Atropine, antihistaminiques, tricycliques</td></tr>
          </tbody>
        </table>
        <div class="ibox danger">🚨 Ne jamais laisser repartir un patient avant récupération COMPLÈTE et évaluation psychiatrique (risque de récidive).</div>
      </div>
    `
  },

  {
    id: "urg-hyperbare", title: "Accident de Décompression (ADD)",
    cat: "urgence", tags: ["urgence", "hyperbare"],
    dot: "dot-purple", tagColors: ["ct-purple", "ct-danger"],
    content: `
      <div class="cc-section">
        <div class="cc-section-title">Mécanisme</div>
        <p>Lors de la remontée en plongée, l'azote dissout sous pression forme des bulles gazeuses dans les tissus et le sang, causant des lésions mécaniques et vasculaires.</p>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Types d'ADD</div>
        <div class="two-col">
          <div class="col-b">
            <h5>Type I — Bends (Non vital)</h5>
            <ul>
              <li>Douleurs articulaires (épaules, coudes, genoux)</li>
              <li>Démangeaisons, mouchetures cutanées</li>
              <li>Fatigue intense</li>
              <li>Gonflement membres</li>
              <li>Peut précéder un type II</li>
            </ul>
          </div>
          <div class="col-b">
            <h5>Type II — Grave (Vital)</h5>
            <ul>
              <li>Paralysie (moelle épinière)</li>
              <li>Confusion, céphalées, AVC</li>
              <li>Douleur thoracique, toux (bulles pulm.)</li>
              <li>Vertiges, surdité (oreille interne)</li>
              <li>Choc et décès possibles</li>
            </ul>
          </div>
        </div>
        <div class="ibox warning">⚠️ 90% des symptômes apparaissent dans les <strong>6 premières heures</strong> après la plongée.</div>
      </div>
      <div class="cc-section">
        <div class="cc-section-title">Traitement immédiat</div>
        <ol class="steps">
          <li>Oxygène pur 100% au masque étanche (dissolut les bulles d'azote)</li>
          <li>Hydratation abondante IV (1–2L) ou orale</li>
          <li>Transport allongé vers caisson hyperbare le plus proche</li>
          <li>Recompression dans le caisson (Table 6 USN : 60 pieds → décompression progressée)</li>
          <li>Décompression avec paliers stricts</li>
        </ol>
        <div class="ibox success">✅ Recompression efficace jusqu'à <strong>48h</strong> après la plongée. Ne jamais attendre la régression spontanée.</div>
      </div>
    `
  },

];

// ══════════════════════════════════════════════════
// LOGIQUE INTERFACE
// ══════════════════════════════════════════════════

let currentFilter = "all";
let currentSearch = "";
let activeId = null;

const listEl    = document.getElementById("guide-list");
const contentEl = document.getElementById("card-display");
const welcomeEl = document.getElementById("welcome");

// Init stat count
document.getElementById("stat-count").textContent = DATA.length;

// ── Render list ──────────────────────────────────
function renderList() {
  listEl.innerHTML = "";

  const filtered = DATA.filter(item => {
    const matchCat = currentFilter === "all" || item.cat === currentFilter || item.tags.includes(currentFilter);
    const q = currentSearch.toLowerCase();
    const matchSearch = !q
      || item.title.toLowerCase().includes(q)
      || item.tags.some(t => t.includes(q))
      || item.cat.includes(q);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="no-results">Aucune fiche trouvée<br><small>${currentSearch ? `"${currentSearch}"` : ""}</small></div>`;
    return;
  }

  // Group by category
  const cats = {};
  filtered.forEach(item => {
    if (!cats[item.cat]) cats[item.cat] = [];
    cats[item.cat].push(item);
  });

  const catLabels = {
    anatomie: "🦴 Anatomie",
    cardiologie: "❤️ Cardiologie",
    hematologie: "🩸 Hématologie",
    infectiologie: "🦠 Infectiologie",
    neurologie: "🧠 Neurologie",
    chirurgie: "🔪 Chirurgie",
    protocole: "📋 Protocoles",
    pharmacologie: "💊 Pharmacologie",
    urgence: "🚨 Urgences",
  };

  Object.entries(cats).forEach(([cat, items]) => {
    const label = document.createElement("div");
    label.className = "list-section-label";
    label.textContent = catLabels[cat] || cat;
    listEl.appendChild(label);

    items.forEach(item => {
      const el = document.createElement("div");
      el.className = "guide-item" + (item.id === activeId ? " active" : "");
      el.dataset.id = item.id;

      const tagsHTML = item.tags
        .map((t, i) => `<span class="itag itag-${getTagColor(item.cat, i)}">${t}</span>`)
        .join("");

      el.innerHTML = `
        <span class="item-dot ${item.dot}"></span>
        <div class="item-info">
          <div class="item-title">${item.title}</div>
          <div class="item-tags">${tagsHTML}</div>
        </div>
      `;
      el.addEventListener("click", () => showCard(item));
      listEl.appendChild(el);
    });
  });
}

function getTagColor(cat, idx) {
  const map = { anatomie: "blue", cardiologie: "red", hematologie: "red", infectiologie: "teal", neurologie: "purple", chirurgie: "amber", protocole: "green", pharmacologie: "orange", urgence: "red" };
  const extras = ["blue", "teal", "amber", "purple", "green", "orange"];
  return idx === 0 ? (map[cat] || "blue") : extras[idx % extras.length];
}

// ── Show card ────────────────────────────────────
function showCard(item) {
  activeId = item.id;
  renderList(); // re-render for active class

  // Build tag html
  const tagsHTML = item.tags
    .map((t, i) => `<span class="ctag ${(item.tagColors || [])[i] || 'ct-blue'}">${t}</span>`)
    .join("");

  const catLabels = {
    anatomie: "🦴 Anatomie", cardiologie: "❤️ Cardiologie",
    hematologie: "🩸 Hématologie", infectiologie: "🦠 Infectiologie",
    neurologie: "🧠 Neurologie", chirurgie: "🔪 Chirurgie",
    protocole: "📋 Protocoles", pharmacologie: "💊 Pharmacologie",
    urgence: "🚨 Urgence"
  };

  contentEl.innerHTML = `
    <div class="cc-header">
      <div class="cc-eyebrow">${catLabels[item.cat] || item.cat} — FICHE MÉDICALE OMC</div>
      <div class="cc-title">${item.title}</div>
      <div class="cc-tags">${tagsHTML}</div>
    </div>
    ${item.content}
  `;

  welcomeEl.style.display = "none";
  contentEl.style.display = "block";
  contentEl.scrollTop = 0;
}

// ── Filters ──────────────────────────────────────
document.getElementById("filter-tabs").addEventListener("click", e => {
  const tab = e.target.closest(".ftab");
  if (!tab) return;
  document.querySelectorAll(".ftab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  currentFilter = tab.dataset.cat;
  renderList();
});

// ── Search ───────────────────────────────────────
window.filterList = function(val) {
  currentSearch = val;
  renderList();
};

// Keyboard shortcut
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("topbar-search").focus();
  }
});

// Initial render
renderList();