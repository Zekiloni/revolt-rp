import { Router } from 'express';
import { IAccountAuthorize } from '@revolt-rp/common';
import { authConfig, getDiscordAuthUrl } from '@revolt-rp/core';
import { getAccountById, getOrCreateByDiscord, login } from '../account/account.service';
import { getIpFromRequest } from '../../util/request.util';
import { generateJwtToken } from './auth.service';
import { authenticate } from '../../core/auth.middleware';

const router = Router();

router.post('/basic', async (req, res) => {
  const body = req.body as IAccountAuthorize;

  if (!body.username || !body.password) {
    return res.status(400).send({
      error: 'invalid_request',
      error_description: 'Username and password are required'
    });
  }

  try {
    const account = await login(body.username, body.password);
    const token = generateJwtToken({
      accountId: account.id,
      username: account.username,
      administrator: account.administrator
    });
    return res.redirect(`${authConfig.APP_URL}?token=${encodeURIComponent(token)}`);
  } catch (e) {
    return res.status(500).send({
      error: 'server_error',
      error_description: 'An error occurred while processing your request'
    });
  }
});

router.get('/userinfo', authenticate, async (req, res) => {
  const accountId = req['user'].accountId;
  const account = await getAccountById(accountId);
  return res.send(account);
});

router.get('/oauth2/discord', (req, res) => {
  return res.redirect(getDiscordAuthUrl());
});

router.get('/oauth2/discord/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send({ error, error_description });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).send({
      error: 'invalid_request',
      error_description: 'Authorization code is missing or invalid'
    });
  }

  try {
    const account = await getOrCreateByDiscord(code, getIpFromRequest(req));
    const token = generateJwtToken({
      accountId: account.id,
      username: account.username,
      administrator: account.administrator
    });

    return res.redirect(`${authConfig.APP_URL}?token=${encodeURIComponent(token)}`);
  } catch (e) {
    return res.status(500).send({
      error: 'server_error',
      error_description: 'An error occurred while processing your request'
    });
  }
});


export default router;
