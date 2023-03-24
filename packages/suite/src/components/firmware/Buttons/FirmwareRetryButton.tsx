import React from 'react';

import { Button, ButtonProps } from '@trezor/components';
import { Translation } from 'src/components/suite';

export const FirmwareRetryButton = (props: ButtonProps) => (
    <Button {...props} data-test="@firmware/retry-button">
        <Translation id="TR_RETRY" />
    </Button>
);