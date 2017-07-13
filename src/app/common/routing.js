import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history = __SERVER__ ? createMemoryHistory() : createBrowserHistory();
export default history;
