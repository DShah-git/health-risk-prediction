import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {setContext} from '@apollo/client/link/context';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/hospital',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const nurse_token = localStorage.getItem('nurse_token');
  const patient_token = localStorage.getItem('patient_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: nurse_token ? `${nurse_token}` : (patient_token ? `${patient_token}` : "")
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
