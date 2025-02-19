import { ActivityIndicator } from 'react-native';

import { Text, VStack, Box } from '@suite-native/atoms';
import { Icon } from '@suite-common/icons';
import { useNativeStyles, prepareNativeStyle } from '@trezor/styles';
import { useDelayedNavigation } from '@suite-native/device';
import { Translation } from '@suite-native/intl';

import { ConnectDeviceScreenView } from '../../components/connect/ConnectDeviceScreenView';

const screenStyle = prepareNativeStyle(() => ({
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 150,
}));

export const ConnectingDeviceScreen = () => {
    useDelayedNavigation();
    const { applyStyle } = useNativeStyles();

    return (
        <ConnectDeviceScreenView style={applyStyle(screenStyle)} shouldDisplayCancelButton={false}>
            <VStack spacing="medium" alignItems="center">
                <ActivityIndicator size="large" />
                <Box flexDirection="row" alignItems="center">
                    <Text variant="titleMedium">
                        <Translation id="moduleConnectDevice.connectingDeviceScreen.title" />
                    </Text>
                    <Box paddingBottom="small" paddingLeft="small">
                        <Icon name="trezor" size="extraLarge" />
                    </Box>
                </Box>
                <Text variant="highlight" color="textSubdued">
                    <Translation id="moduleConnectDevice.connectingDeviceScreen.hodlOn" />
                </Text>
            </VStack>
        </ConnectDeviceScreenView>
    );
};
