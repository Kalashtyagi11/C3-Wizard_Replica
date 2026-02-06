import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LabelList,
} from 'recharts';
import PropTypes from 'prop-types';

const monthMap = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
};

const darkDistinctColors = [
  '#1f77b4', // dark blue
  '#ff7f0e', // dark orange
  '#2ca02c', // dark green
  '#d62728', // dark red
  '#9467bd', // dark purple
  '#8c564b', // brown
  '#e377c2', // dark pink
  '#7f7f7f', // grey
  '#bcbd22', // olive
  '#17becf', // teal
  '#393b79', // deep indigo
  '#637939', // army green
  '#8c6d31', // cocoa brown
  '#843c39', // burgundy
  '#7b4173', // plum
  '#a5b4bc', // slate gray
  '#6c5b7b', // mauve
  '#f1c40f', // golden yellow
  '#27ae60', // emerald green
  '#e74c3c', // vivid red
  '#f39c12', // sun yellow
  '#9b59b6', // amethyst purple
];

const getColorByYear = (year, type = 'paid') => {
  const index = parseInt(year, 10) % darkDistinctColors.length;

  // For paid/unpaid, offset to avoid overlap
  return type === 'paid'
    ? darkDistinctColors[index]
    : darkDistinctColors[(index + 5) % darkDistinctColors.length]; // offset unpaid
};

const CustomTooltip = ({ active, payload, label, hoveredLineKey }) => {
  //
  if (!active || !payload) return null;

  const hoveredItem = payload.find((item) => item.dataKey === hoveredLineKey);

  if (!hoveredItem) return null;
  const [type, year9] = hoveredItem.name.split(' ');

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
      <strong>{label}</strong>
      <br />
      <span style={{ color: hoveredItem.color }}>
        {type} {year9}: {hoveredItem.value}
      </span>
    </div>
  );
};

const PaymentChart = ({ month, year, compare, graphSummary, selfGraphSummary }) => {
  const [hoveredLineKey, setHoveredLineKey] = useState(null);
  // Separate data for company and dir
  const [companyData, setCompanyData] = useState([]);
  const [dirData, setDirData] = useState([]);
  const [selfGraph, setSelfGraph] = useState([]);

  //const minYear = Math.min(...year.map(Number));
  //const maxYear = Math.max(...year.map(Number));

  const getDataHandler = () => {
    //========================================
    // const allMonths = Object.values(monthMap); // ["Jan", "Feb", ...]
    // const company = [];

    // year.forEach((yr) => {
    //   allMonths.forEach((month1) => {
    //     const row = {
    //       month: month1,  // Separate month
    //       year: yr        // Separate year
    //     };

    //     const totals = graphSummary.reduce(
    //       (acc, i) => {
    //         if (
    //           monthMap[i.periodMonth] === month1 &&
    //           i.types === "company" &&
    //           i.year === yr &&
    //           month.includes(i.periodMonth)
    //         ) {
    //           acc.Paid += compare === "Amount" ? i.totalPaid || 0 : i.paidEmployer || 0;
    //           acc.Unpaid += compare === "Amount" ? i.totalUnpaid || 0 : i.unPaidEmployer || 0;
    //         }
    //         return acc;
    //       },
    //       { Paid: 0, Unpaid: 0 }
    //     );

    //     row[`Paid_${yr}`] = totals.Paid;
    //     row[`Unpaid_${yr}`] = totals.Unpaid;

    //     company.push(row);
    //   });
    // });

    // const monthOrderArr = Object.values(monthMap);

    // // Sort the company array month-wise, then year-wise (optional)
    // company.sort((a, b) => {
    //   const monthCompare = monthOrderArr.indexOf(a.month) - monthOrderArr.indexOf(b.month);
    //   return monthCompare !== 0 ? monthCompare : a.year - b.year;
    // });

    //=============================================multiplebars==============
    const allMonths = Object.values(monthMap); // ["Jan", "Feb", ...]
    const company = [];
    const nwdir = [];
    const self = [];

    year.forEach((yr) => {
      allMonths.forEach((month1) => {
        const row = {
          month: month1, // Separate month
          year: yr,
        };

        const totals = graphSummary.reduce(
          (acc, i) => {
            if (
              monthMap[i.periodMonth] === month1 &&
              i.types === 'company' &&
              i.year === yr &&
              month.includes(i.periodMonth)
            ) {
              acc.Paid += compare === 'Amount' ? i.totalPaid || 0 : i.paidEmployer || 0;
              acc.Unpaid += compare === 'Amount' ? i.totalUnpaid || 0 : i.unPaidEmployer || 0;
            }
            return acc;
          },
          { Paid: 0, Unpaid: 0 },
        );

        company.push({
          month: month1,
          year: yr,
          Paid: totals.Paid,
          Unpaid: totals.Unpaid,
        });

        const dirtotals = graphSummary.reduce(
          (acc, i) => {
            if (
              monthMap[i.periodMonth] === month1 &&
              i.types === 'dir' &&
              i.year === yr &&
              month.includes(i.periodMonth)
            ) {
              acc.Paid += compare === 'Amount' ? i.totalPaid || 0 : i.paidEmployer || 0;
              acc.Unpaid += compare === 'Amount' ? i.totalUnpaid || 0 : i.unPaidEmployer || 0;
            }
            return acc;
          },
          { Paid: 0, Unpaid: 0 },
        );

        nwdir.push({
          month: month1,
          year: yr,
          Paid: dirtotals.Paid,
          Unpaid: dirtotals.Unpaid,
        });

        const selftotals = selfGraphSummary.reduce(
          (acc, i) => {
            if (
              monthMap[i.periodMonth] === month1 &&
              i.year === yr &&
              month.includes(i.periodMonth)
            ) {
              acc.Paid += compare === 'Amount' ? i.paid || 0 : i.paidEmployer || 0;
              acc.Unpaid += compare === 'Amount' ? i.unpaid || 0 : i.unPaidEmployer || 0;
            }
            return acc;
          },
          { Paid: 0, Unpaid: 0 },
        );

        self.push({
          month: month1,
          year: yr,
          Paid: selftotals.Paid,
          Unpaid: selftotals.Unpaid,
        });
      });
    });

    company.sort((a, b) => {
      const monthCompare = allMonths.indexOf(a.month) - allMonths.indexOf(b.month);
      return monthCompare !== 0 ? monthCompare : a.year - b.year;
    });

    nwdir.sort((a, b) => {
      const monthCompare = allMonths.indexOf(a.month) - allMonths.indexOf(b.month);
      return monthCompare !== 0 ? monthCompare : a.year - b.year;
    });

    self.sort((a, b) => {
      const monthCompare = allMonths.indexOf(a.month) - allMonths.indexOf(b.month);
      return monthCompare !== 0 ? monthCompare : a.year - b.year;
    });

    // const dir = allMonths.map((month1) => {
    //   const row = { month1 }; // x-axis key

    //   year.forEach((yr) => {
    //     const totals = graphSummary.reduce(
    //       (acc, i) => {
    //         if (
    //           monthMap[i.periodMonth] === month1 &&
    //           i.types === "dir" &&
    //           i.year === yr &&
    //           month.includes(i.periodMonth)
    //         ) {
    //           acc.Paid += compare === "Amount" ? i.totalPaid || 0 : i.paidEmployer || 0;
    //           acc.Unpaid += compare === "Amount" ? i.totalUnpaid || 0 : i.unPaidEmployer || 0;
    //         }
    //         return acc;
    //       },
    //       { Paid: 0, Unpaid: 0 }
    //     );

    //     row[`Paid_${yr}`] = totals.Paid;
    //     row[`Unpaid_${yr}`] = totals.Unpaid;
    //   });

    //   return row;
    // });

    // const self = allMonths.map((month1) => {
    //   const row = { month1 }; // x-axis key

    //   year.forEach((yr) => {
    //     const totals = selfGraphSummary.reduce(
    //       (acc, i) => {
    //         if (
    //           monthMap[i.periodMonth] === month1 &&
    //           i.year === yr &&
    //           month.includes(i.periodMonth)
    //         ) {
    //           acc.Paid += compare === "Amount" ? i.paid || 0 : i.paidEmployer || 0;
    //           acc.Unpaid += compare === "Amount" ? i.unpaid || 0 : i.unPaidEmployer || 0;
    //         }
    //         return acc;
    //       },
    //       { Paid: 0, Unpaid: 0 }
    //     );

    //     row[`Paid_${yr}`] = totals.Paid;
    //     row[`Unpaid_${yr}`] = totals.Unpaid;
    //   });

    //   return row;
    // });

    setCompanyData(company);
    setDirData(nwdir);
    setSelfGraph(self);
  };

  useEffect(() => {
    getDataHandler();
  }, [month, year, compare, graphSummary]);

  //=====================================================only month show jo db se get honge
  // const companyData = graphSummary
  //   .filter((item) => item.types === "company")
  //   .map((item) => ({
  //     month: monthMap[item.periodMonth] || item.periodMonth,
  //     Paid: item.totalPaid,
  //     Unpaid: item.totalUnpaid,
  //     type: "Company",
  //   }));

  // const dirData = graphSummary
  //   .filter((item) => item.types === "dir")
  //   .map((item) => ({
  //     month: monthMap[item.periodMonth] || item.periodMonth,
  //     Paid: item.totalPaid,
  //     Unpaid: item.totalUnpaid,
  //     type: "Dir",
  //   }));

  //const selfGraph = selfGraphSummary.map(item=>({month: monthMap[item.periodMonth] || item.periodMonth,Paid:item.totalPaid,Unpaid:item.totalUnpaid}))

  //=====================================

  return (
    <div className="col-xl-12 mt-4">
      <div className="card mb-4">
        <div className="card-header bg_ligh py-3 bg_light">
          <h4 className="header-title mb-0 text-success">
            <i className="far fa-money-bill-alt f-18"></i> Employer Payment Overview (
            {year.join(',')})
          </h4>
        </div>
        <div className="card-body bg-white">
          <div className="row align-items-center">
            <div className="col-xl-12">
              {/* <h5 className="text-primary mb-3" style={{ fontWeight: "bold" }}>Employer</h5> */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                {/* <BarChart  // multiple bars 
                  width={900}  
                  height={600}
                  data={companyData}
                  layout="horizontal"
                  barCategoryGap={10}
                  margin={{ top: 0, right: 0, left: -10, bottom: 100 }}  
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    type="category"
                    dataKey={(d) => `${d.month} ${d.year}`}
                    angle={-90}  s
                    textAnchor="end"  
                    dy={10}  
                    interval={0}  n
                  />

                  <YAxis type="number" allowDecimals={false} />

                  <Tooltip cursor={false} content={<CustomTooltip hoveredLineKey={hoveredLineKey} />} />

                  <Legend
                    wrapperStyle={{
                      top: 530,  
                    }}
                  />

                  {year.map((yr) => (
                    <React.Fragment key={yr}>
                      <Bar
                        dataKey={`Paid_${yr}`}
                        fill={getColorByYear(yr, "paid")}
                        name={`Paid ${yr}`}
                        barSize={40}
                        onMouseOver={() => setHoveredLineKey(`Paid_${yr}`)}
                      />
                      <Bar
                        dataKey={`Unpaid_${yr}`}
                        fill={getColorByYear(yr, "unpaid")}
                        name={`Unpaid ${yr}`}
                        barSize={20}
                        onMouseOver={() => setHoveredLineKey(`Unpaid_${yr}`)}
                      />
                    </React.Fragment>
                  ))}
                </BarChart> */}

                <BarChart
                  width={1000}
                  height={600}
                  data={companyData}
                  layout="horizontal"
                  barCategoryGap={10}
                  margin={{ top: 0, right: 0, left: -10, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* Adjust XAxis for rotated labels with enough space */}
                  <XAxis
                    type="category"
                    dataKey={(d) => `${d.month} ${d.year}`}
                    angle={-90}
                    textAnchor="end"
                    dy={10}
                    interval={0}
                  />

                  <YAxis type="number" padding={{ top: 50 }} allowDecimals={false} />

                  <Tooltip
                    cursor={false}
                    content={<CustomTooltip hoveredLineKey={hoveredLineKey} />}
                  />

                  <Legend
                    wrapperStyle={{
                      top: 530,
                    }}
                  />

                  {/* Render a single pair of bars (Paid and Unpaid) for each month */}
                  {['Paid', 'Unpaid'].map((type) => (
                    <Bar
                      key={type}
                      dataKey={type}
                      fill={type === 'Paid' ? '#82ca9d' : '#8884d8'}
                      name={type}
                      barSize={40}
                      onMouseOver={() => setHoveredLineKey(type)}
                    >
                      <LabelList
                        dataKey={type}
                        position="top" // Position the label on top of the bar
                        content={({ x, y, width, height, value }) => {
                          // Only show label if the value is greater than 0
                          if (value > 0) {
                            return (
                              <text
                                x={x - 4}
                                y={y - 22}
                                transform={`rotate(-90, ${x}, ${y - 30})`}
                                textAnchor="middle"
                                fill="#000"
                                fontSize="14"
                              >
                                {value}
                              </text>
                            );
                          }
                          return null; // Don't show label if value is not greater than 0
                        }}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header py-3 bg_ligh bg_light">
          <h4 className="header-title mb-0 text-success">
            <i className="far fa-money-bill-alt f-18"></i> NW Director Payment Overview (
            {year.join(',')})
          </h4>
        </div>
        <div className="card-body bg-white">
          {/* <h5 className="text-danger mb-4" style={{ fontWeight: "bold" }}>NW Director</h5> */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <BarChart
              width={1000}
              height={600}
              data={dirData}
              layout="horizontal"
              barCategoryGap={10}
              margin={{ top: 0, right: 0, left: -10, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* Adjust XAxis for rotated labels with enough space */}
              <XAxis
                type="category"
                dataKey={(d) => `${d.month} ${d.year}`}
                angle={-90}
                textAnchor="end"
                dy={10}
                interval={0}
              />

              <YAxis type="number" padding={{ top: 50 }} allowDecimals={false} />

              <Tooltip cursor={false} content={<CustomTooltip hoveredLineKey={hoveredLineKey} />} />

              <Legend
                wrapperStyle={{
                  top: 530,
                }}
              />

              {/* Render a single pair of bars (Paid and Unpaid) for each month */}
              {['Paid', 'Unpaid'].map((type) => (
                <Bar
                  key={type}
                  dataKey={type}
                  fill={type === 'Paid' ? '#82ca9d' : '#8884d8'}
                  name={type}
                  barSize={40}
                  onMouseOver={() => setHoveredLineKey(type)}
                >
                  <LabelList
                    dataKey={type}
                    position="top" // Position the label on top of the bar
                    content={({ x, y, width, height, value }) => {
                      // Only show label if the value is greater than 0
                      if (value > 0) {
                        return (
                          <text
                            x={x - 4}
                            y={y - 22}
                            transform={`rotate(-90, ${x}, ${y - 30})`}
                            textAnchor="middle"
                            fill="#000"
                            fontSize="14"
                          >
                            {value}
                          </text>
                        );
                      }
                      return null; // Don't show label if value is not greater than 0
                    }}
                  />
                </Bar>
              ))}
            </BarChart>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header py-3 bg_ligh bg_light">
          <h4 className="header-title mb-0 text-success">
            <i className="far fa-money-bill-alt f-18"></i> Self Employed Payment Overview (
            {year.join(',')})
          </h4>
        </div>
        <div className="card-body bg-white">
          {/* <h5 className="text-warning mb-4" style={{ fontWeight: "bold", color: "#bb9600" }}>Self Employed</h5> */}
          {/* <AreaChart width={600} height={200} data={selfGraph} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month1" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip hoveredLineKey={hoveredLineKey} />} />
                <Legend />
                {year.map((yr) => {
                  return (
                    <React.Fragment key={yr}>
                      {/* <Area
                        type="monotone"
                        dataKey={`Paid_${yr}`}
                        stroke={getColorByYear(yr, "paid")}
                        fill="none"
                        fillOpacity={0.3}
                        name={`Paid ${yr}`}
                        strokeWidth={1.5}
                      />
                      <Area
                        type="monotone"
                        dataKey={`Unpaid_${yr}`}
                        stroke={getColorByYear(yr, "unpaid")}
                        fill="none"
                        fillOpacity={0.3}
                        name={`Unpaid ${yr}`}
                        strokeWidth={1.5}
                      /> 
                       <Area
                        type="monotone" dataKey={`Paid_${yr}`} stroke={getColorByYear(yr, "paid")}
                        fill="none" fillOpacity={0.3} name={`Paid ${yr}`} strokeWidth={1.5}
                        activeDot={{
                          onMouseOver: () => setHoveredLineKey(`Paid_${yr}`),
                        }} />

                      <Area type="monotone" dataKey={`Unpaid_${yr}`}
                        stroke={getColorByYear(yr, "unpaid")}
                        fill="none" fillOpacity={0.3} name={`Unpaid ${yr}`} strokeWidth={1.5}
                        activeDot={{
                          onMouseOver: () => setHoveredLineKey(`Unpaid_${yr}`),
                        }} />
                    </React.Fragment>
                  );
                })}


              </AreaChart> /} */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <BarChart
              width={1000}
              height={600}
              data={selfGraph}
              layout="horizontal"
              barCategoryGap={10}
              margin={{ top: 0, right: 0, left: -10, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* Adjust XAxis for rotated labels with enough space */}
              <XAxis
                type="category"
                dataKey={(d) => `${d.month} ${d.year}`}
                angle={-90}
                textAnchor="end"
                dy={10}
                interval={0}
              />

              <YAxis type="number" padding={{ top: 50 }} allowDecimals={false} />

              <Tooltip cursor={false} content={<CustomTooltip hoveredLineKey={hoveredLineKey} />} />

              <Legend
                wrapperStyle={{
                  top: 530,
                }}
              />

              {/* Render a single pair of bars (Paid and Unpaid) for each month */}
              {['Paid', 'Unpaid'].map((type) => (
                <Bar
                  key={type}
                  dataKey={type}
                  fill={type === 'Paid' ? '#82ca9d' : '#8884d8'}
                  name={type}
                  barSize={40}
                  onMouseOver={() => setHoveredLineKey(type)}
                >
                  <LabelList
                    dataKey={type}
                    position="top" // Position the label on top of the bar
                    content={({ x, y, width, height, value }) => {
                      // Only show label if the value is greater than 0
                      if (value > 0) {
                        // return <text x={x - 4} y={y - 22} transform={`rotate(-90, ${x }, ${y - 30})`} textAnchor="middle" fill="#000" fontSize="14">{value}</text>;
                        return (
                          <text
                            x={x - 15}
                            y={y - 22}
                            transform={`rotate(-90, ${x}, ${y - 30})`}
                            textAnchor="middle"
                            fill="#000"
                            fontSize="14"
                          >
                            {value}
                          </text>
                        );
                      }
                      return null; // Don't show label if value is not greater than 0
                    }}
                  />
                </Bar>
              ))}
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentChart.propTypes = {
  graphSummary: PropTypes.array.isRequired,
  selfGraphSummary: PropTypes.array.isRequired,
  year: PropTypes.array.isRequired,
  month: PropTypes.array.isRequired,
  compare: PropTypes.string.isRequired,
};
CustomTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  hoveredLineKey: PropTypes.string,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};
export default PaymentChart;

// const company = allMonths.map((month1) => {  // multi line graph
//   const row = { month1 }; // x-axis key

//   year.forEach((yr) => {
//     const totals = graphSummary.reduce(
//       (acc, i) => {
//         if (
//           monthMap[i.periodMonth] === month1 &&
//           i.types === "company" &&
//           i.year === yr &&
//           month.includes(i.periodMonth)
//         ) {
//           acc.Paid += compare === "Amount" ? i.totalPaid || 0 : i.paidEmployer || 0;
//           acc.Unpaid += compare === "Amount" ? i.totalUnpaid || 0 : i.unPaidEmployer || 0;
//         }
//         return acc;
//       },
//       { Paid: 0, Unpaid: 0 }
//     );

//     row[`Paid_${yr}`] = totals.Paid;
//     row[`Unpaid_${yr}`] = totals.Unpaid;
//   });

//   return row;
// });

// {/* <AreaChart width={600} height={200} data={companyData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month1" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip content={<CustomTooltip hoveredLineKey={hoveredLineKey} />} />
//                 <Legend />
//                 {year.map((yr) => {
//                   return (
//                     <React.Fragment key={yr}>

//                       <Area
//                         type="monotone" dataKey={`Paid_${yr}`} stroke={getColorByYear(yr, "paid")}
//                         fill="none" fillOpacity={0.3} name={`Paid ${yr}`} strokeWidth={1.5}
//                         activeDot={{
//                           onMouseOver: () => setHoveredLineKey(`Paid_${yr}`),
//                         }} />

//                       <Area type="monotone" dataKey={`Unpaid_${yr}`}
//                         stroke={getColorByYear(yr, "unpaid")}
//                         fill="none" fillOpacity={0.3} name={`Unpaid ${yr}`} strokeWidth={1.5}
//                         activeDot={{
//                           onMouseOver: () => setHoveredLineKey(`Unpaid_${yr}`),
//                         }} />
//                     </React.Fragment>
//                   );
//                 })}

//               </AreaChart> */}
