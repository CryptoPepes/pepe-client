import {green, orange} from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

const primaryColor = green;
const secondaryColor = orange;
const contrastTextColor = "#fff";

const types = {
    "dark": {
        background: {
            default: '#202020',
            paper: '#282828',
        },
    },
    "light": {
        background: {
            default: '#fafafa',
            paper: '#fff',
        },
    },
};

const headlineDefaults = (theme) => ({
    color: theme.paletteType === "light" ? "rgba(0, 0, 0, 0.87)" : "#fff"
});

export const createTheme = (theme) => createMuiTheme({
    direction: theme.direction,
    palette: {
        primary: {
            light: primaryColor[300],
            main: primaryColor[500],
            dark: primaryColor[900],
            contrastText: contrastTextColor,
        },
        secondary: {
            light: secondaryColor.A200,
            main: secondaryColor.A400,
            dark: secondaryColor.A700,
            contrastText: contrastTextColor,
        },
        tonalOffset: 0.8,
        type: theme.paletteType,
        ...types[theme.paletteType]
    },
    typography: {
        display1: { ...headlineDefaults(theme) },
        display2: { ...headlineDefaults(theme) },
        display3: { ...headlineDefaults(theme) },
        display4: { ...headlineDefaults(theme) },
        caption: { ...headlineDefaults(theme) },
    }
});
