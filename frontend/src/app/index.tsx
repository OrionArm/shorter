import { RouterProvider } from "atomic-router-react";
import "./app.css";

import { router, Routing } from "./router";

const App = () => (
  <div className="app">
    <RouterProvider router={router}>
      <Routing />
    </RouterProvider>
  </div>
);

export default App;
