import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter, matchPath } from 'react-router-dom';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import configureStore from 'app/redux/configureStore';
import App from 'app/containers/App';
import routes from 'app/routes';

export default async (req, res) => {
  const store = configureStore();
  const matches = routes.filter(route => matchPath(req.path, route));
  const promises = matches
    .filter(route => route.component && route.component.fetchData)
    .map(route =>
      route.component.fetchData({ store, match: matchPath(req.path, route), query: req.query })
    );

  try {
    await Promise.all(promises);
  } catch (err) {
    res.status(500);
    res.send(err);
  }

  const sheet = new ServerStyleSheet();
  const context = {};
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <StyleSheetManager sheet={sheet.instance}>
          <App />
        </StyleSheetManager>
      </StaticRouter>
    </Provider>
  );
  const css = sheet.getStyleTags();
  const helmet = Helmet.renderStatic();

  if (context.url) {
    res.redirect(301, context.url);
  } else {
    const preloadedState = JSON.stringify(store.getState()).replace(/</g, '\\u003c');

    res.status(context.status || 200);
    res.render('index', {
      helmet,
      css,
      content,
      preloadedState,
    });
  }
};
