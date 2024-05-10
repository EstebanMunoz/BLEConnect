import { useState, useContext } from 'react';
import { View, KeyboardAvoidingView } from 'react-native';

import { Text, TextInput, HelperText, List, Divider } from 'react-native-paper';

import styles from '../styles/globalStyle';
import { BLEContext, notificationContext } from '../navigation/TabContainer';

function SettingsScreen() {
  const { BLEState, setBLEState} = useContext(BLEContext);
  const { notificationState, setNotificationState } = useContext(notificationContext);

  const _isUUIDValid = (uuid) => /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(uuid);

  // function conditionParser(stringCondition) {
  //   const splittedString = stringCondition.split(' ');
  // }

  return (
    <View style={styles.container}>
      <List.Section style={{width: '90%'}}>
        <List.Accordion
            title="BLE Configuration"
            description="Configure the BLE connection"
        >
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            label="Device Name"
            placeholder="Input your BLE Device Name"
            value={BLEState.deviceName}
            onChangeText={(name) =>
              setBLEState({...BLEState, deviceName: name})
            }
            left={
              <TextInput.Icon
                icon="format-text"
              />
            }
          />
          <View>
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Service UUID"
              placeholder="Input your Service UUID"
              value={BLEState.serviceUUID}
              error={!_isUUIDValid(BLEState.serviceUUID)}
              onChangeText={(uuid) =>
                setBLEState({...BLEState, serviceUUID: uuid})
              }
              left={
                <TextInput.Icon
                  icon="format-text"
                  // onPress={() => {
                  //   changeIconColor('outlineLeftIcon');
                  // }}
                />
              }
              maxLength={36}
              right={<TextInput.Affix text={`${BLEState.serviceUUID.length}/36`} />}
            />
            <HelperText type="error" visible={!_isUUIDValid(BLEState.serviceUUID)}>
              Error: Not a valid UUID
            </HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Characteristic UUID"
              placeholder="Input your Characteristic UUID"
              value={BLEState.characteristicUUID}
              error={!_isUUIDValid(BLEState.characteristicUUID)}
              onChangeText={(uuid) =>
                setBLEState({...BLEState, characteristicUUID: uuid})
              }
              left={
                <TextInput.Icon
                  icon="format-text"
                />
              }
              maxLength={36}
              right={<TextInput.Affix text={`${BLEState.characteristicUUID.length}/36`} />}
            />
            <HelperText type="error" visible={!_isUUIDValid(BLEState.characteristicUUID)}>
              Error: Not a valid UUID
            </HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Characteristic UUID 2"
              placeholder="Input your Characteristic UUID 2"
              value={BLEState.characteristicUUID2}
              error={!_isUUIDValid(BLEState.characteristicUUID2)}
              onChangeText={(uuid) =>
                setBLEState({...BLEState, characteristicUUID2: uuid})
              }
              left={
                <TextInput.Icon
                  icon="format-text"
                />
              }
              maxLength={36}
              right={<TextInput.Affix text={`${BLEState.characteristicUUID2.length}/36`} />}
            />
            <HelperText type="error" visible={!_isUUIDValid(BLEState.characteristicUUID2)}>
              Error: Not a valid UUID
            </HelperText>
          </View>
        </List.Accordion>
      </List.Section>

      <Divider />

      <List.Section style={{width: '90%'}}>
        <List.Accordion
            title="Notification configuration"
            description="Configure the settings for the notification"
        >
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            label="Notification Title"
            placeholder="Input the title for the notification"
            value={notificationState.title}
            onChangeText={(title) =>
              setNotificationState({...notificationState, title: title})
            }
            left={
              <TextInput.Icon
                icon="format-text"
              />
            }
          />
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            label="Notification Body"
            placeholder="Input the body for the notification"
            value={notificationState.body}
            onChangeText={(body) =>
              setNotificationState({...notificationState, body: body})
            }
            left={
              <TextInput.Icon
                icon="format-text"
              />
            }
          />
        </List.Accordion>
      </List.Section>
    </View>
  );
}

export default SettingsScreen;