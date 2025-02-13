import { t } from 'i18next';
import { on, ProcedureListenerInfo, register, triggerClient } from '@libertymp/rage-rpc';
import { catchError, ProcedureKey } from '@revolt-rp/common';
import { createOrganization, getAllOrganizations } from './organization.service';
import { notifyPlayer } from '../player/util/player-notify.util';
import { Organization } from './organization.model';


function getOrganizationsHandler() {
  return getAllOrganizations();
}

export const createOrganizationHandler = (organizationCreate: Partial<Organization>, { player }: ProcedureListenerInfo<PlayerMp>) => {
  createOrganization({
    ...organizationCreate,
    position: player.position,
    dimension: player.dimension,
    heading: player.heading
  }).then((organization) => {
    notifyPlayer(player, {
      severity: 'success',
      summary: t('success'),
      detail: t('organization_created', { name: organization.name })
    });
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_CREATE_ORGANIZATION, false);
  }).catch((error) => {
    const apiError = catchError(error);
    notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t(apiError.message)
    });
  });
};

on(ProcedureKey.SERVER_PLAYER_CREATE_ORGANIZATION, createOrganizationHandler);
register(ProcedureKey.SERVER_PLAYER_GET_ORGANIZATIONS, getOrganizationsHandler);
