# BlogStudio

Enhanced full-stack blog application with a modern UI and improved backend logic.

## What's Improved

- moderan i responsive frontend
- post search and tag filtering
- comments on the post detail page
- profile with editable user details
- post creation and editing
- sigurnija backend autorizacija za update/delete
- jedinstveni slugovi i robusnija obrada tagova
- health endpoint i automatsko kreiranje uploads direktorija

## Pokretanje

### Backend

1. Kopiraj `backend/.env.example` u `backend/.env`
2. Podesi konekciju prema MySQL bazi
3. Pokreni:

```bash
cd backend
npm install
npm run dev
```

### Frontend

1. Kopiraj `frontend/.env.example` u `frontend/.env`
2. Pokreni:

```bash
cd frontend
npm install
npm run dev
```

## Napomena

Frontend build je provjeren (`npm run build`). Backend JS fajlovi su provjereni syntax check-om. Za potpuno pokretanje backend-a potrebna je ispravna MySQL konfiguracija u `.env` fajlu.
