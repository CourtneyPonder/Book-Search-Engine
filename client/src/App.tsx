import React from 'react';
import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { GET_ME } from './queries';
import SearchBooks from './components/SearchBooks';
import SavedBooks from './components/SavedBooks';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div>
        <SearchBooks />
        <SavedBooks />
        <SignupForm />
        <LoginForm  />
      </div>
    </Router>
  </ApolloProvider>
);

export default App;
