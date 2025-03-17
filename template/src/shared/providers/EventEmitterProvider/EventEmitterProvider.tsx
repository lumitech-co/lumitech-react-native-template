import React, { createContext, ReactNode, useContext } from 'react';
import { eventEmitter } from 'services';

const EventContext = createContext<typeof eventEmitter | null>(null);

interface EventEmitterProviderProps {
  children: ReactNode;
}

export const EventEmitterProvider = ({
  children,
}: EventEmitterProviderProps) => {
  return (
    <EventContext.Provider value={eventEmitter}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventEmitter = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error('useEventEmiiter must be used within an EventProvider');
  }

  return context;
};
