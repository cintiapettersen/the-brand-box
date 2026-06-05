'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function FolderVacinaPage4({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  
  const otherVaccines = Array.from({ length: 6 }); // Reduced from 11

  const availability = lang === 'en' ? [
    { label: "BCG / Hepatitis B", ubs: "YES", private: "YES" },
    { label: "Hexavalent / Pentavalent", ubs: "Pentavalent", private: "Hexavalent (Fewer side effects)" },
    { label: "VIP / VOP (Polio)", ubs: "YES", private: "YES (Inactivated)" },
    { label: "Rotavirus", ubs: "Monovalent", private: "Pentavalent (5 types)" },
    { label: "Pneumococcal", ubs: "PCV10", private: "PCV13 or PCV15" },
    { label: "Meningococcal ACWY / C", ubs: "MenC & ACWY (11-14y)", private: "MenACWY (From 3 months)" },
    { label: "Meningococcal B", ubs: "NO", private: "YES" },
    { label: "Influenza (Flu)", ubs: "Trivalent", private: "Quadrivalent" },
    { label: "MMR / Varicella", ubs: "YES", private: "YES" },
    { label: "Hepatitis A / HPV", ubs: "YES", private: "YES" },
    { label: "Yellow Fever", ubs: "YES", private: "YES" },
    { label: "Dengue (Qdenga)", ubs: "YES (Target public)", private: "YES" },
    { label: "COVID-19", ubs: "YES", private: "YES" },
    { label: "Nirsevimab (RSV)", ubs: "YES (Specific groups)", private: "YES" },
  ] : [
    { label: "BCG / Hepatite B", ubs: "SIM", private: "SIM" },
    { label: "Hexavalente / Pentavalente", ubs: "Pentavalente", private: "Hexavalente (Menos reações)" },
    { label: "VIP / VOP (Pólio)", ubs: "SIM", private: "SIM (Inativada)" },
    { label: "Rotavírus", ubs: "Monovalente", private: "Pentavalente (5 tipos)" },
    { label: "Pneumocócica", ubs: "VPC10", private: "VPC13 ou VPC15" },
    { label: "Meningocócica ACWY / C", ubs: "MenC e ACWY (11-14a)", private: "MenACWY (Desde 3 meses)" },
    { label: "Meningocócica B", ubs: "NÃO", private: "SIM" },
    { label: "Influenza (Gripe)", ubs: "Trivalente", private: "Tetravalente" },
    { label: "Tríplice Viral / Varicela", ubs: "SIM", private: "SIM" },
    { label: "Hepatite A / HPV", ubs: "SIM", private: "SIM" },
    { label: "Febre Amarela", ubs: "SIM", private: "SIM" },
    { label: "Dengue (Qdenga)", ubs: "SIM (Público alvo)", private: "SIM" },
    { label: "COVID-19", ubs: "SIM", private: "SIM" },
    { label: "Nirsevimabe (VSR)", ubs: "SIM (Grupos específicos)", private: "SIM" },
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '4px 6px', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Montserrat', sans-serif", 
      boxSizing: 'border-box', 
      background: '#fff', 
      justifyContent: 'space-between'
    }}>
      {/* Outras Vacinas Section */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          background: '#72A9D1', 
          padding: '1px 10px', 
          borderRadius: '4px',
          width: 'fit-content',
          marginBottom: '2px',
          alignSelf: 'center'
        }}>
          <div style={{ color: '#fff', fontSize: '5px', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            {lang === 'en' ? "other vaccines" : "outras vacinas"}
          </div>
        </div>
        
        <div style={{ display: 'flex', borderBottom: '0.4px solid #72A9D1', background: '#F8F8F8' }}>
          <div style={{ flex: 1, padding: '1.2px 3px', fontSize: '3.2px', fontWeight: 800, color: '#444' }}>
            {lang === 'en' ? "VACCINE" : "VACINA"}
          </div>
          <div style={{ width: '30px', padding: '1.2px 3px', fontSize: '3.2px', fontWeight: 800, color: '#444', textAlign: 'center' }}>
            {lang === 'en' ? "DATE" : "DATA"}
          </div>
        </div>
        
        {otherVaccines.map((_, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: '0.15px solid #eee', height: '8.5px' }}>
            <div style={{ flex: 1, borderRight: '0.15px solid #eee' }} />
            <div style={{ width: '30px' }} />
          </div>
        ))}
      </div>

      {/* Disponibilização Section */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          background: '#E6C673', 
          padding: '1px 10px', 
          borderRadius: '4px',
          width: 'fit-content',
          marginBottom: '2px',
          alignSelf: 'center'
        }}>
          <div style={{ color: '#fff', fontSize: '5px', fontWeight: 800, letterSpacing: '0.6px' }}>
            {lang === 'en' ? "Vaccine Availability" : "Disponibilização das Vacinas"}
          </div>
        </div>

        <div style={{ display: 'flex', background: '#E6C673', marginBottom: '0.5px' }}>
          <div style={{ flex: 1, padding: '1.2px', fontSize: '2.8px', fontWeight: 800, color: '#fff', textAlign: 'center', borderRight: '0.15px solid #fff' }}>
            {lang === 'en' ? "VACCINE" : "VACINA"}
          </div>
          <div style={{ flex: 1, padding: '1.2px', fontSize: '2.8px', fontWeight: 800, color: '#fff', textAlign: 'center', borderRight: '0.15px solid #fff' }}>
            {lang === 'en' ? "Free at UBS*" : "Gratuitas nas UBS*"}
          </div>
          <div style={{ flex: 1, padding: '1.2px', fontSize: '2.8px', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
            {lang === 'en' ? "Private clinics" : "Clínicas privadas"}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {availability.map((a, i) => (
            <div key={i} style={{ display: 'flex', background: i % 2 === 0 ? '#FDF8EA' : '#fff', borderBottom: '0.15px solid #EEE' }}>
              <div style={{ flex: 1, padding: '1px 2px', fontSize: '2.6px', fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center' }}>{a.label}</div>
              <div style={{ flex: 1, padding: '1px 2px', fontSize: '2.4px', color: '#666', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '0.15px solid #eee', lineHeight: 1 }}>{a.ubs}</div>
              <div style={{ flex: 1, padding: '1px 2px', fontSize: '2.4px', color: '#666', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '0.15px solid #eee', lineHeight: 1 }}>{a.private}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
