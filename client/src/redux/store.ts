import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import reduxThunk from "redux-thunk";

import reducers from "./reducers";

const middlewares = [reduxThunk];

const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
export const persistor = persistStore(store);

export default { store, persistor };
