'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RootCard from '../cards/root-card';
import { cn } from '../../lib/utils';

interface ProfileTabsProps {
  tabs: {
    id: string;
    label: string;
    content?: React.ReactNode;
  }[];
  defaultValue?: string;
  className?: string;
}

const ProfileTabs = ({ tabs, defaultValue, className }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} className={cn('space-y-4', className)}>
      <RootCard
        cardContent={
          <TabsList className="border-b rounded-none w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-4 py-2 font-medium text-sm data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary rounded-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        }
      />

      <RootCard
        cardContent={tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.content}
          </TabsContent>
        ))}
      />
    </Tabs>
  );
};

export default ProfileTabs;
