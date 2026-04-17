# Admission Dashboard Enhancement - Implementation TODO

## Current Progress

✅ Plan approved by user. Starting Phase 1.

## Phase 1: Database & Backend Foundation

✅ 1. Update `ci4/database_setup.sql` - Add `documents` and `messages` tables + prototype seed data  
✅ 2. Create `ci4/app/Models/DocumentModel.php`  
✅ 3. Create `ci4/app/Models/MessageModel.php`  
✅ 4. Create `ci4/app/Controllers/Api/Document.php` - CRUD + upload endpoints  
✅ 5. Create `ci4/app/Controllers/Api/Message.php` - send/list/reply endpoints  
✅ 6. Enhance `ci4/app/Controllers/Api/Admin.php` - stats, activity logging, reports submit  
✅ 7. Update `ci4/app/Config/Routes.php` - Add new routes  
✅ 8. Configure file uploads directories

**Phase 1 Backend Complete! 🎉**  
**Manual Steps:**

1. `mysql -u root -p < ci4/database_setup.sql`
2. `cd ci4 && composer install && php spark serve` (backend http://localhost:8080)
3. `npm run dev` (frontend)

**Phase 2 Frontend in progress...**

## Phase 2: Frontend Integration

- [ ] 9. Update `src/pages/ApplicationForm.tsx` - Real backend submission + OTP flow
- [ ] 10. Update `src/context/AuthContext.tsx` - Add documents/messages APIs
- [ ] 11. Update `src/pages/Documents.tsx` - Fetch/upload real data
- [ ] 12. Update `src/pages/Messages.tsx` - Real data + replies
- [ ] 13. Update `src/pages/Reports.tsx` - Full activity + submit review
- [ ] 14. Update `src/pages/LandingPage.tsx` - Contact form → messages endpoint

## Phase 3: Testing & Prototype

- [ ] 15. Seed DB with prototype data (mockData equivalents)
- [ ] 16. End-to-end testing: Form submit → DB → Dashboard → Updates
- [ ] 17. File upload testing
- [ ] 18. Frontend: `npm run dev`, Backend: `php spark serve`

## Commands to Run After Changes

```
# Backend
cd ci4
composer install  # if needed
php spark migrate  # run migrations

# Database
mysql -u root -p < ci4/database_setup.sql

# Frontend
npm install
npm run dev

# Test endpoints
curl -X POST http://localhost:8080/api/applicant/register -H "Content-Type: application/json" -d &#39;{...}&#39;
```

**Next Step: 1. Update database_setup.sql**
