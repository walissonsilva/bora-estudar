import { Home } from './components/Home';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { Container } from 'components/Container';

export default function App() {
  return (
    <>
      <Container>
        <Home />
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
