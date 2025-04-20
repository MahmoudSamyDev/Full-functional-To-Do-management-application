import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseLine from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import appRouter from "./routes";
import "./App.css";


function App() {
    const theme = createTheme({
        palette: { mode: "dark" },
    });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseLine />
            <RouterProvider router={appRouter} />
        </ThemeProvider>
    );
}

export default App;
