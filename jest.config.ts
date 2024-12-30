module.exports = {
    collectCoverage: true, 
    collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}", 
      "!src/**/*.d.ts", 
      "!src/index.tsx", 
      "!src/reportWebVitals.ts" 
    ],
    coverageDirectory: "./coverage", 
    coverageReporters: ["text", "lcov", "html"], 
  };
  