import { useState } from 'react';
import styled from 'styled-components';

import { useDispatch } from 'src/hooks/suite';
import { openModal } from 'src/actions/suite/modalActions';
import { CoinList } from 'src/components/suite';
import type { Network } from 'src/types/wallet';

import { CoinGroupHeader } from './CoinGroupHeader';

const CoinGroupWrapper = styled.div`
    width: 100%;
`;

interface CoinGroupProps {
    networks: Network[];
    enabledNetworks?: Network['symbol'][];
    className?: string;
    onToggle: (symbol: Network['symbol'], toggled: boolean) => void;
}

export const CoinGroup = ({ onToggle, networks, enabledNetworks, className }: CoinGroupProps) => {
    const [settingsMode, setSettingsMode] = useState(false);

    const dispatch = useDispatch();

    const isAtLeastOneActive = networks.some(({ symbol }) => enabledNetworks?.includes(symbol));

    const onSettings = (symbol: Network['symbol']) => {
        setSettingsMode(false);
        dispatch(
            openModal({
                type: 'advanced-coin-settings',
                coin: symbol,
            }),
        );
    };
    const toggleSettingsMode = () => setSettingsMode(value => !value);

    return (
        <CoinGroupWrapper className={className}>
            <CoinGroupHeader
                isAtLeastOneActive={isAtLeastOneActive}
                settingsMode={settingsMode}
                toggleSettingsMode={toggleSettingsMode}
            />
            <CoinList
                networks={networks}
                enabledNetworks={enabledNetworks}
                settingsMode={settingsMode}
                onToggle={settingsMode ? onSettings : onToggle}
                onSettings={settingsMode ? undefined : onSettings}
            />
        </CoinGroupWrapper>
    );
};
