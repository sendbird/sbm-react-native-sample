import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query/react';
import {useDispatch as useAppDispatch, useSelector as useAppSelector} from 'react-redux';
import {rootReducer} from './rootReducer';

// ----------------------------------------------------------------------

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

const {dispatch} = store;

setupListeners(store.dispatch);

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export {dispatch, store, useDispatch, useSelector};
