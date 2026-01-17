import { Router } from 'express';
import { WhitelistStatus } from '@revolt-rp/common';
import { authenticate } from '../middleware/auth.middleware';
import {
  getWhitelistByAccountId,
  createWhitelist,
  approveWhitelist,
  rejectWhitelist,
  getAllWhitelists, generateWhitelistTest
} from '../service/whitelist.service';
import { isAdministrator } from '../middleware/admin.middleware';


const router = Router();

router.get('/manage', authenticate, isAdministrator, async (req, res) => {
  const { status, offset = 0, limit = 50 } = req.query as { status: WhitelistStatus, offset?: string, limit?: string };

  if (status && !Object.values(WhitelistStatus).includes(status)) {
    return res.status(400).json({ message: 'invalid_whitelist_status' });
  }

  const [whitelists, total] = await getAllWhitelists(status, Number(limit), Number(offset));
  return res.status(200).json({ whitelists, total });
})

router.get('/:accountId', authenticate, async (req, res) => {
  const { accountId } = req.params;

  if (!accountId) {
    return res.status(400).json({ message: 'invalid_account_id' });
  }

  const whitelists = await getWhitelistByAccountId(accountId);
  return res.status(200).json(whitelists);
});

router.post('', authenticate, async (req, res) => {
  const accountId = req['user']['accountId'];
  const { answers, essayAnswers } = req.body;
  try {
    const whitelist = await createWhitelist(accountId, { answers, essayAnswers });
    return res.status(201).json(whitelist);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('', authenticate, async (req, res) => {
  const whitelistTest = generateWhitelistTest();
  return res.status(200).json(whitelistTest);
})

router.patch('/:whitelistId/approve', authenticate, isAdministrator, async (req, res) => {
  const { whitelistId } = req.params;
  const adminId = req['user']['accountId'];

  try {
    const whitelist = await approveWhitelist(whitelistId, adminId);
    return res.status(200).json(whitelist);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
})

router.patch('/:whitelistId/reject', authenticate, isAdministrator, async (req, res) => {
  const { whitelistId } = req.params;
  const adminId = req['user']['accountId'];

  const { note } = req.body;
  try {
    const whitelist = await rejectWhitelist(whitelistId, adminId, note);
    return res.status(200).json(whitelist);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


export default router;
