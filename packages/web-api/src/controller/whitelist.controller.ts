import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getWhitelistByAccountId,
  createWhitelist,
  approveWhitelist,
  rejectWhitelist,
  getAllWhitelists
} from '../service/whitelist.service';
import { isAdministrator } from '../middleware/admin.middleware';


const router = Router();

router.get('/:accountId', authenticate, async (req, res) => {
  const { accountId } = req.params;

  if (!accountId) {
    return res.status(400).json({ message: 'invalid_account_id' });
  }

  const whitelists = await getWhitelistByAccountId(accountId);
  return res.status(200).json(whitelists);
});

router.post('', authenticate, async (req, res) => {
  const accountId = req['user']['id'];
  const { answers, grade } = req.body;
  try {
    const whitelist = await createWhitelist(accountId, { answers, grade });
    return res.status(201).json(whitelist);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.patch('/:whitelistId/approve', authenticate, isAdministrator, async (req, res) => {
  const { whitelistId } = req.params;
  const adminId = req['user']['id'];

  try {
    const whitelist = await approveWhitelist(whitelistId, adminId);
    return res.status(200).json(whitelist);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
})

router.patch('/:whitelistId/reject', authenticate, isAdministrator, async (req, res) => {
  const { whitelistId } = req.params;
  const adminId = req['user']['id'];

  const { note } = req.body;
  try {
    const whitelist = await rejectWhitelist(whitelistId, adminId, note);
    return res.status(200).json(whitelist);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


router.get('', authenticate, isAdministrator, async (req, res) => {
  const { status, skip = 0, limit = 20 } = req.query;
  const [whitelists, total] = await getAllWhitelists(status as string, Number(skip), Number(limit));
  return res.status(200).json({ whitelists, total });
})

export default router;
