import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { logger } from './logger';

async function seed() {
  logger.info('Avvio seed database...');

  // Admin utente
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe!2024', 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@hornets-taekwondo.it' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@hornets-taekwondo.it',
      passwordHash,
      nome: 'Admin',
      cognome: 'Hornets',
      ruolo: 'superadmin',
    },
  });
  logger.info(`Admin creato/trovato: ${admin.email}`);

  // Maestro principale
  const maestro = await prisma.maestro.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nome: 'Antonio',
      cognome: 'Rossi',
      titolo: 'Maestro IV Dan WTF',
      bio: 'Il Maestro Antonio Rossi ha dedicato oltre 20 anni al Taekwondo, portando gli Hornets ai vertici regionali e nazionali. Con una carriera agonistica di eccellenza e una profonda passione per l\'insegnamento, guida ogni atleta verso la crescita personale e sportiva.',
      cintura: 'nera_4dan_piu',
      dan: 4,
      anniEsperienza: 22,
      specializzazione: 'Agonismo e difesa personale',
      ordine: 1,
    },
  });
  logger.info(`Maestro creato/trovato: ${maestro.nome} ${maestro.cognome}`);

  // Corsi
  const corsi = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      nome: 'Taekwondo Bambini',
      livello: 'bambini' as const,
      descrizionBreve: 'Percorso pensato per i più piccoli: coordinazione, disciplina e divertimento.',
      descrizione: 'Il programma Bambini degli Hornets Taekwondo è progettato per introdurre i più piccoli (4-11 anni) al meraviglioso mondo del Taekwondo. Attraverso giochi, esercizi e tecniche di base, i bambini sviluppano coordinazione motoria, equilibrio, rispetto per gli altri e fiducia in sé stessi.',
      etaMin: 4, etaMax: 11,
      prezzoMensile: 45,
      coloreTema: '#F5A623',
      icona: 'star',
      ordine: 1,
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      nome: 'Taekwondo Ragazzi',
      livello: 'ragazzi' as const,
      descrizionBreve: 'Tecnica e agonismo per ragazzi con allenamenti progressivi.',
      descrizione: 'Il percorso Ragazzi (12-17 anni) rappresenta il passaggio verso il Taekwondo più tecnico e competitivo. Gli atleti affinano le tecniche di calcio e difesa, partecipano a competizioni regionali e costruiscono una mentalità da campioni.',
      etaMin: 12, etaMax: 17,
      prezzoMensile: 50,
      coloreTema: '#D0021B',
      icona: 'shield',
      ordine: 2,
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      nome: 'Taekwondo Adulti',
      livello: 'adulti' as const,
      descrizionBreve: 'Fitness, autodifesa e crescita personale per adulti.',
      descrizione: 'Il corso Adulti è aperto a tutti, dal principiante assoluto all\'esperto. Un allenamento completo che migliora forma fisica, flessibilità, coordinazione e autodifesa. Non è mai troppo tardi per iniziare!',
      etaMin: 18, etaMax: 99,
      prezzoMensile: 55,
      coloreTema: '#1A1A1A',
      icona: 'trophy',
      ordine: 3,
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      nome: 'Agonismo & Competizione',
      livello: 'agonisti' as const,
      descrizionBreve: 'Preparazione atletica avanzata per atleti che vogliono competere.',
      descrizione: 'Il gruppo agonistico degli Hornets è il cuore pulsante della palestra. Allenamenti intensivi, preparazione fisica specifica e partecipazione a gare regionali, nazionali e internazionali. Per atleti ambiziosi che vogliono arrivare in cima.',
      etaMin: 14, etaMax: 35,
      prezzoMensile: 70,
      coloreTema: '#F5A623',
      icona: 'medal',
      ordine: 4,
    },
  ];

  for (const corso of corsi) {
    await prisma.corso.upsert({
      where: { id: corso.id },
      update: {},
      create: corso as Parameters<typeof prisma.corso.create>[0]['data'],
    });
  }
  logger.info(`${corsi.length} corsi creati/trovati`);

  // Orari di esempio
  const orariData = [
    { corsoId: '10000000-0000-0000-0000-000000000001', giorno: 'lunedi' as const, oraInizio: new Date('1970-01-01T17:00:00'), oraFine: new Date('1970-01-01T18:00:00'), maestroId: maestro.id },
    { corsoId: '10000000-0000-0000-0000-000000000001', giorno: 'mercoledi' as const, oraInizio: new Date('1970-01-01T17:00:00'), oraFine: new Date('1970-01-01T18:00:00'), maestroId: maestro.id },
    { corsoId: '10000000-0000-0000-0000-000000000003', giorno: 'martedi' as const, oraInizio: new Date('1970-01-01T19:00:00'), oraFine: new Date('1970-01-01T20:30:00'), maestroId: maestro.id },
    { corsoId: '10000000-0000-0000-0000-000000000003', giorno: 'giovedi' as const, oraInizio: new Date('1970-01-01T19:00:00'), oraFine: new Date('1970-01-01T20:30:00'), maestroId: maestro.id },
    { corsoId: '10000000-0000-0000-0000-000000000004', giorno: 'lunedi' as const, oraInizio: new Date('1970-01-01T20:30:00'), oraFine: new Date('1970-01-01T22:00:00'), maestroId: maestro.id },
    { corsoId: '10000000-0000-0000-0000-000000000004', giorno: 'mercoledi' as const, oraInizio: new Date('1970-01-01T20:30:00'), oraFine: new Date('1970-01-01T22:00:00'), maestroId: maestro.id },
    { corsoId: '10000000-0000-0000-0000-000000000004', giorno: 'sabato' as const, oraInizio: new Date('1970-01-01T10:00:00'), oraFine: new Date('1970-01-01T12:00:00'), maestroId: maestro.id },
  ];

  await prisma.orarioCorso.createMany({ data: orariData, skipDuplicates: true });
  logger.info('Orari creati');

  logger.info('Seed completato con successo!');
  await prisma.$disconnect();
}

seed().catch((err) => {
  logger.error(err);
  process.exit(1);
});
