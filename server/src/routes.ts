// Root Router
// Aggregates all module routers under /api

import { Router } from 'express';
import authRouter from './modules/auth/auth.routes';
import startupsRouter from './modules/startups/startups.routes';
import investorsRouter from './modules/investors/investors.routes';
import adminRouter from './modules/admin/admin.routes';
import directoryRouter from './modules/directory/directory.routes';
import programsRouter from './modules/programs/programs.routes';
import applicationsRouter from './modules/applications/applications.routes';
import evaluationsRouter from './modules/evaluations/evaluations.routes';
import dashboardRouter from './modules/dashboard/dashboard.routes';

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

// Programs — program management (public + staff admin)
router.use('/programs', programsRouter);

// Applications — application submission and management (startup + staff admin)
router.use('/applications', applicationsRouter);

// Evaluations — application evaluation by reviewers
router.use('/evaluations', evaluationsRouter);

// Dashboard — role-specific dashboards with statistics
router.use('/dashboard', dashboardRouter);

export default router;
