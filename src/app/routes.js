import React from 'react';
import NotFound from './components/NotFound';
import Home from './containers/Home';

export default [
  {
    exact: true,
    path: '/',
    component: Home,
  },
  {
    path: '*',
    // eslint-disable-next-line react/prop-types
    render: ({ staticContext }) => {
      // eslint-disable-next-line no-param-reassign
      if (staticContext) staticContext.status = 404;
      return <NotFound />;
    },
  },
];
