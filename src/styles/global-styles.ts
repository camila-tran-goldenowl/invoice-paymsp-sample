import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
html,
body {
  height: 100%;
  width: 100%;
}

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
  }
  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  flex{
    display: flex;
  }

  flex-center{
    align-item: center;
    justify-content: center;
  }

  @media print {

    html,
    body,
    #root {
      height: auto;
      width: auto;
    }
  
    @page {
      size: auto;
      margin: 0;
    }

    body * {
      visibility: hidden;
    }
    .section-to-print,
    .section-to-print * {
      page-break-after: "always";
      visibility: visible;
    }

    .section-to-print > .section-hide-to-print {
      display: none !important;
    }
  }

`;
