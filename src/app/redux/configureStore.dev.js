/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import history from '../common/routing';
import rootReducer from '../redux_modules';

const composeEnhancers = __SERVER__
  ? compose
  : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let middlewares = [routerMiddleware(history), thunk];

if (!__SERVER__) middlewares = [...middlewares, logger];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../redux_modules', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../redux_modules').default)
    );
  }

  return store;
}
