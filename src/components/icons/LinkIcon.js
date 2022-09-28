import React from 'react';
import { withTheme } from 'styled-components';

const LinkIcon = withTheme(({ width, height }) => {
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 577.96 577.96"
    >
      <path d="M38.43,78.39H249.78c21.22,0,38.43,17.21,38.43,38.43s-17.21,38.43-38.43,38.43H76.86V501.1H422.71v-172.93c0-21.22,17.21-38.43,38.43-38.43s38.43,17.21,38.43,38.43v211.35c0,21.22-17.2,38.43-38.43,38.43H38.43c-21.22,0-38.43-17.21-38.43-38.43V116.82c0-21.22,17.21-38.43,38.43-38.43" />
      <path d="M501.1,38.43c0-21.22,17.2-38.43,38.43-38.43s38.43,17.21,38.43,38.43V211.35c0,21.22-17.21,38.43-38.43,38.43s-38.43-17.21-38.43-38.43V38.43Z" />
      <path d="M366.6,76.86c-21.22,0-38.43-17.21-38.43-38.43S345.38,0,366.6,0h172.92c21.22,0,38.43,17.21,38.43,38.43s-17.21,38.43-38.43,38.43h-172.92Z" />
      <path d="M446.75,76.86c15.01-15.01,39.34-15.01,54.35,0,15.01,15.01,15.01,39.34,0,54.35l-197,197c-15.01,15.01-39.34,15.01-54.35,0-15.01-15.01-15.01-39.34,0-54.35L446.75,76.86Z" />
    </svg>
  );
});

export { LinkIcon };
