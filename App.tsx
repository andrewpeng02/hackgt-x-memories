import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigation from './navigation';
import { ThemeProvider, createTheme } from '@rneui/themed';

const theme = createTheme({
  components: {
    Text: {
      h1Style: {
        fontSize: 50,
        textAlign: 'center'
      },
      h2Style: {
        fontSize: 20,
        textAlign: 'center'
      }
    }
  },
  mode: 'light'
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <RootNavigation />
    </ThemeProvider>
  );
}
