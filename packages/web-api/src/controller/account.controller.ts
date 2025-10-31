import { Router } from 'express';
import { getAccountById, getKickLogs, getBanLogs, updatePassword } from '../service/account.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.patch('/password', authenticate, async (req, res) => {
  const accountId = req['user'].accountId;
  const password = req.body.password as string;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'invalid_password' });
  }

  try {
    const updateResult = await updatePassword(accountId, password);
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ error: 'account_not_found' });
    }

    return res.status(200).json({ message: 'password_updated' });
  } catch (error) {
    return res.status(500).json({ error: 'server_error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const accountId = req.params.id;

  if (!accountId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'invalid_account_id' });
  }

  const account = await getAccountById(accountId);

  if (!account) {
    return res.status(404).json({ error: 'account_not_found' });
  }

  res.json(account);
});

router.get('/:id/kicks', authenticate, async (req, res) => {
  const accountId = req.params.id;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  if (!accountId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'invalid_account_id' });
  }

  const [kicks, total] = await getKickLogs(accountId, limit, offset);

  res.json({ kicks, total });
});

router.get('/:id/bans', authenticate, async (req, res) => {
  const accountId = req.params.id;

  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  if (!accountId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'invalid_account_id' });
  }

  const [bans, total] = await getBanLogs(accountId, limit, offset);
  res.json({ bans, total });
});

export default router;
