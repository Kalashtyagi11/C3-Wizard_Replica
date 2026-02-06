import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import company1 from '../../../../assets/images/users/Company_log.png';

const PaymentStatusList = ({ month, year, companyPaymentStatus, selfSummary }) => {
  const [filteredCompanyPaymentStatus, setFilteredCompanyPaymentStatus] =
    useState(companyPaymentStatus);
  const [filteredSelfPaymentStatus, setFilteredSelfPaymentStatus] = useState(companyPaymentStatus);

  const groupByPaymentStatus = () => {
    const paid = {};
    const unpaid = {};

    filteredCompanyPaymentStatus.forEach((item) => {
      const key = item.companyName + (item.types === 'dir' ? ' -(NW)' : '');
      const formattedMonth = `${new Date(`${item.periodMonth} 1, ${item.year}`).toLocaleString(
        'en-US',
        { month: 'short' },
      )}-${item.year}`;

      const group = item.paymentStatus === 'Paid' ? paid : unpaid;

      if (!group[key]) {
        group[key] = {
          logo: item.companyLogo || company1,
          months: [],
        };
      }

      if (!group[key].months.includes(formattedMonth)) {
        group[key].months.push(formattedMonth);
      }
    });

    return { paid, unpaid };
  };

  const groupByPaymentStatusSelf = () => {
    const Selfpaid = {};
    const Selfunpaid = {};

    filteredSelfPaymentStatus.forEach((item) => {
      const key = item.companyName;
      const formattedMonth = `${new Date(`${item.periodMonth} 1, ${item.year}`).toLocaleString(
        'en-US',
        { month: 'short' },
      )}-${item.year}`;

      const group = item.paymentStatus === 'Paid' ? Selfpaid : Selfunpaid;

      if (!group[key]) {
        group[key] = {
          logo: item.companyLogo || company1,
          months: [],
        };
      }

      if (!group[key].months.includes(formattedMonth)) {
        group[key].months.push(formattedMonth);
      }
    });

    return { Selfpaid, Selfunpaid };
  };

  const { paid, unpaid } = groupByPaymentStatus();
  const { Selfpaid, Selfunpaid } = groupByPaymentStatusSelf();

  const renderGroupedList = (groupData, statusClass, statusLabel, category) => {
    return Object.entries(groupData).map(([company, data], idx) => (
      <li className="activity-list activity-border" key={idx}>
        <div className="media">
          <div className="activity-icon avatar-sm">
            <img src={data.logo || company1} className="avatar-sm" alt="" />
          </div>
          <div className="me-3">
            <p className="text-muted font-size-14 mb-0 fw-bold">
              {category === 'nw' ? (
                <Link
                  to={`/admin-details/${
                    company.includes('-(NW)') ? `1${statusLabel}` : `2${statusLabel}`
                  }/${company.replace(' -(NW)', '')}/${year}/${month}`}
                  className="text-decoration-none text-muted font-size-14 mb-0 fw-bold"
                >
                  {company}
                </Link>
              ) : (
                <Link
                  to={`/admin-details/3${statusLabel}/${company}/${year}/${month}`}
                  className="text-decoration-none text-muted font-size-14 mb-0 fw-bold"
                >
                  {company}
                </Link>
              )}
            </p>
            <p className={`fw-bold small mt-1 ${statusClass}`}>{data.months.join(', ')}</p>
          </div>
          <div className="media-body">
            <div className="text-end d-none d-md-block">
              <span className={`${statusClass} fw-medium text-md`}>{statusLabel}</span>
            </div>
          </div>
        </div>
      </li>
    ));
  };

  useEffect(() => {
    //const filteredCompany = getLatestCompanyPayments(companyPaymentStatus);
    const filtered = companyPaymentStatus.filter(
      (item) => year.includes(item.year) && month.includes(item.periodMonth),
    );

    const filteredSelf = selfSummary?.filter(
      (company) => year.includes(company.year) && month.includes(company.periodMonth),
    );

    setFilteredCompanyPaymentStatus(filtered);
    setFilteredSelfPaymentStatus(filteredSelf);
  }, [month, year, companyPaymentStatus]);
  return (
    <>
      <style>
        {`
.activity-wid .activity-list {
    position: relative;
    padding: 0 0 13px 0px;
    width: 31%;
    float: left;
    margin: 0px 15px;
    margin-right: 0px;
    border: 1px solid #e3e3e3;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 6px;
}
.activity-wid .activity-list .activity-icon {
    position: inherit;
    margin-right: 10px;
}

.activity-wid .activity-list p{
margin-bottom: 0px;}

ul.list-unstyled.activity-wid.mb-4.mt-2.ms-0 {
    max-height: 400px;
    overflow: auto;
}
    
        `}
      </style>
      <div className="col-xl-12">
        <div className="card">
          <div className="card-header py-3 bg_ligh d-flex justify-content-between align-items-center">
            <h4 className="header-title mb-0 text-success">
              <i className="far fa-money-bill-alt f-18"></i> Employer & NW Director Payment Status
            </h4>
          </div>

          {/* Payment Status List */}
          <div className="card-body bg-white" style={{ overflowY: 'auto' }}>
            <ul className="list-unstyled activity-wid mb-4 mt-2 ms-0">
              {/* Paid List */}
              {renderGroupedList(paid, 'text-success', 'Paid', 'nw')}

              {/* Unpaid List */}
              {renderGroupedList(unpaid, 'text-danger', 'Unpaid', 'nw')}
            </ul>
          </div>

          <div className="card-header py-3 bg_ligh d-flex justify-content-between align-items-center">
            <h4 className="header-title mb-0 text-success">
              <i className="far fa-money-bill-alt f-18"></i> Self Payment Status
            </h4>
          </div>

          <div className="card-body bg-white" style={{ overflowY: 'auto' }}>
            <ul className="list-unstyled activity-wid mb-4 mt-2 ms-0">
              {/* Paid List */}
              {renderGroupedList(Selfpaid, 'text-success', 'Paid', 'self')}

              {/* Unpaid List */}
              {renderGroupedList(Selfunpaid, 'text-danger', 'Unpaid', 'self')}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

PaymentStatusList.propTypes = {
  companyPaymentStatus: PropTypes.array.isRequired,
  selfSummary: PropTypes.array.isRequired,
  year: PropTypes.array.isRequired,
  month: PropTypes.array.isRequired,
};

export default PaymentStatusList;

// import React,{ useState, useEffect } from 'react';
// import PropTypes from "prop-types";
// import { Modal, Button,Form  } from "react-bootstrap";
// import { Link } from 'react-router-dom';
// import company1 from '../../../../assets/images/users/Company_log.png';

// const PaymentStatusList = ({ companyPaymentStatus }) => {

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [filteredCompanyPaymentStatus, setFilteredCompanyPaymentStatus] = useState(companyPaymentStatus);

//   const styles = {
//     popup: {
//       backgroundColor: "#fff",
//       position: "absolute",
//       width: "100%",
//       zIndex: 99, // No need for quotes
//       top: "40px",
//       padding: "0px",

//       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//     },
//   };

//   const years = [...new Set(companyPaymentStatus.map(item => item.year))];
//   const months = [...new Set(companyPaymentStatus.map(item => item.periodMonth))];

//   const getLatestCompanyPayments = (data) => {
//     const monthOrder = {
//       "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
//       "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
//     };

//     const companyMap = new Map();

//     data.forEach((item) => {
//       if (!item.companyName) return;

//       const key = item.companyName;
//       const currentEntry = companyMap.get(key);

//       if (
//         !currentEntry ||
//         item.year > currentEntry.year ||
//         (item.year === currentEntry.year && monthOrder[item.periodMonth] > monthOrder[currentEntry.periodMonth])
//       ) {
//         companyMap.set(key, item);
//       }
//     });

//     return Array.from(companyMap.values());
//   };

//   const handleApplyFilter = () => {
//     setFilteredCompanyPaymentStatus(
//       getLatestCompanyPayments(companyPaymentStatus).filter((item) => (
//         (selectedYear ? item.year === selectedYear : true) &&
//         (selectedMonth ? item.periodMonth === selectedMonth : true) &&
//         (selectedStatus ? item.paymentStatus === selectedStatus : true)
//       ))
//     );
//     setIsOpen(false);
//   };
//   useEffect(() => {

//     const filteredCompany = getLatestCompanyPayments(companyPaymentStatus);
//     setFilteredCompanyPaymentStatus(filteredCompany);
//   }, [companyPaymentStatus]);
//   return (
//     <div className="col-xl-4">
//     <div className="card">
//       <div className="card-header py-3 bg_ligh d-flex justify-content-between align-items-center">
//         <h4 className="header-title mb-0 text-success">
//           <i className="far fa-money-bill-alt f-18"></i> Payment Status
//         </h4>
//         {/* Three dots dropdown */}
//         <button className="btn p-0" type="button" onClick={() => setIsOpen(!isOpen)}>
//           <i className="fas fa-ellipsis-v"></i>
//         </button>
//       </div>

//       {/* Dropdown Content */}
//       {isOpen && (
//         <div className="relative mt-40 ml-40 inline-block z-10" style={styles.popup}>
//           <Form>
//             <div className="p-3">
//               {/* Year Dropdown */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Select Year</Form.Label>
//                 <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
//                   <option value="">-- Select Year --</option>
//                   {years.map((year, index) => (
//                     <option key={index} value={year}>{year}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>

//               {/* Month Dropdown */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Select Month</Form.Label>
//                 <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
//                   <option value="">-- Select Month --</option>
//                   {months.map((month, index) => (
//                     <option key={index} value={month}>{month}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>

//               {/* Payment Status Dropdown */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Payment Status</Form.Label>
//                 <Form.Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
//                   <option value="">-- Select Status --</option>
//                   <option value="Paid">Paid</option>
//                   <option value="Unpaid">Unpaid</option>
//                 </Form.Select>
//               </Form.Group>

//               {/* Apply Filter Button */}
//               <Button variant="primary" onClick={handleApplyFilter}>Apply Filter</Button>
//             </div>
//           </Form>
//         </div>
//       )}

//       {/* Payment Status List */}
//       <div className="card-body bg-white" style={{ overflowY: "auto", height: "774px" }}>
//         <ul className="list-unstyled activity-wid mb-4 mt-2">
//           {filteredCompanyPaymentStatus?.map((item, index) => (
//             <li className="activity-list activity-border" key={index}>
//               <div className="activity-icon avatar-sm">
//                 <img src={item.companyLogo || company1} className="avatar-sm" alt="" />
//               </div>
//               <div className="media">
//                 <div className="me-3">
//                   <p className="text-muted font-size-14 mb-0">

//                     <Link to={`/admin-details/1/${item.companyName}`} className="text-decoration-none">
//                     {item.companyName}
//                     </Link>
//                     </p>
//                     <p className="text-success fw-bold small mt-1">
//                   {new Date(`${item.periodMonth} 1, ${item.year}`).toLocaleString('en-US', { month: 'short' })}-{item.year}
//                   </p>

//                 </div>
//                 <div className="media-body">
//                   <div className="text-end d-none d-md-block">
//                     <span className={`${item.paymentStatus === "Unpaid" ? "text-warning" : "text-success"} fw-medium text-md`}>
//                       {item.paymentStatus}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   </div>

//   );
// };

// PaymentStatusList.propTypes = {
//     companyPaymentStatus: PropTypes.array.isRequired,
//   };

// export default PaymentStatusList;
