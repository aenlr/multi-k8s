import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';

function App() {
  return (
    <Router>
      <div>
        <h1>Fibulator</h1>
        <Link to="/">Home</Link> | <Link to="/otherpage">Other Page</Link>

        <Route exact path="/" component={Fib}/>
        <Route path="/otherpage" component={OtherPage}/>
      </div>
    </Router>
  );
}

export default App;
