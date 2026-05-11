# GitHub Setup & Push Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Repository name: `innobiz-k-platform`
4. Description: `Startup-Investor Matching Platform for MInT Ethiopia`
5. Choose: **Private** (for now)
6. **DO NOT** initialize with README (we already have files)
7. Click "Create repository"

## Step 2: Initialize Git (If Not Already Done)

```bash
# Navigate to your project root
cd innobiz-k-platform

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Project structure setup"
```

## Step 3: Connect to GitHub

```bash
# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/innobiz-k-platform.git

# Verify remote
git remote -v
```

## Step 4: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Step 5: Verify on GitHub

1. Go to your repository on GitHub
2. You should see all your files
3. Check that `.env` is NOT there (it's in .gitignore)

## Step 6: Invite Team Members

1. Go to repository Settings
2. Click "Collaborators"
3. Click "Add people"
4. Enter team members' GitHub usernames or emails
5. They'll receive an invitation email

## Step 7: Share with Team

Send this message to your team:

```

Backend Repository is Ready!

Repository: https://github.com/YOUR-USERNAME/innobiz-k-platform

Setup Instructions:
1. Accept the GitHub invitation
2. Clone the repo: git clone https://github.com/YOUR-USERNAME/innobiz-k-platform.git
3. Follow server/SETUP.md for backend setup
4. Check server/TASK_DISTRIBUTION.md for your tasks

Important Files:
- server/SETUP.md - Setup instructions
- server/TASK_DISTRIBUTION.md - Task assignments
- CONTRIBUTING.md - Development workflow

Let's build! 
```

## Branch Protection (Optional but Recommended)

1. Go to Settings > Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
5. Save changes

This ensures all code is reviewed before merging to main.

## Team Workflow

### For Team Members:

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR-USERNAME/innobiz-k-platform.git
   cd innobiz-k-platform
   ```

2. **Create your feature branch**

   ```bash
   git checkout -b feature/your-name-your-feature
   ```

3. **Work on your tasks**
   - Make changes
   - Test your code

4. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: description of what you did"
   git push origin feature/your-name-your-feature
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "Compare & pull request"
   - Add description
   - Request review
   - Wait for approval

6. **After merge, update your local main**

   ```bash
   git checkout main
   git pull origin main
   ```

## Common Git Commands

```bash
# Check status
git status

# See changes
git diff

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename
```

## Troubleshooting

### "Permission denied"

- Make sure you're added as a collaborator
- Check your GitHub authentication

### "Merge conflict"

```bash
# Pull latest main
git checkout main
git pull origin main

# Merge main into your branch
git checkout feature/your-branch
git merge main

# Resolve conflicts in your editor
# Then commit
git add .
git commit -m "fix: resolve merge conflicts"
git push
```

### "Remote already exists"

```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR-USERNAME/innobiz-k-platform.git
```

## Security Notes

**NEVER commit these files:**

- `.env` (contains secrets)
- `node_modules/` (too large)
- `dist/` or `build/` (generated files)

These are already in `.gitignore`, but double-check!

## Next Steps

1. ✅ Push to GitHub
2. ✅ Invite team members
3. ✅ Share setup instructions
4. ✅ Team clones and sets up
5. ✅ Start building!

---

**Ready to collaborate! **
