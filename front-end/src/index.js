import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);



// import React from "react";
// import { Route, Switch } from "react-router-dom";
// import Layout from "./layout/Layout";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
//  */
// function App() {
//   return (
//     <Switch>
//       <Route path="/">
//         <Layout />
//       </Route>
//     </Switch>
//   );
// }

// export default App;
