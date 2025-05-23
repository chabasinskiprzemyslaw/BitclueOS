"use babel";
import React from "react";

export const home = (props) => {
  return (
    <svg viewBox="0 0 512 512" width={24} height={24} {...props}>
      <path
        d="M448 463.746H298.667V314.413h-85.334v149.333H64V148.318L256 36.572l192 110.984v316.19z"
        fill="currentColor"
      />
    </svg>
  );
};

export const shuffle = (props) => {
  return (
    <svg viewBox="0 0 16 16" height={16} width={16} {...props}>
      <path d="M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z" />
    </svg>
  );
};

export const previous = (props) => {
  return (
    <svg height={16} width={16} viewBox="0 0 16 16" {...props}>
      <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z" />
    </svg>
  );
};

export const next = (props) => {
  return (
    <svg height={16} width={16} viewBox="0 0 16 16" {...props}>
      <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z" />
    </svg>
  );
};

export const repeat = (props) => {
  return (
    <svg height={16} width={16} viewBox="0 0 16 16" {...props}>
      <path d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z" />
    </svg>
  );
};

export const play = (props) => {
  return (
    <svg height={16} width={16} viewBox="0 0 16 16" {...props}>
      <path d="M4.018 14L14.41 8 4.018 2z" />
    </svg>
  );
};

export const pause = (props) => {
  return (
    <svg height={16} width={16} viewBox="0 0 16 16" {...props}>
      <path fill="none" d="M0 0h16v16H0z" />
      <path d="M3 2h3v12H3zm7 0h3v12h-3z" />
    </svg>
  );
};

export const search = (props) => {
  return (
    <svg
      height={24}
      width={24}
      viewBox="0 0 512 512"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285T224 57.397t-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286T224 377.397z"
        fill="currentColor"
      />
    </svg>
  );
};

export const camera = (props) => {
  return (
    <svg
      height={24}
      width={24}
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      {...props}
    >
      <g clipRule="evenodd" fill="#222" fillRule="evenodd">
        <path d="M16 10.001a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8zm4.555 11.905a5.998 5.998 0 01-8.459.65 5.997 5.997 0 01-.65-8.459 6 6 0 019.109 7.809z" />
        <path d="M16 14.001A4 4 0 0012 18v.002a.5.5 0 001 0V18a3 3 0 013-2.999.5.5 0 000-1z" />
        <path d="M29.492 9.042l-4.334-.723-1.373-3.434A2.988 2.988 0 0021 3H11a2.99 2.99 0 00-2.786 1.886L6.842 8.319l-4.333.723A2.989 2.989 0 000 12v15c0 1.654 1.346 3 3 3h26c1.654 0 3-1.346 3-3V12a2.989 2.989 0 00-2.508-2.958zM30 27a1 1 0 01-1 1H3a1 1 0 01-1-1V12a1 1 0 01.836-.986l5.444-.907 1.791-4.478C10.224 5.25 10.591 5 11 5h10c.408 0 .775.249.928.629l1.791 4.478 5.445.907A1 1 0 0130 12v15z" />
      </g>
    </svg>
  );
};

export const view = (props) => {
  return (
    <svg fill="none" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        d="M14 20.4v-5.8c0-.3.3-.6.6-.6h5.8c.3 0 .6.3.6.6v5.8c0 .3-.3.6-.6.6h-5.8a.6.6 0 01-.6-.6zM3 20.4v-5.8c0-.3.3-.6.6-.6h5.8c.3 0 .6.3.6.6v5.8c0 .3-.3.6-.6.6H3.6a.6.6 0 01-.6-.6zM14 9.4V3.6c0-.3.3-.6.6-.6h5.8c.3 0 .6.3.6.6v5.8c0 .3-.3.6-.6.6h-5.8a.6.6 0 01-.6-.6zM3 9.4V3.6c0-.3.3-.6.6-.6h5.8c.3 0 .6.3.6.6v5.8c0 .3-.3.6-.6.6H3.6a.6.6 0 01-.6-.6z"
      />
    </svg>
  );
};

export const sort = (props) => {
  return (
    <svg viewBox="0 0 416 330" {...props}>
      <path
        stroke="currentColor"
        fill="currentColor"
        d="M124 1h8l6 2 4 3 106 107 4 8v9l-2 5-5 6-8 4h-9l-8-4-71-71-1 144-1 1v81q-2 8-8 12l-6 3h-11q-8-3-12-8l-2-3-1-3v-5l-1-1V133l1-1V70l-69 69-3 4-8 4H17l-10-5v-1l-5-7-1-8q2-1 1-5l3-5L116 5l8-4z"
      />
      <path
        fill="var(--clrPrm)"
        stroke="var(--clrPrm)"
        d="M284 17h12q7 3 11 9l3 6 1 226 70-71 9-5h12l5 2 7 8 2 4v14l-3 6-110 110-5 3q-4-1-4 1h-9l-7-3-4-3-108-107-4-8v-11l3-7 6-6 6-3h13l6 3 72 72V33l2-5 6-7 8-4z"
      />
    </svg>
  );
};

export const refresh = (props) => {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <path
        stroke="currentColor"
        fill="currentColor"
        d="M52.36 2.42c1.13-.78 3.1.11 3.01 1.58.16 4.63.24 9.29-.06 13.92-1.33 1.78-3.92 1.84-5.83 2.7-2.86.88-5.63 2.05-8.55 2.73-2.24.82-3.57-2.75-1.56-3.76 3.12-1.45 6.55-2.08 9.7-3.46-4.53-5.47-12.03-8.07-19.02-7.52-7.45.53-14.44 4.97-18.24 11.38-3.59 5.9-4.28 13.42-1.95 19.9 2.06 5.83 6.52 10.78 12.13 13.38 6.52 3.08 14.48 2.94 20.86-.43 6.41-3.32 11.14-9.75 12.27-16.9.69-3.14-.13-6.37.28-9.52 1.08-1 2.2-1.08 3.38-.25.99 1.78.87 3.87.92 5.83.09 8.42-4.09 16.75-10.83 21.79-5.85 4.49-13.59 6.43-20.87 5.25-9.43-1.37-17.82-8.13-21.22-17.02-3.85-9.35-1.81-20.75 4.95-28.25C18.12 6.4 28.59 2.98 38.11 5.12c4.88.92 9.11 3.7 13.03 6.61.17-2.8-.15-5.63.26-8.41l.96-.9z"
      />
    </svg>
  );
};

export const New = (props) => {
  return (
    <svg viewBox="0 0 500 500" {...props}>
      <path
        fill="var(--clrPrm)"
        stroke="var(--clrPrm)"
        d="M245 151h11q4 2 7 6l3 6v71h72q6 2 9 7l2 4v11l-5 7-6 3h-72v72q-2 6-6 9l-4 2h-11l-8-5-3-6v-72h-71q-7-2-10-6l-2-4v-11q2-5 6-8l6-3h71v-71q2-7 7-10l4-2z"
      />
      <path
        stroke="currentColor"
        fill="currentColor"
        d="M249 26q3-1 4 1h19l1 1h7l1 1h6l6 2h5l1 1 11 2 4 2h3l6 3 13 4 21 10 21 13 17 13 17 17 17 20 11 16 5 10 2 2 12 26 6 18v3l2 4 1 8 1 1v4l1 1v4l1 1 1 14 1 1v19q2 0 1 4l-1 1v18l-1 1v8l-1 1v6l-1 1-2 14-1 1v3l-2 4v3l-6 18-5 10v2l-7 14-13 21-13 17-16 17-20 17-16 11-10 5-2 2-26 12-21 7h-3l-5 2h-4l-1 1h-4l-1 1h-4l-1 1-14 1-1 1h-19q-1 2-4 1l-1-1h-19l-1-1h-7l-1-1h-6l-1-1-14-2-1-1-10-2-18-6-3-2h-2l-21-10-21-13-17-13-17-15-18-21-11-16-5-10-2-2-10-21-5-16-2-3-1-7-3-8-2-14-1-1-1-14-1-1v-19q-2-1-1-4l1-1v-19l1-1v-7l1-1v-6l1-1 2-14 4-12v-3l2-3 3-11 5-10v-2l7-14 13-21 13-17 16-17 21-18 16-11 10-5 2-2 21-10 16-5 3-2 7-1 8-3h4l1-1h4l6-2h6l1-1h7l1-1h19l1-1zm-13 31l-1 1h-9l-1 1h-6l-1 1h-4l-1 1h-4l-9 3h-3l-15 5-3 2h-2l-7 4h-2q-31 15-53 37-25 24-41 58v2l-5 10-5 15-2 11-1 1v4l-1 1v4l-1 1v6l-1 1v9l-1 1v29l1 1v9l1 1v6l1 1v4l1 1v4l3 9v3l5 15 5 10v2l10 19q12 19 28 36 23 24 56 39h2l7 4h2l3 2 15 5 11 2 1 1h4l1 1 12 1 1 1h8l1 1h29l1-1 15-1 1-1h5l1-1h4l9-3h3l15-5 24-11 10-6q17-11 32-25l13-14 10-13 12-19 5-10v-2l4-7v-2l2-3 5-15 2-11 1-1v-4l1-1 1-12 1-1v-9l1-1v-28l-1-1-1-15-1-1v-5l-1-1v-4l-3-9v-3l-5-15-11-24-6-10q-11-19-26-33-17-18-38-31l-19-10h-2l-10-5-15-5-11-2-1-1h-4l-1-1h-4l-1-1h-6l-1-1h-9l-1-1h-29z"
      />
    </svg>
  );
};

export const display = (props) => {
  return (
    <svg viewBox="0 0 500 500" {...props}>
      <path
        stroke="currentColor"
        fill="currentColor"
        d="M243.5 37h210l18 6L485 53.5l6 8 5 10 3 9v10l1 1v255l-1 1v10l-3 9-5 10-8.5 10.5-8 6-10 5-6 1-1 1h-4l-1 1H345v62h46.5q6.8 2.3 10.5 7.5l3 8v5l-3 7-4.5 4.5-6 3h-258l-5-2-5.5-5.5-3-7v-7l5.5-9.5 8-4H180v-62H71.5l-1-1-8-1-9-4-9-6-5.5-5.5-10-16-3-9v-6l-1-1v-92l.5-.5 4 4 12 8 18.5 9.5v70l3 7 5.5 5.5 5 2h378q6.8-2.3 10.5-7.5l3-8v-261l-3-8-5.5-5.5-5-2h-188l-1.5-1.5-6-14-12-18-.5-2.5zM214 401v62h96v-62h-96z"
      />
      <path
        fill="var(--clrPrm)"
        stroke="var(--clrPrm)"
        d="M105.5 0h28l1 1h6.5q-.8 2.6 1 3.5v4l1 1v3l1 1v3l1 1v3l2 6 7 12 6.5 6.5 7 5 12 5q4-1 5 1h12l1-1h4l4-2h3l7-3h3L230 66.5l6 12 3 10-15 15-7 12-1 6-1 1v4l-1 1v13l1 1v4l3 9 4 7 17 18-8 20-12.5 18.5-9-3h-3l-4-2h-3l-1-1h-16l-14 5-12.5 9.5-5 7-5 10v3l-3 9-1 7-1 1v3.5h-8.5l-1 1h-24l-1-1H99l-1-2.5v-3l-1-1v-3l-1-1-1-8-3-9-6-10-8.5-8.5-13-7h-3l-5-2h-16l-4 2h-3l-12 4L11 203.5l-7-14-1-5-2-3v-3l12-11 7-10 3-7 1-6 1-1v-4l1-1v-9l-1-1-1-9-5-11q-7.4-11.6-18-20v-2l10-22 9-13V50l7.5 1 7 3 8 1 1 1h11q1.3-2.3 6-1l10-5h2L85 39.5l7-11 3-9v-3l1-1v-4l2-5v-4L99.5 1q4.8 1.3 6-1zm8.5 98l-6 2-9 5-9 10-5 12v14q2 0 1 4l4 9 3 4 5 4 8 5 6 2h5l1 1 14-2 8-4 4-4h1v-1q5-5 8-12l1-7 1-1v-9q-2-1-1-5l-2-6-6-9q-5-7-13-10l-6-2h-13z"
      />
    </svg>
  );
};

export const personalize = (props) => {
  return (
    <svg viewBox="0 0 500 500" {...props}>
      <path
        stroke="currentColor"
        fill="currentColor"
        d="M449.95 39.46c3.99-.83 8.16-1.78 12.22-.8 5.49 1.38 11.18 3.89 14.17 8.98 4.85 7.83 3.75 17.6 1.21 26.02-6.16 20.19-17.58 38.2-29.21 55.62-24.35 35.07-51.89 67.84-80.51 99.44-3.08 4.23-7.21 7.53-10.43 11.64-3.64 4.69-8.34 8.4-12.08 12.99-4.88 6.06-10.81 11.15-16 16.92-2.33 3-4.95 5.75-7.66 8.4l-44.02 44.03c-8.61 8.78-18.19 16.49-27.16 24.88-12.11 9.74-24.12 20.08-38.52 26.3-2.15 1.28-4.63.58-6.94.4.05-3.33.3-6.75-.71-9.98l-.53-2.66-1.03-3.1c-1.1-2.26-2.19-4.53-3.46-6.7 1.1-1.95 2.21-4.04 4.25-5.17 13.79-8.14 25.98-18.66 37.86-29.32 6.1-6.6 13.33-11.98 19.52-18.48 8.16-7.52 15.84-15.52 23.63-23.43 10.14-10.81 21.16-20.79 30.83-32.05 10.28-10.1 19.67-21.02 29.49-31.54 26.94-30.26 53.17-61.26 76.78-94.21 9.24-13.65 18.54-27.33 25.97-42.06.92-2.06 1.64-4.21 2.39-6.34-10.03 2.88-18.56 9.14-27.41 14.43-39.57 25.13-75.24 55.75-110.49 86.49-5.51 5.49-11.55 10.4-17.09 15.85-5.25 4.07-9.53 9.2-14.76 13.29-7.87 7.11-14.84 15.18-23.05 21.92l-37.53 37.42c-14.75 16.31-30.44 31.96-42.75 50.31-2.07 3.03-3.51 6.52-6.08 9.19-1.73.61-3.57.73-5.37.94-.21-.07-.63-.23-.84-.31l-4.25-1.56-1.75-.47-3.97-1.17c-3.67-.79-7.61-1.12-11.2.17-.1-4.72 2.12-9 4.1-13.14 9.86-18.08 23.91-33.32 37.35-48.73 5.05-5.24 10.48-10.13 15.01-15.85l28-28.13c9.93-8.4 18.6-18.15 28.14-26.96 5.48-4.09 9.69-9.58 15.09-13.75 4.6-3.76 8.31-8.48 13.09-12.03 39.79-35.51 80.45-70.53 125.54-99.3 12.57-7.67 25.63-15.21 40.16-18.39z"
      />
      <path
        fill="var(--clrPrm)"
        stroke="var(--clrPrm)"
        d="M143.47 315.74c3.59-1.29 7.53-.96 11.2-.17l3.97 1.17 1.75.47 4.25 1.56.84.31c3.41 2.71 7.71 4.54 9.98 8.45 4.85 3.76 8.96 8.4 13.18 12.84.65 1.31 1.67 2.33 2.98 2.99 2.91 2.47 5.74 5.14 7.67 8.48 1.27 2.17 2.36 4.44 3.46 6.7l1.03 3.1.53 2.66c1.01 3.23.76 6.65.71 9.98l-.94 2.26c-.35 2.29.64 5.01-.94 6.97-.26 1.66.25 3.61-.97 5-.21 1.34-.07 2.81-.89 3.99-.25 1.02-.58 2.02-1 3-.33 1.77-1.17 3.37-2.03 4.94-.42 2.22-1.55 4.18-2.56 6.17-.69 1.32-1.34 2.67-1.95 4.04-2.11 3.81-4.94 7.17-7.02 11-2.89 2.54-4.53 6.13-7.48 8.61-3.03 2.59-5.29 6.17-8.89 8.02l-3.73 3.44c-2.52 1.34-4.77 3.1-7.17 4.62l-2.08.86c-1.96 1.13-3.84 2.4-5.75 3.61-1.38.54-2.75 1.08-4.19 1.42l-1.99 1.06c-1.69.6-3.38 1.18-4.99 1.95-.96.42-1.94.77-2.95 1.05a45.67 45.67 0 0 1-2.99 1.01c-1.51.93-3.32.65-4.99.82-1.1 1.01-2.66.81-4.01 1.08-1.77 1.24-3.99.67-5.99.89-3.91 2.05-8.73.31-13.01.99-1.37 1.27-3.71 1.42-5.03-.01-3.92-.66-8.49 1.08-11.99-.99-1.99-.29-4.37.53-6-.96-1.67-.25-3.62.28-4.99-.95-1.35-.22-2.84-.06-4-.91-1.03-.24-2.03-.56-3-.98-1.03-.25-2.03-.58-3-1-1.02-.26-2.02-.58-2.99-.98-1.77-.36-3.37-1.19-4.95-2.03-2.51-.51-4.72-1.84-6.96-3.01l-2.05-.93c-1.63-1.04-3.21-2.17-4.94-3.05-3.56-1.98-6.68-4.65-10.27-6.57-1.55-1.46-2.93-3.26-5.01-3.99-3.6-3.72-7.71-7.02-10.75-11.23l-.86-3c-1.06-1.8-1.18-4.27.08-6 .18-1.34.3-2.69.73-3.97 1.59-2.35 3.52-4.54 6.04-5.88 2.93-2.11 6.52-1.64 9.91-1.71 2.2-1.85 5.39-.55 8-1.01 1.4-1.19 3.37-.8 4.96-1.57 1.04-.57 2.1-1.12 3.17-1.63 9.87-4.03 15.86-13.35 21.11-22.11.97-1.69 2.09-3.27 3.03-4.97.99-2.53 2.72-4.65 3.99-7.03.97-1.68 2.07-3.28 2.98-5 .97-1.68 2.08-3.28 2.99-4.99 2.74-4.76 6.41-8.89 9.58-13.35 5.16-5.16 10-10.8 16.32-14.57 1.74-.87 3.32-2.02 4.98-3.03 1.61-.77 3.23-1.56 4.79-2.44 1.35-.6 2.71-1.15 4.13-1.56.99-.36 1.99-.69 3-1 1.59-.74 3.47-.52 4.99-1.46 1.35-.29 2.92-.03 4.01-1.08 1.65-.12 3.31-.21 4.96-.39m3.05 28.32c-1.3 1.4-3.34.78-5 1.07-.95.53-1.96.92-3.02 1.18a27.46 27.46 0 0 1-3.05.93l-4.08 1.98c-1.71.96-3.32 2.1-5.03 3.05-7.2 6.34-13.32 13.77-18.12 22.09l-.86 2.07c-1.06 1.63-2.2 3.22-3.12 4.93-.95 2.55-2.74 4.64-3.97 7.04-.98 1.68-2.13 3.26-3.01 5.01-1.37 2.48-3.18 4.7-4.54 7.19-1.43 1.58-3.18 2.98-4.01 5.01-4.37 4.27-8.24 9.29-13.33 12.69-1.25 1.1-2.51 2.21-3.94 3.08-1.47.65-2.93 1.32-4.43 1.91l-.02.47 2.44.89 1.99 1.23 2 .29c.97.52 1.99.88 3.08 1.08l2.05 1.14c1.63.58 3.44.55 4.96 1.43l1.93.35c1.74 1.51 4.41.1 6.07 1.75 3.59.66 7.87-1.1 11.01 1.04 1.67-.11 3.71.59 4.99-.89 3.33-.14 6.65 0 9.98-.14 1.59-1.73 4.34-.18 6.01-1.77l1.99-.32c1.48-1.01 3.39-.71 4.94-1.56 1.62-.76 3.3-1.35 4.97-1.97l5.99-3.03 2.04-.93c9.83-6.22 18.74-14.41 24.29-24.75.55-1.1 1.29-2.08 2.04-3.03.25-1.02.54-2.02.86-3.01l1.15-1.97c.22-1.06.52-2.09.92-3.09.29-1.02.62-2.01 1-2.99.2-1.1.61-2.1 1.21-3.02l.2-3.98c1.8-2.28.57-5.47.89-8.13l-24.39-24.4c-1.7 0-3.39.02-5.08.08z"
      />
    </svg>
  );
};

export const terminal = (props) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 13H16V6H2C0.9 6 0 6.9 0 8V13Z" fill="#CCCCCC" />
      <path d="M32 6H16V13H32V6Z" fill="#999999" />
      <path d="M48 13H32V6H46C47.1 6 48 6.9 48 8V13Z" fill="#666666" />
      <path
        d="M46 42H2C0.9 42 0 41.1 0 40V12H48V40C48 41.1 47.1 42 46 42Z"
        fill="url(#paint0_linear)"
      />
      <g filter="url(#filter0_dd)">
        <path
          d="M15.2 24.3L6.39999 33.1C5.89999 33.6 5.89999 34.3 6.39999 34.7L8.19999 36.5C8.69999 37 9.4 37 9.8 36.5L18.6 27.7C19.1 27.2 19.1 26.5 18.6 26.1L16.8 24.3C16.4 23.9 15.6 23.9 15.2 24.3Z"
          fill="url(#paint1_linear)"
        />
        <mask
          id="mask0"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x="6"
          y="24"
          width="13"
          height="13"
        >
          <path
            d="M15.2 24.3L6.39999 33.1C5.89999 33.6 5.89999 34.3 6.39999 34.7L8.19999 36.5C8.69999 37 9.4 37 9.8 36.5L18.6 27.7C19.1 27.2 19.1 26.5 18.6 26.1L16.8 24.3C16.4 23.9 15.6 23.9 15.2 24.3Z"
            fill="url(#paint2_linear)"
          />
        </mask>
        <g mask="url(#mask0)">
          <g filter="url(#filter1_dd)">
            <path
              d="M9.8 17.3L18.6 26.1C19.1 26.6 19.1 27.3 18.6 27.7L16.8 29.5C16.3 30 15.6 30 15.2 29.5L6.39999 20.7C5.89999 20.2 5.89999 19.5 6.39999 19.1L8.19999 17.3C8.59999 16.9 9.4 16.9 9.8 17.3Z"
              fill="url(#paint3_linear)"
            />
          </g>
        </g>
        <path
          d="M9.8 17.3L18.6 26.1C19.1 26.6 19.1 27.3 18.6 27.7L16.8 29.5C16.3 30 15.6 30 15.2 29.5L6.39999 20.7C5.89999 20.2 5.89999 19.5 6.39999 19.1L8.19999 17.3C8.59999 16.9 9.4 16.9 9.8 17.3Z"
          fill="url(#paint4_linear)"
        />
      </g>
      <g filter="url(#filter2_dd)">
        <path
          d="M40 32H24C23.4 32 23 32.4 23 33V36C23 36.6 23.4 37 24 37H40C40.6 37 41 36.6 41 36V33C41 32.4 40.6 32 40 32Z"
          fill="url(#paint5_linear)"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd"
          x="3.02499"
          y="15"
          width="18.95"
          height="25.875"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow"
            result="effect2_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_dd"
          x="3.02499"
          y="15"
          width="18.95"
          height="18.875"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow"
            result="effect2_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_dd"
          x="20"
          y="30"
          width="24"
          height="11"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow"
            result="effect2_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear"
          x1="36.4462"
          y1="47.8257"
          x2="11.8217"
          y2="5.1748"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#333333" />
          <stop offset="1" stop-color="#4D4D4D" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="14.5276"
          y1="33.9959"
          x2="10.4841"
          y2="26.9924"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#999999" />
          <stop offset="1" stop-color="#B3B3B3" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="14.5276"
          y1="33.9959"
          x2="10.4841"
          y2="26.9924"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#999999" />
          <stop offset="1" stop-color="#B3B3B3" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="16.2747"
          y1="30.0336"
          x2="8.73699"
          y2="16.9781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#CCCCCC" />
          <stop offset="1" stop-color="#E6E6E6" />
        </linearGradient>
        <linearGradient
          id="paint4_linear"
          x1="16.2747"
          y1="30.0336"
          x2="8.73699"
          y2="16.9781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#CCCCCC" />
          <stop offset="1" stop-color="#E6E6E6" />
        </linearGradient>
        <linearGradient
          id="paint5_linear"
          x1="35.1496"
          y1="39.9553"
          x2="28.8504"
          y2="29.0447"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#CCCCCC" />
          <stop offset="1" stop-color="#E6E6E6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const info = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
      <path
        fill="#0078d7"
        d="M27.34 3.45c7.1-1.02 14.61.32 20.59 4.4 8.03 5.14 13.14 14.6 12.91 24.15.27 10.76-6.27 21.26-15.95 25.91-9.25 4.63-21.06 3.84-29.49-2.22-8.32-5.6-13.09-15.91-12.18-25.88C3.8 16.8 14.5 5.29 27.34 3.45M30 14v4h4v-4h-4m0 8v28h4V22h-4z"
      />
      <path d="M30 14h4v4h-4v-4zm0 8h4v28h-4V22z" fill="#fff" />
    </svg>
  );
};

export const taskSearch = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -1 26 26"
      height="28"
      width="28"
    >
      <circle cx="13" cy="11" r="8" fill="#ffffff24"></circle>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="13" cy="11" r="8"></circle>
        <path d="M3 21l4-4" strokeLinecap="round"></path>
      </g>
    </svg>
  );
};

export const share = (props) => {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <path
        stroke="#6c6c6c"
        fill="none"
        d="M 50.99498,39.698467 C 50.99498,55.601215 51.027637,55.467502 26.349219,55.467502 1.6708225,55.467502 1.6708225,55.467502 1.6708225,30.806405 1.6708225,6.1453082 1.7376982,6.1568376 24.209191,6.1568376"
      />
      <path
        stroke="currentColor"
        fill="none"
        d="M 13.265014,38.105491 C 13.265014,38.105491 17.727881,12.168084 38.213436,12.168084 L 38.247244,1.5999704 56.138308,19.456214 38.410423,36.002241 V 24.971557 C 38.410423,24.971557 17.985634,23.404153 13.265023,38.105491 Z"
      />
    </svg>
  );
};

export const socialmedia = (props) => {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <path
        d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
        fill="currentColor"
      />
    </svg>
  );
};
