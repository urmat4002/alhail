import clsx from 'clsx';
import { FC, createElement } from 'react';
import styles from './Typography.module.scss';
import { Tags, TypographyProps } from './types/typography.types';

export const Typography: FC<TypographyProps> = (props) => {
  const {
    variant,
    weight = 'regular',
    children,
    className,
    color = '',
  } = props;

  const classNamedGenerated = clsx(
    styles[variant],
    styles[weight],
    styles[color],
    className
  );

  return createElement(
    Tags[variant],
    { className: classNamedGenerated },
    children
  );
};