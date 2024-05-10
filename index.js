/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import App from './src/App';
import {name as appName} from './app.json';
import { getMD3Theme } from './src/themes/themes';
import notifee, { EventType } from '@notifee/react-native';


notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the notification
  if (type === EventType.ACTION_PRESS) {
    // Log de press
    console.log("User pressed the notification");

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});


export default function Main() {
  const MD3Theme = getMD3Theme();

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: true }}
      theme={ MD3Theme }
    >
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);