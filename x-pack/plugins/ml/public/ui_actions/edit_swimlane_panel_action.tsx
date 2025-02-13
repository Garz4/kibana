/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { UiActionsActionDefinition } from '@kbn/ui-actions-plugin/public';
import { ViewMode } from '@kbn/embeddable-plugin/public';
import type { MlCoreSetup } from '../plugin';
import type { EditSwimlanePanelContext } from '../embeddables';
import { ANOMALY_SWIMLANE_EMBEDDABLE_TYPE } from '../embeddables';

export const EDIT_SWIMLANE_PANEL_ACTION = 'editSwimlanePanelAction';

export function createEditSwimlanePanelAction(
  getStartServices: MlCoreSetup['getStartServices']
): UiActionsActionDefinition<EditSwimlanePanelContext> {
  return {
    id: 'edit-anomaly-swimlane',
    type: EDIT_SWIMLANE_PANEL_ACTION,
    getIconType(context): string {
      return 'pencil';
    },
    getDisplayName: () =>
      i18n.translate('xpack.ml.actions.editSwimlaneTitle', {
        defaultMessage: 'Edit swim lane',
      }),
    async execute({ embeddable }) {
      if (!embeddable) {
        throw new Error('Not possible to execute an action without the embeddable context');
      }

      const [coreStart, deps] = await getStartServices();

      try {
        const { resolveAnomalySwimlaneUserInput } = await import(
          '../embeddables/anomaly_swimlane/anomaly_swimlane_setup_flyout'
        );

        const result = await resolveAnomalySwimlaneUserInput(
          coreStart,
          deps.data.dataViews,
          embeddable.getInput()
        );
        embeddable.updateInput(result);
      } catch (e) {
        return Promise.reject();
      }
    },
    async isCompatible({ embeddable }) {
      return (
        embeddable.type === ANOMALY_SWIMLANE_EMBEDDABLE_TYPE &&
        embeddable.getInput().viewMode === ViewMode.EDIT
      );
    },
  };
}
