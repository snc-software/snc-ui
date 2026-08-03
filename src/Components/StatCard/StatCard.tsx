import { ArrowDown, ArrowUp } from 'iconoir-react';

import Card from '@/Components/Card';
import { Heading, Paragraph } from '@/Components/Typography';
import { MiniDonut, MiniSparkline } from '@/Internal/ChartBase';
import { cn } from '@/Utils/cn';

import {
  NeutralColor,
  NeutralIconBgClass,
  NeutralTextClass,
  StatusColors,
  StatusIconBgClasses,
  StatusTextClasses,
  Variants,
} from './StatCard.constants';
import { classes } from './StatCard.styles';

import type { StatCardProps } from './StatCard.types';

export default function StatCard({
  ref,
  variant,
  label,
  value,
  icon,
  status,
  trendValue,
  trendDirection,
  sparklineData,
  donutValue,
  className,
  ...rest
}: StatCardProps) {
  const color = status ? StatusColors[status] : NeutralColor;
  const textClass = status ? StatusTextClasses[status] : NeutralTextClass;
  const iconBgClass = status ? StatusIconBgClasses[status] : NeutralIconBgClass;

  return (
    <Card
      ref={ref}
      className={className}
      {...rest}
      content={
        <div>
          <div className={classes.header}>
            <Paragraph className={classes.label}>{label}</Paragraph>
            {icon && (
              <span className={cn(classes.icon, iconBgClass, textClass)} aria-hidden="true">
                {icon}
              </span>
            )}
          </div>

          <div className={cn(classes.metricRow, Variants[variant])}>
            {variant === 'donut' && donutValue !== undefined && (
              <div aria-hidden="true">
                <MiniDonut value={donutValue} color={color} />
              </div>
            )}

            <div>
              <Heading level="h3" className={classes.value}>
                {value}
              </Heading>

              {variant === 'trend' && (
                <div className={classes.trend}>
                  <span className={cn(classes.trendIcon, textClass)} aria-hidden="true">
                    {trendDirection === 'down' ? <ArrowDown /> : <ArrowUp />}
                  </span>
                  {trendValue !== undefined && (
                    <span className={classes.trendValue}>{trendValue}</span>
                  )}
                </div>
              )}

              {variant === 'sparkline' && sparklineData !== undefined && (
                <div className={classes.sparklineWrapper} aria-hidden="true">
                  <MiniSparkline data={sparklineData} color={color} />
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
