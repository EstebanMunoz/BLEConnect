import { createContext, useState } from 'react';

import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { BottomNavigation } from 'react-native-paper';
import { getMD3Theme } from '../themes/themes';

import ConnectScreen from "../screens/ConnectScreen";
import SettingsScreen from "../screens/SettingsScreen";


const Tab = createBottomTabNavigator();

const initialBLEState = {
  deviceName: "",
  serviceUUID: "",
  characteristicUUID: "",
  characteristicUUID2: "",
}

const initialNotificationState = {
  title: "title",
  body: "body",
  condition: "",
}

export const BLEContext = createContext(initialBLEState);
export const notificationContext = createContext(initialNotificationState);

export default function TabContainer() {
  const [BLEState, setBLEState] = useState(initialBLEState);
  const [notificationState, setNotificationState] = useState(initialNotificationState);
  combinedTheme = getMD3Theme(isCombined=true);
  
  return (
    <BLEContext.Provider value={{BLEState, setBLEState}}>
      <notificationContext.Provider value={{notificationState, setNotificationState}}>
        <NavigationContainer
          theme={combinedTheme}
        >
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
              <BottomNavigation.Bar
                navigationState={state}
                safeAreaInsets={insets}
                onTabPress={({ route, preventDefault }) => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (event.defaultPrevented) {
                    preventDefault();
                  } else {
                    navigation.dispatch({
                      ...CommonActions.navigate(route.name, route.params),
                      target: state.key,
                    });
                  }
                }}
                renderIcon={({ route, focused, color }) =>
                  descriptors[route.key].options.tabBarIcon?.({
                    focused,
                    color,
                    size: 24,
                  }) || null
                }
                getLabelText={({ route }) => descriptors[route.key].route.name}
              />
            )}
          >
            <Tab.Screen
              name="Connect"
              component={ConnectScreen}
              options={{
                tabBarIcon: ({ color, size }) => {
                  return <FontAwesome6 name="bluetooth" size={size} color={color} brands />;
                },
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ color, size }) => {
                  return <FontAwesome6 name="gear" size={size} color={color} solid />;
                },
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </notificationContext.Provider>
    </BLEContext.Provider>
  );
}
