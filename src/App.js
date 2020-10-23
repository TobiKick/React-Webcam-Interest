import React from "react";
import { Paper } from "@material-ui/core";
import AppContent from "./components/AppContent";
import Header from "./components/Header";

const App = () => {
  return (
    <React.Fragment>
      <Header />
      <Paper style={{ margin: "20px", padding: "20px", marginTop: "80px" }}>
        <AppContent />
      </Paper>
    </React.Fragment>
  );
};

export default App;
