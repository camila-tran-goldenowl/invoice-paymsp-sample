import { configureStore, StoreEnhancer } from "@reduxjs/toolkit";
import { createInjectorsEnhancer } from "redux-injectors";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";

import { createReducer } from "./reducers";

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

  const logger = createLogger({
    collapsed: true,
  });

  const store = configureStore({
    reducer: createReducer(),
    middleware: getDefaultMiddleware => [
      ...getDefaultMiddleware({ serializableCheck: false }).concat(logger),
      ...middlewares,
    ],
    devTools: process.env.NODE_ENV !== "production",
    enhancers,
  });

  return store;
}
