import React, { Fragment, ReactNode } from 'react';

import { css } from 'emotion';

import { IFrameStickyToolbar } from './IFrameStickyToolbar';

const styles = {
  nativeSticky: css`
    position: -webkit-sticky;
    position: sticky;
    top: -1px;
    z-index: 2;
  `,
};

type StickyToolbarProps = {
  isDisabled?: boolean;
  isIFrame?: boolean;
  children: ReactNode;
};

const StickyToolbarWrapper = ({ isDisabled, children, isIFrame }: StickyToolbarProps) => {
  if (isDisabled) return <Fragment>{children}</Fragment>;

  if (isIFrame) {
    return <IFrameStickyToolbar>{children}</IFrameStickyToolbar>;
  }

  return <div className={isDisabled ? '' : styles.nativeSticky}>{children}</div>;
};

export default StickyToolbarWrapper;
