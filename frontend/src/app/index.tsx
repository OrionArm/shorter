import { RouterProvider } from "atomic-router-react";
import "./app.css";

import { router, Routing } from "./router";

const App = () => (
  <RouterProvider router={router}>
    <Routing />
  </RouterProvider>
);

export default App;
