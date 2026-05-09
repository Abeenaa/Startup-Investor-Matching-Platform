# Quick Test Reference - Copy & Paste Ready

Use this file to quickly test endpoints in Postman or Thunderclient.  
Base URL: `http://localhost:5000`

---

## 1. HEALTH CHECK
```
GET http://localhost:5000/health
```

---

## 2. REGISTER STARTUP USER
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "startup1@test.com",
  "password": "TestPass123!",
  "firstName": "John",
  "lastName": "Startup",
  "role": "STARTUP"
}
```

---

## 3. REGISTER INVESTOR USER
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "investor1@test.com",
  "password": "TestPass123!",
  "firstName": "Jane",
  "lastName": "Investor",
  "role": "INVESTOR"
}
```

---

## 4. REGISTER ADMIN USER
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin1@test.com",
  "password": "AdminPass123!",
  "firstName": "Admin",
  "lastName": "User",
  "role": "SYSTEM_ADMIN"
}
```

---

## 5. LOGIN (Get Tokens)
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "startup1@test.com",
  "password": "TestPass123!"
}
```

**Copy the `accessToken` from response for next requests**

---

## 6. GET CURRENT USER
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

---

## 7. CREATE STARTUP PROFILE
```
POST http://localhost:5000/api/startups/profile
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json

{
  "companyName": "TechStart Ethiopia",
  "industry": "Software",
  "foundedYear": 2023,
  "description": "Building solutions for Africa",
  "website": "https://techstart.com",
  "phoneNumber": "+251911234567",
  "teamSize": 8
}
```

---

## 8. GET MY STARTUP PROFILE
```
GET http://localhost:5000/api/startups/profile
Authorization: Bearer YOUR_STARTUP_TOKEN_HERE
```

---

## 9. UPDATE STARTUP PROFILE
```
PATCH http://localhost:5000/api/startups/profile
Authorization: Bearer YOUR_STARTUP_TOKEN_HERE
Content-Type: application/json

{
  "teamSize": 12,
  "description": "Expanded and growing"
}
```

---

## 10. GET ALL STARTUPS (Admin/Reviewer)
```
GET http://localhost:5000/api/startups?page=1&limit=10
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

---

## 11. APPROVE STARTUP (Admin)
```
PATCH http://localhost:5000/api/startups/STARTUP_ID_HERE/approve
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "comments": "Looks good, approved"
}
```

---

## 12. REJECT STARTUP (Admin)
```
PATCH http://localhost:5000/api/startups/STARTUP_ID_HERE/reject
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "comments": "Does not meet criteria"
}
```

---

## 13. CREATE INVESTOR PROFILE
```
POST http://localhost:5000/api/investors/profile
Authorization: Bearer YOUR_INVESTOR_TOKEN_HERE
Content-Type: application/json

{
  "investorName": "Ethiopia Investment Fund",
  "investmentFocus": "Technology",
  "investmentRange": "$50K - $500K",
  "description": "Early stage investor",
  "website": "https://ethfund.com",
  "phoneNumber": "+251922345678"
}
```

---

## 14. GET MY INVESTOR PROFILE
```
GET http://localhost:5000/api/investors/profile
Authorization: Bearer YOUR_INVESTOR_TOKEN_HERE
```

---

## 15. UPDATE INVESTOR PROFILE
```
PATCH http://localhost:5000/api/investors/profile
Authorization: Bearer YOUR_INVESTOR_TOKEN_HERE
Content-Type: application/json

{
  "investmentFocus": "Technology, Agriculture",
  "investmentRange": "$100K - $1M"
}
```

---

## 16. GET ALL INVESTORS (Admin)
```
GET http://localhost:5000/api/investors?page=1&limit=10
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

---

## 17. APPROVE INVESTOR (Admin)
```
PATCH http://localhost:5000/api/investors/INVESTOR_ID_HERE/approve
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "comments": "Legitimate investor, approved"
}
```

---

## 18. CREATE REVIEWER USER (Staff Admin Only)
```
POST http://localhost:5000/api/admin/users
Authorization: Bearer YOUR_STAFF_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "email": "reviewer1@test.com",
  "password": "ReviewerPass123!",
  "firstName": "Reviewer",
  "lastName": "User",
  "role": "REVIEWER"
}
```

---

## 19. GET ALL USERS (Staff Admin)
```
GET http://localhost:5000/api/admin/users?page=1&limit=20
Authorization: Bearer YOUR_STAFF_ADMIN_TOKEN_HERE
```

---

## 20. CHANGE PASSWORD
```
PATCH http://localhost:5000/api/auth/change-password
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "TestPass123!",
  "newPassword": "NewTestPass456!"
}
```

---

## TEST CHECKLIST

Copy this and use while testing:

- [ ] Health check returns 200
- [ ] Register startup returns 201
- [ ] Register investor returns 201
- [ ] Register admin returns 201
- [ ] Login returns access token
- [ ] Get current user works
- [ ] Create startup profile returns 201
- [ ] Get my startup profile returns 200
- [ ] Update startup profile returns 200
- [ ] Get all startups returns 200 (as admin)
- [ ] Approve startup returns 200 (as admin)
- [ ] Reject startup returns 200 (as admin)
- [ ] Create investor profile returns 201
- [ ] Get my investor profile returns 200
- [ ] Update investor profile returns 200
- [ ] Get all investors returns 200 (as admin)
- [ ] Approve investor returns 200 (as admin)
- [ ] Create reviewer user returns 201 (as staff admin)
- [ ] Get all users returns 200 (as staff admin)
- [ ] Change password returns 200
- [ ] Rate limiting works (too many requests → 429)
- [ ] Authorization enforced (missing token → 401)
- [ ] Authorization enforced (wrong role → 403)

---

## TROUBLESHOOTING

**Connection refused**: Server not running  
→ Start server: `npm run dev` in `/server` directory

**401 Unauthorized**: Token missing or invalid  
→ Copy fresh token from login response

**403 Forbidden**: User role doesn't have permission  
→ Use correct role (STARTUP for startup endpoints, etc.)

**429 Too Many Requests**: Rate limited  
→ Wait 60 seconds before retrying

**400 Bad Request**: Validation failed  
→ Check request body format and required fields

---

## QUICK SETUP STEPS

1. Open Postman or Thunderclient
2. Copy any request from above
3. Click "Send"
4. Check response status
5. If login, save `accessToken`
6. Use token in subsequent requests

---

## NOTES

- Replace `YOUR_ACCESS_TOKEN_HERE` with actual token from login
- Replace `YOUR_STARTUP_TOKEN_HERE` with startup user token
- Replace `YOUR_ADMIN_TOKEN_HERE` with admin user token
- Replace `YOUR_STAFF_ADMIN_TOKEN_HERE` with staff admin token
- Replace `STARTUP_ID_HERE` with actual startup ID
- Replace `INVESTOR_ID_HERE` with actual investor ID
- Server runs on port 5000 by default

---

Generated: May 9, 2026
Ready for immediate testing
