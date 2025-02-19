import { GestureResponderEvent } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolateColor,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';

import { RequireExactlyOne } from 'type-fest';

import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';
import { Color } from '@trezor/theme';

import { useOpenLink } from '../useOpenLink';

type LinkProps = RequireExactlyOne<
    {
        label: React.ReactNode;
        href?: string;
        onPress?: () => void;
        isUnderlined?: boolean;
        textColor?: Color;
        textPressedColor?: Color;
    },
    'href' | 'onPress'
>;

const textStyle = prepareNativeStyle<{ isUnderlined: boolean }>((_, { isUnderlined }) => ({
    extend: {
        condition: isUnderlined,
        style: {
            textDecorationLine: 'underline',
        },
    },
}));

const ANIMATION_DURATION = 100;
const IS_NOT_PRESSED_VALUE = 0;
const IS_PRESSED_VALUE = 1;

export const Link = ({
    href,
    label,
    isUnderlined = false,
    textColor = 'textPrimaryDefault',
    textPressedColor = 'textPrimaryPressed',
    onPress,
}: LinkProps) => {
    const { utils, applyStyle } = useNativeStyles();
    const openLink = useOpenLink();
    const isPressed = useSharedValue(IS_NOT_PRESSED_VALUE);

    const animatedTextColorStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            isPressed.value,
            [IS_NOT_PRESSED_VALUE, IS_PRESSED_VALUE],
            [utils.colors[textColor], utils.colors[textPressedColor]],
        ),
    }));

    const handlePressIn = () => {
        isPressed.value = withTiming(IS_PRESSED_VALUE, { duration: ANIMATION_DURATION });
    };

    const handlePress = (e: GestureResponderEvent) => {
        if (href) {
            openLink(href);
        } else if (onPress) {
            onPress();
        }
        e.stopPropagation();
    };

    const handlePressOut = () => {
        isPressed.value = withTiming(IS_NOT_PRESSED_VALUE, { duration: ANIMATION_DURATION });
    };

    return (
        <Animated.Text
            onPressIn={handlePressIn}
            onPress={handlePress}
            onPressOut={handlePressOut}
            style={[applyStyle(textStyle, { isUnderlined }), animatedTextColorStyle]}
            suppressHighlighting
        >
            {label}
        </Animated.Text>
    );
};
