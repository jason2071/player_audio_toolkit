import React from 'react';
import {Provider} from 'react-redux';
import configuration from './store';
import RootNavigator from './navigation';
const store = configuration();

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
