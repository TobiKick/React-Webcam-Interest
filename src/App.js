import React from "react";
import { Paper, Button } from "@material-ui/core";
import AppContent from "./components/AppContent";
import Header from "./components/Header";
import { Alert } from '@material-ui/lab';

const App = () => {
  const [showAlert, setShowAlert] = React.useState(true);

  return (
    <React.Fragment>
      <Header />

      <Paper style={{ margin: "20px", padding: "20px", marginTop: "80px" }}>
        {showAlert ? (
            <div><Alert variant="outlined" severity="warning"
              action={
                <Button onClick={() => setShowAlert(false) } variant="outlined" color="inherit" size="small">
                  CLOSE
                </Button>
              }
            >
              <b>Please make sure your webcam is working!</b> Your face will be recorded <br /> ---> For each video clip <b>download the results separately!!</b> Please send the output files (video + csv) by e-mail to <b>tkick93@gmail.com</b><br /><br />The received video will only be used for the purpose of Emotion Recognition. Images/Videos will not appear in the thesis itself.
            </Alert></div>
        ) : (
        <div></div>
        )}
        <AppContent />
      </Paper>
    </React.Fragment>
  );
};

export default App;
