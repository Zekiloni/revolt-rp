import { t } from 'i18next';
import { registerCommand } from '../player/player-command.service';
import { getClosesProperty } from './property.service';
import { ProcedureKey, PropertyPointType } from '@revolt-rp/common';
import { notifyPlayer } from '../player/util/player-notify.util';
import { triggerClient } from '@libertymp/rage-rpc';


registerCommand({
  name: 'property',
  description: t('property_command_description'),
  async handle(player: PlayerMp) {
    const property = await getClosesProperty(player.position, player.dimension, PropertyPointType.Main);

    if (!property)
      return notifyPlayer(player, {
        severity: 'error', summary: t('error'), detail: t('not_near_property')
      });

    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_MENU, property);
  }
});
