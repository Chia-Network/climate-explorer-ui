import React from 'react';
import { AppLogo, ConnectButton } from '@/components';

const Header: React.FC = () => {
  return (
    <div style={{ height: '64px' }}>
      <div className="pt-1 pb-1 w-screen h-16 bg-[#6e7d7f] dark:bg-gray-800 dark:border-gray-600">
        {/* Expanded the container to full width and adjusted padding for larger breakpoints */}
        <div className="flex justify-between items-center h-full px-4 lg:px-10 w-full">
          {/* App logo with left alignment */}
          <div className="flex items-center h-full mr-5">
            <AppLogo width="40" height="40" />
          </div>
          {/* Right-aligned elements with explicit right margin on larger breakpoints */}
          <div className="flex items-center gap-5 text-white">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Header };