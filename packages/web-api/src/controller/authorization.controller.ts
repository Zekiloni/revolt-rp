import { Router } from 'express';
import { getDiscordAuthUrl } from '@revolt-rp/core';
import { getOrCreateByDiscord } from '../service/account.service';
import { getIpFromRequest } from '../util/request.util';

const router = Router();


router.get('/oauth2/discord', (req, res) => {
  return res.redirect(getDiscordAuthUrl());
});

router.get('/oauth2/discord/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send({ error, error_description });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).send({ error: 'invalid_request', error_description: 'Authorization code is missing or invalid' });
  }

  try {
    const account = await getOrCreateByDiscord(code, getIpFromRequest(req));
    // TODO: Generate JWT or session for the user

    return res.send(account);
  } catch (e) {
    return res.status(500).send({ error: 'server_error', error_description: 'An error occurred while processing your request' });
  }
});


export default router;
