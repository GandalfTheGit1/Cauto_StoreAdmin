import {
  configureStore,
  Action,
  Reducer,
  AnyAction,
  Store,
} from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import RtkQueryService from '@/services/RtkQueryService'
import { 
  performanceMiddleware, 
  cacheInvalidationMiddleware,
  memoryMonitoringMiddleware,
  persistenceOptimizationMiddleware
} from './middleware/performanceMiddleware'

import rootReducer, { RootState, AsyncReducers } from './rootReducer'

/* eslint-disable @typescript-eslint/no-explicit-any */
const middlewares: any[] = [
  RtkQueryService.middleware,
  performanceMiddleware,
  cacheInvalidationMiddleware,
  ...(process.env.NODE_ENV === 'development' ? [memoryMonitoringMiddleware] : []),
  persistenceOptimizationMiddleware,
]

const persistConfig = {
  key: PERSIST_STORE_NAME,
  keyPrefix: '',
  storage,
  whitelist: ['auth', 'theme', 'locale', 'products', 'preferences'],
}

interface CustomStore extends Store<RootState, AnyAction> {
  asyncReducers?: AsyncReducers
}

const store: CustomStore = configureStore({
  reducer: persistReducer(persistConfig, rootReducer() as Reducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
})

store.asyncReducers = {}

export const persistor = persistStore(store)

export function injectReducer<S>(key: string, reducer: Reducer<S, Action>) {
  if (store.asyncReducers) {
    if (store.asyncReducers[key]) {
      return false
    }
    store.asyncReducers[key] = reducer
    store.replaceReducer(
      persistReducer(persistConfig, rootReducer(store.asyncReducers) as Reducer)
    )
  }
  persistor.persist()
  return store
}

export type AppDispatch = typeof store.dispatch

export default store
