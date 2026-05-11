// Root Router
// Aggregates all module routers under /api

import { Router } from 'express';
import authRouter from './modules/auth/auth.routes';
import startupsRouter from './modules/startups/startups.routes';
import investorsRouter from './modules/investors/investors.routes';
import adminRouter from './modules/admin/admin.routes';
import directoryRouter from './modules/directory/directory.routes';

const router = Router();

// Auth — registration, login, token refresh, profile
router.use('/auth', authRouter);

// Startups — profile management and approval
router.use('/startups', startupsRouter);

// Investors — profile management and approval
router.use('/investors', investorsRouter);

// Admin — user management and reviewer assignment (staff admin only)
router.use('/admin', adminRouter);

// Directory — public search and browse (no auth required)
router.use('/directory', directoryRouter);

// Future modules will be added here as they are implemented:
// router.use('/programs', programsRouter);
// router.use('/applications', applicationsRouter);
// router.use('/evaluations', evaluationsRouter);
// router.use('/dashboard', dashboardRouter);

export default router;
