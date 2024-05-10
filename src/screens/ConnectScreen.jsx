import { useState, useEffect, useContext } from 'react';
import { View, Platform, PermissionsAndroid } from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import { atob } from 'react-native-quick-base64';

import notifee, { AndroidVisibility } from '@notifee/react-native';

import { Text, Button } from 'react-native-paper';

import styles from '../styles/globalStyle';
import { BLEContext, notificationContext } from '../navigation/TabContainer';


const bleManager = new BleManager();

function ConnectScreen() {
  const [acceleration, setAcceleration] = useState([0, 0, 0]);
  const [BTPermissionsGranted, setBTPermissionsGranted] = useState(false);
  const [notifyPermissionGranted, setNotifyPermissionGranted] = useState(false);
  const [deviceID, setDeviceID] = useState(null);
  const [message, setMessage] = useState("");
  const [triggerNotification, setTriggerNotification] = useState(false);
  const { BLEState, setBLEState } = useContext(BLEContext);
  const { notificationState, setNotificationState } = useContext(notificationContext);


  async function requestBTPermissions() {
    if (Platform.OS === 'ios') {
      setBTPermissionsGranted(true);
      return
    }
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ])

      setBTPermissionsGranted(
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
      )

      return
    }

    setBTPermissionsGranted(false);
  }

  async function requestNotifyPermission() {
    await notifee.requestPermission()

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

    setNotifyPermissionGranted(
      result['android.permission.POST_NOTIFICATIONS'] === PermissionsAndroid.RESULTS.GRANTED
    )
  }


  // Ask for permissions on start up
  useEffect(() => {
    requestBTPermissions();
    requestNotifyPermission();
  }, [])


  // Send notification when condition is met
  useEffect(() => {
    // const condition = evalCondition(notificationState.condition);
    // if (condition) {
    //   onDisplayNotification();
    //   return
    // }
    if (triggerNotification) {
      onDisplayNotification();
      return
    }

    // notifee.cancelNotification('123');
  }, [triggerNotification])


  async function handleConnect() {
    if (deviceID) {
      console.log("Device is already connected:", deviceID);
    } else {
      bleManager.startDeviceScan([BLEState.serviceUUID], null, async (error, device) => {
        if (error) {
          // Handle error (scanning will be stopped automatically)
          bleManager.stopDeviceScan();
          console.error(error);
          return null
        }
  
        if (device.name === BLEState.deviceName || device.localName === BLEState.deviceName) {
          // Stop scanning as it's not necessary if you are scanning for one device.
          bleManager.stopDeviceScan();
          console.log('Device found:', device.name);
          await connectToDevice(device);
        }
      });
    }
  }

  async function connectToDevice(device) {
    console.log("Connecting to", device.id);

    try {
      return device
        .connect()
        .then(device => {
          return device.discoverAllServicesAndCharacteristics()
        })
        .then(device => {
          setDeviceID(device.id);
          console.log("Device connected:", deviceID);
          return device.services()
        })
        .then((services) => {
          let service = services.find((service) => service.uuid === BLEState.serviceUUID);
          console.log("Service found");
          return service.characteristics();
        })
        .then((characteristics) => {
          console.log("Finding characteristics");
          let characteristic1 = characteristics.find(
            (char) => char.uuid === BLEState.characteristicUUID
          );
          let characteristic2 = characteristics.find(
            (char) => char.uuid === BLEState.characteristicUUID2
          );

          console.log("Characteristics found")
          characteristic1.monitor((error, char) => {
            if (error) {
              switch (error.errorCode) {
                // Handle cancelled Transaction
                case 2:
                  console.log("Monitor cancelled");
                  return
                
                // Handle disconnected device
                case 201:
                  console.log("Unexpected disconnection, cancelling monitor");
                  setDeviceID(null);
                  setMessage("");
                  return

                default:
                  console.error("Error code:", error.errorCode, error);
                  return
              }
            }

            const rawData = atob(char.value);
            setMessage(rawData);
          }, "monitorValue")

          characteristic2.monitor((error, char) => {
            if (error) {
              switch (error.errorCode) {
                // Handle cancelled Transaction
                case 2:
                  console.log("Monitor cancelled");
                  return
                
                // Handle disconnected device
                case 201:
                  console.log("Unexpected disconnection, cancelling monitor");
                  setDeviceID(null);
                  setMessage("");
                  return

                default:
                  console.error("Error code:", error.errorCode, error);
                  return
              }
            }

            const rawData = atob(char.value);
            setTriggerNotification(rawData == "1");
          }, "monitorTrigger")
        })
    } catch (error) {
      console.error(error);
    }
  }


  async function handleDisconnect() {
    try {
      console.log("Disconnecting...");
      bleManager.cancelTransaction("monitorValue");
      bleManager.cancelTransaction("monitorTrigger");
      const disconnected = await bleManager.cancelDeviceConnection(deviceID);
      console.log("Device disconnected");
      setDeviceID(null);
      setMessage("");
      setTriggerNotification(false);
    } catch (error) {
      console.error("Error while disconnecting", error);
    }
  }


  async function onDisplayNotification() {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      visibility: AndroidVisibility.PUBLIC,
    });

    await notifee.displayNotification({
      id: '123',
      title: notificationState.title,
      body: notificationState.body,
      android: {
        channelId,
        timestamp: Date.now(),
        showTimestamp: true,
        onlyAlertOnce: true,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }


  return (
    <View style={styles.container}>
      <Text>Message: {message}</Text>
      <Text>Trigger Notification: {triggerNotification.toString()}</Text>
      <Button
        mode="contained"
        icon={ deviceID ? "bluetooth-off" : "bluetooth-connect" }
        onPress={ deviceID ? handleDisconnect : handleConnect }
        style={styles.button}
      >
        { deviceID ? "Disconnect from Device" : "Connect to Device" }
      </Button>
    </View>
  );
}

export default ConnectScreen;