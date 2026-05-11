# Innobiz-K Ethiopia Platform - API Testing Guide

## Quick Start

### Prerequisites

- Postman or Thunderclient installed
- Server running on `http://localhost:5000`
- The server is already configured with all necessary security features

### Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select `POSTMAN_COLLECTION.json` file from the project root
4. Collection will be imported with all endpoints pre-configured

### Environment Setup

Before testing, set these variables in Postman:

- `base_url`: `http://localhost:5000`
- `access_token`: Will be populated after login
- `refresh_token`: Will be populated after login
- `startup_id`: ID from created/fetched startup
- `investor_id`: ID from created/fetched investor
- `user_id`: ID from created/fetched user

---

## Testing Workflow

### Phase 1: Health & Server Status

**Purpose**: Verify server is running

| # | Endpoint | Method | Expected Status | Notes |
|---|----------|--------|-----------------|-------|
| 1 | `/health` | GET | 200 | Should return JSON with status |

**Test Steps**:

```bash
GET http://localhost:5000/health
```

---

### Phase 2: Authentication (Public Routes)

#### 2.1 Register New User

**Test Case**: Register as STARTUP user

```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "startup1@test.com",
  "password": "TestPass123!",
  "firstName": "John",
  "lastName": "Startup",
  "role": "STARTUP"
}
```

| Expected | Status | Notes |
|----------|--------|-------|

| Success | 201 | Returns user with id |
| Duplicate email | 409 | Email already exists |
| Invalid email | 400 | Email validation failed |
| Weak password | 400 | Password must meet criteria |

**Pass Criteria**:

- ✓ Response status is 201
- ✓ Response includes `id`, `email`, `role`
- ✓ Password is NOT returned
- ✓ Rate limiting works (multiple requests rejected)

---

#### 2.2 Register Users for Different Roles

Repeat 2.1 for each role:
- **INVESTOR**: `investor1@test.com`
- **REVIEWER**: `reviewer1@test.com` (via admin)
- **SYSTEM_ADMIN**: `admin@test.com` (via staff admin)

---

#### 2.3 Login

**Test Case**: Login with registered credentials

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "startup1@test.com",
  "password": "TestPass123!"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns tokens |
| Invalid email | 401 | User not found |
| Wrong password | 401 | Credentials invalid |
| Rate limited | 429 | Too many requests |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Response includes `accessToken` and `refreshToken`
- ✓ Tokens are valid JWT format
- ✓ Can use accessToken in subsequent requests

**Save for later**: Copy `accessToken` to `{{access_token}}` variable

---

#### 2.4 Refresh Token

**Test Case**: Get new access token using refresh token

```json
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refresh_token}}"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns new tokens |
| Invalid token | 401 | Refresh token expired/invalid |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ New `accessToken` and `refreshToken` returned
- ✓ Old token can no longer be used

---

#### 2.5 Get Current User (Me)

**Test Case**: Get authenticated user profile

```
GET /api/auth/me
Authorization: Bearer {{access_token}}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns user profile |
| No token | 401 | Authorization missing |
| Invalid token | 401 | Token invalid/expired |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Response includes user `id`, `email`, `role`
- ✓ Without token returns 401

---

#### 2.6 Change Password

**Test Case**: Change user password

```json
PATCH /api/auth/change-password
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "currentPassword": "TestPass123!",
  "newPassword": "NewPass456!"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Password changed |
| Wrong current password | 401 | Current password incorrect |
| Same as old password | 400 | Password cannot be same |
| Weak new password | 400 | New password validation failed |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Can login with new password
- ✓ Cannot login with old password

---

### Phase 3: Startup Profile Management

#### 3.1 Create Startup Profile

**Prerequisites**: Login as STARTUP user, save `access_token`

```json
POST /api/startups/profile
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "companyName": "TechStart Ethiopia",
  "industry": "Software Development",
  "foundedYear": 2023,
  "description": "Building innovative tech solutions for Africa",
  "website": "https://techstart-eth.com",
  "phoneNumber": "+251911234567",
  "teamSize": 8
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 201 | Profile created |
| Duplicate profile | 409 | Startup already has profile |
| Invalid role | 403 | Only STARTUP role allowed |
| Missing auth | 401 | Authorization required |

**Pass Criteria**:

- ✓ Response status is 201
- ✓ Response includes `id`, `status: "PENDING"`
- ✓ Save `id` to `{{startup_id}}` variable

---

#### 3.2 Get My Startup Profile

**Test Case**: Retrieve current startup's profile

```
GET /api/startups/profile
Authorization: Bearer {{access_token}}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns profile |
| No profile | 404 | Profile not created yet |
| Wrong role | 403 | Only STARTUP role allowed |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Returns profile with `id`, `companyName`, `status`

---

#### 3.3 Update Startup Profile

**Test Case**: Update existing profile

```json
PATCH /api/startups/profile
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "companyName": "TechStart Ethiopia Ltd",
  "teamSize": 12,
  "description": "Expanded team with new focus on AI solutions"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Profile updated |
| No profile | 404 | Need to create first |
| Partial update | 200 | Can update individual fields |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Returns updated profile
- ✓ Only specified fields are updated

---

#### 3.4 Get All Startups (Admin/Reviewer)

**Prerequisites**: Login as SYSTEM_ADMIN or REVIEWER

```
GET /api/startups?status=PENDING&page=1&limit=10
Authorization: Bearer {{admin_access_token}}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns paginated list |
| Invalid role | 403 | Only SYSTEM_ADMIN, STAFF_ADMIN, REVIEWER allowed |
| Wrong page | 200 | Empty array if page out of range |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Response includes array of startups
- ✓ Includes pagination info

---

#### 3.5 Get Startup by ID (Admin/Reviewer)

**Test Case**: Retrieve specific startup

```
GET /api/startups/{{startup_id}}
Authorization: Bearer {{admin_access_token}}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns startup details |
| Invalid ID | 404 | Startup not found |
| Invalid role | 403 | Admin/Reviewer only |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Returns complete startup profile

---

#### 3.6 Approve Startup (Admin Only)

**Test Case**: Approve a pending startup

```json
PATCH /api/startups/{{startup_id}}/approve
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "comments": "Strong team and solid business model"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Startup approved |
| Already approved | 400 | Cannot re-approve |
| Invalid role | 403 | SYSTEM_ADMIN/STAFF_ADMIN only |
| Not found | 404 | Startup doesn't exist |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Status changes to "APPROVED"

---

#### 3.7 Reject Startup (Admin Only)

**Test Case**: Reject a pending startup

```json
PATCH /api/startups/{{startup_id}}/reject
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "comments": "Does not meet current criteria"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Startup rejected |
| Already rejected | 400 | Cannot re-reject |
| Invalid role | 403 | SYSTEM_ADMIN/STAFF_ADMIN only |

**Pass Criteria**:

- ✓ Response status is 200
- ✓ Status changes to "REJECTED"

---

### Phase 4: Investor Profile Management

(Follow same pattern as Startup - create, read, update, get all, approve)

#### 4.1 Create Investor Profile

```json
POST /api/investors/profile
Authorization: Bearer {{investor_access_token}}

{
  "investorName": "Ethiopia Investment Fund",
  "investmentFocus": "Technology, Agriculture",
  "investmentRange": "$50K - $500K",
  "description": "Supporting African tech innovation",
  "website": "https://eth-fund.com",
  "phoneNumber": "+251922345678"
}
```

#### 4.2-4.7: Repeat similar tests as Startup (GET profile, UPDATE, GET all, GET by ID, APPROVE)

---

### Phase 5: Admin User Management

#### 5.1 Create Admin/Reviewer User

**Prerequisites**: Login as STAFF_ADMIN

```json
POST /api/admin/users
Authorization: Bearer {{staff_admin_token}}
Content-Type: application/json

{
  "email": "reviewer@innobiz.gov.et",
  "password": "AdminPass123!",
  "firstName": "Abebe",
  "lastName": "Reviewer",
  "role": "REVIEWER"
}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 201 | User created |
| Duplicate email | 409 | Email already exists |
| Invalid role | 400 | Can only create REVIEWER/SYSTEM_ADMIN |
| Insufficient permission | 403 | STAFF_ADMIN only |

**Pass Criteria**:

- ✓ Response status is 201
- ✓ New user can login

---

#### 5.2 Get All Users

```
GET /api/admin/users?role=REVIEWER&page=1&limit=20
Authorization: Bearer {{staff_admin_token}}
```

| Expected | Status | Notes |
|----------|--------|-------|
| Success | 200 | Returns user list |
| Invalid role | 403 | STAFF_ADMIN only |

---

#### 5.3 Update User

```json
PATCH /api/admin/users/{{user_id}}
Authorization: Bearer {{staff_admin_token}}

{
  "firstName": "Abebe",
  "lastName": "ReviewerUpdated"
}
```

---

#### 5.4 Delete User

```
DELETE /api/admin/users/{{user_id}}
Authorization: Bearer {{staff_admin_token}}
```

---

#### 5.5 Assign Reviewers

```json
POST /api/admin/assign-reviewers
Authorization: Bearer {{staff_admin_token}}

{
  "applicationId": "app-001",
  "reviewerIds": ["reviewer-1", "reviewer-2"]
}
```

---

#### 5.6 Get Reviewer Assignments

```
GET /api/admin/reviewer-assignments
Authorization: Bearer {{staff_admin_token}}
```

---

## Security Features to Verify

### 1. Rate Limiting

- **Auth endpoints**: Max 5 requests per minute
- **Admin endpoints**: Max 10 requests per minute
- **Other endpoints**: Normal rate limiting applies

**Test**: Send rapid login requests, expect 429 status after limit

---

### 2. JWT Authentication

- All protected endpoints require `Authorization: Bearer {token}`
- Expired tokens should return 401
- Invalid tokens should return 401
- Missing auth should return 401

---

### 3. Role-Based Access Control

Verify each role can only access:

- **STARTUP**: Own startup profile operations
- **INVESTOR**: Own investor profile operations
- **REVIEWER**: View profiles, read-only access
- **SYSTEM_ADMIN**: Full admin access, approve/reject
- **STAFF_ADMIN**: User management, reviewer assignment

---

### 4. Input Validation

Test with invalid inputs:

- Missing required fields → 400
- Invalid email format → 400
- Password too weak → 400
- Invalid phone number → 400

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check if token is in Authorization header and not expired |
| 403 Forbidden | Verify user has required role |
| 404 Not Found | Verify resource ID is correct |
| 429 Too Many Requests | Wait before retrying, rate limiting active |
| CORS error | Server CORS is properly configured |
| Connection refused | Check server is running on correct port |

---

## Test Summary Checklist

- [ ] Health check endpoint responding
- [ ] Registration working for all roles
- [ ] Login returns valid JWT tokens
- [ ] Token refresh working
- [ ] Get current user (me) endpoint working
- [ ] Startup profile CRUD operations working
- [ ] Startup approval/rejection working
- [ ] Investor profile CRUD operations working
- [ ] Investor approval working
- [ ] Admin user creation working
- [ ] Admin user management working
- [ ] Reviewer assignment working
- [ ] Rate limiting active
- [ ] Authorization enforced for all protected endpoints
- [ ] Input validation working
- [ ] Error responses have proper format

---

## Notes

- All timestamps are in UTC
- Passwords must be at least 8 characters with uppercase, lowercase, numbers, and special characters
- Email addresses must be unique across the system
- Deleted users are soft-deleted (deactivated), not permanently removed
- Status values: PENDING, APPROVED, REJECTED
