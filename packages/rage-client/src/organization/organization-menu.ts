import { on, triggerBrowser } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';


let isOrganizationMenuActive = gameUiConfig.manageOrganization.isActive;

function toggleOrganizationMenu(organizationId?: string) {
  if (isOrganizationMenuActive && !organizationId) {
    isOrganizationMenuActive = false;
    hideGameInterface(GameUiKey.ManageOrganization);
  } else {
    isOrganizationMenuActive = true;
    showGameInterface(GameUiKey.ManageOrganization);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_ORGANIZATION_ID, organizationId), 100);
  }
}

on(ProcedureKey.CLIENT_TOGGLE_ORGANIZATION_PANEL, toggleOrganizationMenu);
