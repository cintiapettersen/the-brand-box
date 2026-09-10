'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function FolderVacinaPage4({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  
  const otherVaccines = Array.from({ length: 6 }); // Reduced from 11

  const availability = lang === 'en' ? [
    { label: "BCG / Hepatitis B", publico: "YES", private: "YES" },
    { label: "Hexavalent / Pentavalent", publico: "Pentavalent", private: "Hexavalent (Fewer reactions)" },
    { label: "Polio (IPV / OPV)", publico: "YES", private: "YES (Inactivated)" },
    { label: "Rotavirus", publico: "Monovalent", private: "Pentavalent (5 types)" },
    { label: "Pneumococcal", publico: "PCV10", private: "PCV13 or PCV15" },
    { label: "Meningococcal ACWY / C", publico: "MenC & ACWY (Adolescent)", private: "MenACWY (From 3 months)" },
    { label: "Meningococcal B", publico: "NO", private: "YES" },
    { label: "Influenza (Flu)", publico: "Trivalent", private: "Quadrivalent" },
    { label: "MMR / Varicella", publico: "YES", private: "YES" },
    { label: "Hepatitis A / HPV", publico: "YES", private: "YES" },
    { label: "Yellow Fever", publico: "YES", private: "YES" },
    { label: "Dengue", publico: "YES (Target groups)", private: "YES" },
    { label: "COVID-19", publico: "YES", private: "YES" },
    { label: "Nirsevimab (RSV)", publico: "YES (Specific groups)", private: "YES" },
  ] : [
    { label: "BCG / Hepatite B", publico: "SIM", private: "SIM" },
    { label: "Hexavalente / Pentavalente", publico: "Pentavalente", private: "Hexavalente (Menos reações)" },
    { label: "VIP / VOP (Pólio)", publico: "SIM", private: "SIM (Inativada)" },
    { label: "Rotavírus", publico: "Monovalente", private: "Pentavalente (5 tipos)" },
    { label: "Pneumocócica", publico: "VPC10", private: "VPC13 ou VPC15" },
    { label: "Meningocócica ACWY / C", publico: "MenC e ACWY (11-14a)", private: "MenACWY (Desde 3 meses)" },
    { label: "Meningocócica B", publico: "NÃO", private: "SIM" },
    { label: "Influenza (Gripe)", publico: "Trivalente", private: "Tetravalente" },
    { label: "Tríplice Viral / Varicela", publico: "SIM", private: "SIM" },
    { label: "Hepatite A / HPV", publico: "SIM", private: "SIM" },
    { label: "Febre Amarela", publico: "SIM", private: "SIM" },
    { label: "Dengue (Qdenga)", publico: "SIM (Público alvo)", private: "SIM" },
    { label: "COVID-19", publico: "SIM", private: "SIM" },
    { label: "Nirsevimabe (VSR)", publico: "SIM (Grupos específicos)", private: "SIM" },
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
            {lang === 'en' ? "Public Healthcare" : "Rede Pública"}
          </div>
          <div style={{ flex: 1, padding: '1.2px', fontSize: '2.8px', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
            {lang === 'en' ? "Private Clinics" : "Rede Privada"}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {availability.map((a, i) => (
            <div key={i} style={{ display: 'flex', background: i % 2 === 0 ? '#FDF8EA' : '#fff', borderBottom: '0.15px solid #EEE' }}>
              <div style={{ flex: 1, padding: '1px 2px', fontSize: '2.6px', fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center' }}>{a.label}</div>
              <div style={{ flex: 1, padding: '1px 2px', fontSize: '2.4px', color: '#666', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '0.15px solid #eee', lineHeight: 1 }}>{a.publico}</div>
              <div style={{ flex: 1, padding: '1px 2px', fontSize: '2.4px', color: '#666', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '0.15px solid #eee', lineHeight: 1 }}>{a.private}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
