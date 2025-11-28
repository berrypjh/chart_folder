'use client';

import React, { useState, useEffect } from 'react';
import { BarChart } from '@my-chart/react';
import { SALES_DATA } from '@my-chart/shared-data';

function DemoWelcome(): React.ReactNode {
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth < 768 ? window.innerWidth - 40 : 600);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="wrapper">
      <div className="container">
        <header className="header">
          <h1>2D Chart Library Demo (Web)</h1>
          <p>Core Logic shared with React Native</p>
        </header>

        <div className="card">
          <h2>Monthly Sales</h2>
          <div className="chart-container">
            <BarChart width={chartWidth} height={300} data={SALES_DATA} />
          </div>
          <div className="legend">
            <span className="dot"></span> Revenue
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .wrapper {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem;
          display: flex;
          justify-content: center;
        }
        .container {
          max-width: 800px;
          width: 100%;
        }
        .header {
          margin-bottom: 2rem;
          text-align: center;
        }
        .card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .chart-container {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }
        .legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        .dot {
          width: 10px;
          height: 10px;
          background-color: #3b82f6;
          border-radius: 50%;
        }
      `,
        }}
      />
    </div>
  );
}

export default DemoWelcome;
