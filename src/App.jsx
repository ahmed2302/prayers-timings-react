import { Container } from "@mui/material";
import MainContent from "./Components/MainContent";
import "./App.css";

export default function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100vw",
        }}>
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}
