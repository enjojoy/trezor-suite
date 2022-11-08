import React from 'react';

import { atom, useAtom } from 'jotai';
import { format } from 'date-fns';

import { Box, Text } from '@suite-native/atoms';
import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';
import { ExtendedGraphPoint, LineGraphPoint } from '@suite-common/wallet-graph';
import { useFormatters } from '@suite-common/formatters';
import { Icon, IconName } from '@trezor/icons';

const getColorForPercentageChange = (hasIncreased: boolean) => (hasIncreased ? 'forest' : 'red');

const percentageDiff = (a: number, b: number) => {
    if (a === 0 || b === 0) return 0;
    return 100 * ((b - a) / ((b + a) / 2));
};

// use atomic jotai structure for absolute minimum re-renders and maximum performance
// otherwise graph will be freezing on slower device while point swipe gesture
const selectedPointAtom = atom<ExtendedGraphPoint>({
    value: 0,
    date: new Date(),
    originalDate: new Date(),
});

// reference is usually first point, same as Revolut does in their app
const referencePointAtom = atom<ExtendedGraphPoint>({
    value: 0,
    date: new Date(),
    originalDate: new Date(),
});

export const writeOnlySelectedPointAtom = atom<null, ExtendedGraphPoint | LineGraphPoint>(
    null, // it's a convention to pass `null` for the first argument
    (_get, set, updatedPoint) => {
        // LineGraphPoint should never happen, but we need it to satisfy typescript because of originalDate
        set(selectedPointAtom, updatedPoint as ExtendedGraphPoint);
    },
);
export const writeOnlyReferencePointAtom = atom<null, ExtendedGraphPoint>(
    null,
    (_get, set, updatedPoint) => {
        set(referencePointAtom, updatedPoint);
    },
);

const percentageChangeAtom = atom(get => {
    const selectedPoint = get(selectedPointAtom);
    const referencePoint = get(referencePointAtom);
    return percentageDiff(referencePoint.value, selectedPoint.value);
});

const hasPriceIncreasedAtom = atom(get => {
    const percentageChange = get(percentageChangeAtom);
    return percentageChange >= 0;
});

const headerStyle = prepareNativeStyle(utils => ({
    marginBottom: utils.spacings.small / 2,
    color: utils.colors.gray600,
}));

const PercentageChange = () => {
    const [percentageChange] = useAtom(percentageChangeAtom);
    const [hasPriceIncreased] = useAtom(hasPriceIncreasedAtom);

    return (
        <Text color={getColorForPercentageChange(hasPriceIncreased)} variant="hint">
            {percentageChange.toFixed(2)}%
        </Text>
    );
};

const PercentageChangeArrow = () => {
    const [hasPriceIncreased] = useAtom(hasPriceIncreasedAtom);

    const iconName: IconName = hasPriceIncreased ? 'arrowUp' : 'arrowDown';

    return (
        <Icon
            name={iconName}
            color={getColorForPercentageChange(hasPriceIncreased)}
            size="extraSmall"
        />
    );
};

const arrowStyle = prepareNativeStyle(() => ({
    marginRight: 4,
}));

const priceIncreaseWrapperStyle = prepareNativeStyle<{ hasPriceIncreased: boolean }>(
    (utils, { hasPriceIncreased }) => ({
        backgroundColor: utils.transparentize(
            0.7,
            hasPriceIncreased ? utils.colors.green : utils.colors.red,
        ),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: utils.spacings.small,
        paddingVertical: utils.spacings.small / 4,
        borderRadius: utils.borders.radii.round,
    }),
);

const PriceIncreaseIndicator = () => {
    const { applyStyle } = useNativeStyles();
    const [hasPriceIncreased] = useAtom(hasPriceIncreasedAtom);

    return (
        <Box style={applyStyle(priceIncreaseWrapperStyle, { hasPriceIncreased })}>
            <Box style={applyStyle(arrowStyle)}>
                <PercentageChangeArrow />
            </Box>
            <PercentageChange />
        </Box>
    );
};

const Balance = () => {
    const { FiatAmountFormatter } = useFormatters();
    const [point] = useAtom(selectedPointAtom);

    return <FiatAmountFormatter value={point.value} />;
};

export const GraphTimeIndicator = () => {
    const [point] = useAtom(selectedPointAtom);

    // TOOD: proper formatter, for example use just hours and minutes for small scales etc.
    return <>{format(point.originalDate, 'd. MMM k:mm')}</>;
};

export const PortfolioGraphHeader = () => {
    const { applyStyle } = useNativeStyles();

    return (
        <Box flexDirection="row" justifyContent="center">
            <Box alignItems="center">
                <Text variant="hint" style={applyStyle(headerStyle)}>
                    My assets
                </Text>
                <Text variant="titleLarge">
                    <Balance />
                </Text>
                <Box flexDirection="row" alignItems="center">
                    <Box marginRight="small">
                        <Text variant="hint" color="gray600">
                            <GraphTimeIndicator />
                        </Text>
                    </Box>
                    <PriceIncreaseIndicator />
                </Box>
            </Box>
        </Box>
    );
};
