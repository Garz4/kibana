/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { PublishingSubject, useStateFromPublishingSubject } from '../publishing_subject';

export interface PublishesDataLoading {
  dataLoading: PublishingSubject<boolean | undefined>;
}

export const apiPublishesDataLoading = (
  unknownApi: null | unknown
): unknownApi is PublishesDataLoading => {
  return Boolean(unknownApi && (unknownApi as PublishesDataLoading)?.dataLoading !== undefined);
};

/**
 * Gets this API's data loading state as a reactive variable which will cause re-renders on change.
 */
export const useDataLoading = (api: Partial<PublishesDataLoading> | undefined) =>
  useStateFromPublishingSubject(apiPublishesDataLoading(api) ? api.dataLoading : undefined);
