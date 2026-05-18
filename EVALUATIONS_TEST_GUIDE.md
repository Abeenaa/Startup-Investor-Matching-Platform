# Evaluations Module - Testing Guide

## Overview
The Evaluations module allows reviewers to assess startup applications with a 0-10 scoring system.

## Prerequisites
Before testing evaluations, you need:
1. A REVIEWER user account
2. A STAFF_ADMIN user account
3. At least one application in UNDER_REVIEW status

---

## Setup Test Data

### Step 1: Create Reviewer Account
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "reviewer1@innobiz.gov.et",
  "password": "Reviewer123!",
  "role": "REVIEWER"
}
```

**Note**: You'll need a STAFF_ADMIN to approve this reviewer account first.

### Step 2: Login as Reviewer
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "reviewer1@innobiz.gov.et",
  "password": "Reviewer123!"
}
```

**Save the token** from the response.

### Step 3: Ensure Application is UNDER_REVIEW
Use STAFF_ADMIN to change an application status to UNDER_REVIEW:

```http
PATCH http://localhost:3000/api/applications/{applicationId}/status
Authorization: Bearer {STAFF_ADMIN_TOKEN}
Content-Type: application/json

{
  "status": "UNDER_REVIEW"
}
```

---

## Test Endpoints

### 1. Get My Assignments (Reviewer)
**Purpose**: View applications assigned for review

```http
GET http://localhost:3000/api/evaluations/my-assignments?status=pending&page=1&limit=10
Authorization: Bearer {REVIEWER_TOKEN}
```

**Query Parameters**:
- `status`: `pending` | `completed` | `all` (default: `pending`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Expected Response**:
```json
{
  "success": true,
  "message": "Assignments retrieved successfully",
  "data": {
    "data": [
      {
        "id": "app-uuid",
        "program": {
          "id": "program-uuid",
          "name": "Tech Incubator 2026",
          "type": "INCUBATION"
        },
        "startup": {
          "id": "startup-uuid",
          "name": "TechStartup Inc",
          "sector": "Technology",
          "stage": "Seed"
        },
        "status": "UNDER_REVIEW",
        "submittedAt": "2026-05-10T10:00:00.000Z",
        "additionalInfo": "We are applying because...",
        "pitchDeck": "https://ulhzqocoltpbjoyupqnq.supabase.co/storage/v1/object/public/documents/pitch.pdf",
        "businessPlan": "https://ulhzqocoltpbjoyupqnq.supabase.co/storage/v1/object/public/documents/plan.pdf",
        "myEvaluation": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### 2. Create Evaluation (Reviewer)
**Purpose**: Submit evaluation for an application

```http
POST http://localhost:3000/api/evaluations
Authorization: Bearer {REVIEWER_TOKEN}
Content-Type: application/json

{
  "applicationId": "c1937a23-b462-48ac-97df-2fba0390bd16",
  "score": 8.5,
  "comments": "Excellent business model with strong market validation. The team has relevant experience and the innovation is significant. Minor concerns about scalability.",
  "recommendation": "APPROVE",
  "hasConflict": false
}
```

**Request Body**:
- `applicationId`: UUID of the application (required)
- `score`: Number 0-10 with max 1 decimal place (required)
- `comments`: String, min 20 chars, max 2000 chars (required)
- `recommendation`: `APPROVE` | `REJECT` | `NEEDS_IMPROVEMENT` (required)
- `hasConflict`: Boolean (required)
- `conflictReason`: String, min 10 chars (required if hasConflict is true)

**Example with Conflict of Interest**:
```json
{
  "applicationId": "app-uuid",
  "score": 7.0,
  "comments": "Good potential but I have a conflict of interest that may affect my judgment.",
  "recommendation": "NEEDS_IMPROVEMENT",
  "hasConflict": true,
  "conflictReason": "I previously worked with the founder at another company."
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Evaluation submitted successfully",
  "data": {
    "id": "eval-uuid",
    "applicationId": "app-uuid",
    "reviewerId": "reviewer-uuid",
    "reviewer": {
      "id": "reviewer-uuid",
      "email": "reviewer1@innobiz.gov.et"
    },
    "score": 8.5,
    "comments": "Excellent business model...",
    "recommendation": "APPROVE",
    "hasConflict": false,
    "conflictReason": null,
    "createdAt": "2026-05-12T10:00:00.000Z",
    "updatedAt": "2026-05-12T10:00:00.000Z"
  }
}
```

**Validation Errors**:
- Score must be 0-10 with max 1 decimal
- Comments must be 20-2000 characters
- Cannot evaluate same application twice
- Application must be UNDER_REVIEW status

---

### 3. Update Evaluation (Reviewer)
**Purpose**: Modify your own evaluation before final decision

```http
PATCH http://localhost:3000/api/evaluations/{evaluationId}
Authorization: Bearer {REVIEWER_TOKEN}
Content-Type: application/json

{
  "score": 9.0,
  "comments": "After further review, I'm increasing the score. The team addressed my concerns about scalability.",
  "recommendation": "APPROVE"
}
```

**Request Body** (all fields optional):
- `score`: Number 0-10
- `comments`: String, min 20 chars
- `recommendation`: `APPROVE` | `REJECT` | `NEEDS_IMPROVEMENT`
- `hasConflict`: Boolean
- `conflictReason`: String

**Restrictions**:
- Can only update your own evaluations
- Cannot update after application is APPROVED/REJECTED

---

### 4. Get Single Evaluation (Reviewer/Staff Admin)
**Purpose**: View details of a specific evaluation

```http
GET http://localhost:3000/api/evaluations/{evaluationId}
Authorization: Bearer {REVIEWER_TOKEN}
```

**Access Control**:
- Reviewer can view their own evaluations
- Staff Admin can view all evaluations

---

### 5. Get Application Evaluations Summary (Staff Admin)
**Purpose**: View all evaluations for an application with statistics

```http
GET http://localhost:3000/api/evaluations/application/{applicationId}
Authorization: Bearer {STAFF_ADMIN_TOKEN}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Application evaluations retrieved successfully",
  "data": {
    "applicationId": "app-uuid",
    "totalEvaluations": 3,
    "averageScore": 7.8,
    "recommendations": {
      "approve": 2,
      "reject": 0,
      "needsImprovement": 1
    },
    "evaluations": [
      {
        "id": "eval-1",
        "score": 8.5,
        "comments": "Excellent...",
        "recommendation": "APPROVE",
        "reviewer": {
          "id": "reviewer-1",
          "email": "reviewer1@innobiz.gov.et"
        },
        "createdAt": "2026-05-12T10:00:00.000Z"
      },
      {
        "id": "eval-2",
        "score": 7.0,
        "comments": "Good but needs improvement...",
        "recommendation": "NEEDS_IMPROVEMENT",
        "reviewer": {
          "id": "reviewer-2",
          "email": "reviewer2@innobiz.gov.et"
        },
        "createdAt": "2026-05-12T11:00:00.000Z"
      },
      {
        "id": "eval-3",
        "score": 8.0,
        "comments": "Strong application...",
        "recommendation": "APPROVE",
        "reviewer": {
          "id": "reviewer-3",
          "email": "reviewer3@innobiz.gov.et"
        },
        "createdAt": "2026-05-12T12:00:00.000Z"
      }
    ]
  }
}
```

**Use Case**: Staff Admin uses this to make final decision on application based on reviewer consensus.

---

### 6. Delete Evaluation (Reviewer)
**Purpose**: Remove your evaluation before final decision

```http
DELETE http://localhost:3000/api/evaluations/{evaluationId}
Authorization: Bearer {REVIEWER_TOKEN}
```

**Restrictions**:
- Can only delete your own evaluations
- Cannot delete after application is APPROVED/REJECTED

**Expected Response**:
```json
{
  "success": true,
  "message": "Evaluation deleted successfully",
  "data": null
}
```

---

## Complete Test Workflow

### Scenario: Reviewer Evaluates Application

1. **Login as Reviewer**
   ```
   POST /api/auth/login
   ```

2. **View Pending Assignments**
   ```
   GET /api/evaluations/my-assignments?status=pending
   ```

3. **Create Evaluation**
   ```
   POST /api/evaluations
   Body: { applicationId, score: 8.5, comments: "...", recommendation: "APPROVE", hasConflict: false }
   ```

4. **View Completed Assignments**
   ```
   GET /api/evaluations/my-assignments?status=completed
   ```

5. **Update Evaluation (if needed)**
   ```
   PATCH /api/evaluations/{evaluationId}
   Body: { score: 9.0 }
   ```

### Scenario: Staff Admin Reviews Evaluations

1. **Login as Staff Admin**
   ```
   POST /api/auth/login
   ```

2. **View Application Evaluations**
   ```
   GET /api/evaluations/application/{applicationId}
   ```

3. **Make Final Decision** (based on evaluations)
   ```
   PATCH /api/applications/{applicationId}/status
   Body: { status: "APPROVED" }
   ```

---

## Error Cases to Test

### 1. Duplicate Evaluation
Try creating evaluation twice for same application:
```
Expected: 400 Bad Request
Message: "You have already evaluated this application"
```

### 2. Invalid Score
```json
{
  "score": 11,  // Invalid: max is 10
  "comments": "...",
  "recommendation": "APPROVE",
  "hasConflict": false
}
```
```
Expected: 400 Bad Request
Message: "Score must be at most 10"
```

### 3. Score with Too Many Decimals
```json
{
  "score": 8.567,  // Invalid: max 1 decimal place
  "comments": "...",
  "recommendation": "APPROVE",
  "hasConflict": false
}
```
```
Expected: 400 Bad Request
Message: "Score must have at most 1 decimal place"
```

### 4. Short Comments
```json
{
  "score": 8.5,
  "comments": "Good",  // Invalid: min 20 chars
  "recommendation": "APPROVE",
  "hasConflict": false
}
```
```
Expected: 400 Bad Request
Message: "Comments must be at least 20 characters"
```

### 5. Conflict Without Reason
```json
{
  "score": 8.5,
  "comments": "...",
  "recommendation": "APPROVE",
  "hasConflict": true,
  "conflictReason": ""  // Invalid: required when hasConflict is true
}
```
```
Expected: 400 Bad Request
Message: "Conflict reason is required when declaring a conflict of interest"
```

### 6. Update After Decision
Try updating evaluation after application is APPROVED:
```
Expected: 400 Bad Request
Message: "Cannot update evaluation after application has been decided"
```

### 7. Unauthorized Access
Try accessing evaluations without REVIEWER role:
```
Expected: 403 Forbidden
Message: "Access denied"
```

---

## Security Features

1. **Duplicate Prevention**: One reviewer can only evaluate once per application
2. **Ownership Check**: Reviewers can only update/delete their own evaluations
3. **Status Validation**: Can only evaluate UNDER_REVIEW applications
4. **Immutability**: Cannot modify evaluations after final decision
5. **Conflict of Interest Tracking**: Mandatory disclosure with reason
6. **FIFO Ordering**: Applications shown oldest first for fair distribution

---

## Performance Considerations

- Database indexes on `applicationId` and `reviewerId` for fast lookups
- Unique constraint prevents duplicate evaluations
- Pagination for large result sets
- Efficient aggregation for statistics calculation

---

## Next Steps

After testing Evaluations module:
1. Implement Dashboard module (5 role-specific dashboards)
2. Add email notifications for evaluation assignments
3. Implement reviewer assignment workflow
4. Add evaluation deadline tracking
