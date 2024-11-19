'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between font-medium transition-all [&[data-state=open]>svg.plus]:hidden [&[data-state=open]>svg.minus]:block',
        className
      )}
      {...props}
    >
      {children}
      <PlusIcon className='h-4 w-4 plus' />
      <MinusIcon className='h-4 w-4 hidden minus' />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn("overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", className)}
    {...props}
  >
    <div className='pb-4 pt-0'>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

interface AccordionMenuProps {
  accordionTrigger: React.ReactNode;
  accordionContent: React.ReactNode[];
  type?: 'single' | 'multiple';
  value: string;
  active: boolean
}

const AccordionMenu = ({
  accordionTrigger,
  accordionContent,
  type = 'single',
  value,
  active
}: AccordionMenuProps) => {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    if (value) {
      // Navigate to the corresponding route
      router.push(`${value}`);
    }
  };

  return (
    //@ts-ignore
    <Accordion type={type} collapsible={!active} onValueChange={handleValueChange}>
      <AccordionItem value={value}>
        <AccordionTrigger>{accordionTrigger}</AccordionTrigger>
        <AccordionContent className={cn(!active && 'animate-accordion-up')}>{accordionContent}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionMenu,
};
