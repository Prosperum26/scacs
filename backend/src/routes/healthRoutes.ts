/**
 * Health Check Routes
 * Endpoints for health checks and status monitoring
 */

import { Router } from 'express';
import { getHealth, getStatus } from '../controllers/healthController';

const router = Router();

/**
 * GET /
 * Health check endpoint
 * Returns: { message: "SCACS API running", status: "healthy", timestamp: string }
 */
router.get('/', getHealth);

/**
 * GET /status
 * Detailed status endpoint
 * Returns: { status: "ok", service: string, version: string, uptime: number, ... }
 */
router.get('/status', getStatus);

export default router;
