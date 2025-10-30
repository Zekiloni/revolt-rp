import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getCharacterById } from '../service/character.service';

const router = Router();

router.get('/:id', authenticate, async (req, res) => {
  const characterId = req.params.id;

  if (!characterId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'invalid_character_id' });
  }

  const character = await getCharacterById(characterId);

  if (!character) {
    return res.status(404).json({ error: 'character_not_found' });
  }

  res.json(character);
});

export default router;
