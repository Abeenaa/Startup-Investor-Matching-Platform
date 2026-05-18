# Programs & Applications Module - Design Document

## 1. OVERVIEW

This document defines the complete workflow for Programs and Applications modules, designed for a government startup-investor matching platform with professional standards.

---

## 2. PROGRAM TYPES

```typescript
enum ProgramType {
  FUNDING        // Financial grants/investment
  INCUBATION     // Long-term support (6-12 months)
  ACCELERATION   // Intensive program (3-6 months)
  COMPETITION    // Pitch competitions with prizes
  MENTORSHIP     // Mentorship matching
  WORKSPACE      // Co-working space allocation
  TRAINING       // Skills development workshops
}
```

**Different types have different:**
- Eligibility criteria
- Application forms
- Evaluation criteria
- Expected outcomes

---

## 3. PROGRAM LIFECYCLE

```
┌─────────────────────────────────────────────────────────┐
│ 1. STAFF ADMIN creates program                         │
│    - Define type, eligibility, deadline                │
│    - Set max applicants, funding amount                │
│    - Program is ACTIVE                                  │
│                                                         │
│ 2. STARTUPS discover programs                          │
│    - Browse public directory                           │
│    - Filter by type, deadline, funding                 │
│                                                         │
│ 3. STARTUPS apply                                      │
│    - Save as DRAFT (can edit)                          │
│    - Upload documents (pitch deck, business plan)      │
│    - Submit when ready                                 │
│                                                         │
│ 4. DEADLINE passes OR max applicants reached           │
│    - Program closes (isActive = false)                 │
│    - No more applications accepted                     │
│                                                         │
│ 5. STAFF ADMIN assigns reviewers                       │
│    - Applications move to UNDER_REVIEW                 │
│                                                         │
│ 6. REVIEWERS evaluate                                  │
│    - Score applications                                │
│    - Provide feedback                                  │
│    - Make recommendations                              │
│                                                         │
│ 7. STAFF ADMIN makes final decision                    │
│    - APPROVE or REJECT                                 │
│    - Provide feedback                                  │
│                                                         │
│ 8. REJECTED startups can reapply                       │
│    - After improving their startup                     │
│    - Track reapplication history                       │
└─────────────────────────────────────────────────────────┘
```

---

## 4. APPLICATION STATUS WORKFLOW

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED
  ↓         ↓            ↓              ↓
  ↓         ↓            ↓              REJECTED
  ↓         ↓            ↓                ↓
  ↓         ↓            ↓         Can reapply (new DRAFT)
  ↓         ↓            ↓
Startup   Startup    Reviewers    Staff Admin
 saves    submits    evaluate     decides
```

**Status Transitions:**
- `DRAFT` → `SUBMITTED` (startup submits)
- `SUBMITTED` → `UNDER_REVIEW` (staff admin assigns reviewers)
- `UNDER_REVIEW` → `APPROVED` (staff admin approves)
- `UNDER_REVIEW` → `REJECTED` (staff admin rejects)
- `REJECTED` → New `DRAFT` (reapplication)

---

## 5. DOCUMENT UPLOAD REQUIREMENTS

### **Allowed File Types:**
- PDF (`.pdf`)
- PowerPoint (`.ppt`, `.pptx`)
- Word (`.doc`, `.docx`)
- Excel (`.xls`, `.xlsx`) - for financials
- Images (`.jpg`, `.png`) - for prototypes

### **File Size Limits:**
- Maximum per file: **20MB**
- Maximum total per application: **50MB**

### **Document Types:**
1. **Pitch Deck** (Required for FUNDING, COMPETITION)
2. **Business Plan** (Required for INCUBATION, ACCELERATION)
3. **Financial Projections** (Required for FUNDING)
4. **Prototype Screenshots** (Optional)
5. **Legal Documents** (Optional - registration, licenses)
6. **Other Supporting Documents** (Optional)

### **Storage:**
- Use cloud storage (AWS S3, Azure Blob, or Supabase Storage)
- Store URLs in database
- Implement virus scanning
- Generate signed URLs for secure access

---

## 6. BUSINESS RULES

### **Program Creation (Staff Admin):**
- ✅ Only STAFF_ADMIN can create programs
- ✅ Deadline must be in the future
- ✅ If maxApplicants set, enforce limit
- ✅ Track who created the program

### **Program Visibility:**
- ✅ Public can see ACTIVE programs with deadline not passed
- ✅ Staff admin can see all programs (active + inactive)
- ✅ Show remaining slots if maxApplicants is set

### **Application Submission (Startup):**
- ✅ Startup must have APPROVED profile
- ✅ Program must be ACTIVE
- ✅ Deadline not passed
- ✅ Max applicants not reached
- ✅ Startup can have only ONE active application per program
- ✅ Can save as DRAFT multiple times
- ✅ Can edit DRAFT applications
- ✅ Cannot edit after SUBMITTED

### **Reapplication Rules:**
- ✅ Can reapply after REJECTION
- ✅ Must create new application (new DRAFT)
- ✅ Track previous application ID
- ✅ Track reapplication count
- ✅ Staff admin can see reapplication history

### **Evaluation Rules:**
- ✅ Only SUBMITTED applications can be assigned reviewers
- ✅ Multiple reviewers per application
- ✅ Each reviewer evaluates independently
- ✅ Reviewers cannot see each other's scores (until final review)
- ✅ Staff admin sees all evaluations before deciding

---

## 7. API ENDPOINTS

### **Programs Module:**

```typescript
// Public endpoints (no auth)
GET    /api/programs                    // List active programs
GET    /api/programs/:id                // Get program details

// Staff Admin endpoints
POST   /api/programs                    // Create program
PATCH  /api/programs/:id                // Update program
DELETE /api/programs/:id                // Delete program
PATCH  /api/programs/:id/close          // Close program early
GET    /api/programs/:id/applications   // Get all applications for program
GET    /api/programs/:id/statistics     // Get program stats
```

### **Applications Module:**

```typescript
// Startup endpoints
POST   /api/applications                     // Create draft application
GET    /api/applications/my-applications     // List my applications
GET    /api/applications/:id                 // Get application details
PATCH  /api/applications/:id                 // Update draft application
POST   /api/applications/:id/submit          // Submit draft application
DELETE /api/applications/:id                 // Delete draft application
POST   /api/applications/:id/upload-document // Upload document

// Staff Admin endpoints
GET    /api/applications                     // List all applications (with filters)
PATCH  /api/applications/:id/approve         // Approve application
PATCH  /api/applications/:id/reject          // Reject application
GET    /api/applications/:id/history         // Get reapplication history

// Reviewer endpoints
GET    /api/applications/:id                 // View assigned application
```

---

## 8. DATA MODELS

### **Program Model:**
```typescript
{
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  eligibilityCriteria: string;
  fundingAmount?: string;           // "50K-200K USD"
  benefits: string[];               // ["Funding", "Mentorship"]
  deadline: Date;
  startDate?: Date;
  duration?: string;                // "3 months"
  maxApplicants?: number;
  applicationCount: number;
  evaluationStages: object;
  expectedOutcomes: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Application Model:**
```typescript
{
  id: string;
  startupId: string;
  programId: string;
  additionalInfo?: string;          // Why applying
  pitchDeck?: string;               // Document URL
  businessPlan?: string;            // Document URL
  financials?: string;              // Document URL
  otherDocuments?: Array<{          // Additional docs
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  status: ApplicationStatus;
  submittedAt?: Date;
  rejectionReason?: string;
  decidedBy?: string;
  decidedAt?: Date;
  previousApplicationId?: string;   // If reapplying
  reapplicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 9. VALIDATION RULES

### **Program Creation:**
```typescript
{
  name: string (required, 3-200 chars)
  type: ProgramType (required)
  description: string (required, 50-5000 chars)
  eligibilityCriteria: string (required, 20-2000 chars)
  fundingAmount: string (optional, max 100 chars)
  benefits: string[] (optional, max 10 items)
  deadline: Date (required, must be future)
  startDate: Date (optional, must be before deadline)
  duration: string (optional, max 50 chars)
  maxApplicants: number (optional, min 1, max 10000)
  evaluationStages: object (required)
  expectedOutcomes: string (required, 20-2000 chars)
}
```

### **Application Submission:**
```typescript
{
  programId: string (required, valid UUID)
  additionalInfo: string (optional, max 5000 chars)
  pitchDeck: string (optional, valid URL)
  businessPlan: string (optional, valid URL)
  financials: string (optional, valid URL)
  otherDocuments: array (optional, max 5 documents)
}
```

---

## 10. IMPLEMENTATION PHASES

### **Phase 1: Programs Module (Basic)**
- ✅ Create, read, update, delete programs
- ✅ Public program directory
- ✅ Program types and filtering
- ✅ Deadline enforcement
- ✅ Max applicants tracking

### **Phase 2: Applications Module (Core)**
- ✅ Draft application creation
- ✅ Application submission
- ✅ My applications view
- ✅ Staff admin application management
- ✅ Approve/reject workflow

### **Phase 3: Document Upload**
- ✅ File upload endpoint
- ✅ File validation (type, size)
- ✅ Cloud storage integration
- ✅ Secure URL generation
- ✅ Document management

### **Phase 4: Reapplication**
- ✅ Reapplication tracking
- ✅ Application history
- ✅ Reapplication count
- ✅ Previous application linking

---

## 11. SECURITY CONSIDERATIONS

- ✅ Only approved startups can apply
- ✅ Validate file types and sizes
- ✅ Scan uploaded files for viruses
- ✅ Use signed URLs for document access
- ✅ Rate limit application submissions
- ✅ Prevent duplicate submissions
- ✅ Audit trail for all decisions
- ✅ Role-based access control

---

## 12. NEXT STEPS

1. Run database migration for new schema
2. Implement Programs Module (Phase 1)
3. Implement Applications Module (Phase 2)
4. Add document upload (Phase 3)
5. Add reapplication tracking (Phase 4)
6. Test complete workflow
7. Add evaluation module

---

**Ready to start implementation?** 🚀
