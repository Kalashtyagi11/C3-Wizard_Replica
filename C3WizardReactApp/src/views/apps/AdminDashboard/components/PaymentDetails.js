import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// const PaymentDetails = ({selfSummary,totalPaidSum,totalUnpaidSum,paidpercentage,unpaidpercentage}) => {
const PaymentDetails = ({ month, year, compare, companyList, selfList }) => {
  const [totalPaidSum, setTotalPaidSum] = useState(0);
  const [totalUnpaidSum, setTotalUnpaidSum] = useState(0);
  const [nwTotalPaidSum, setNwTotalPaidSum] = useState(0);
  const [nwTotalUnpaidSum, setNwTotalUnpaidSum] = useState(0);
  const [selfTotalPaidSum, setSelfTotalPaidSum] = useState(0);
  const [selfTotalUnpaidSum, setSelfTotalUnpaidSum] = useState(0);
  //const paidpercentage= companyList?.at(0)?.paidPercentage ?? 0;
  //const unpaidpercentage= companyList?.at(0)?.unpaidPercentage ?? 0;

  //const selfPaidpercentage= selfList?.at(0)?.paidPercentage ?? 0;
  //const selfUnpaidpercentage= selfList?.at(0)?.unpaidPercentage ?? 0;
  useEffect(() => {
    const totalPaid = companyList
      ?.filter(
        (item) =>
          item.types === 'company' && year.includes(item.year) && month.includes(item.periodMonth),
      )
      ?.reduce(
        (sum, item) => (compare === 'Amount' ? sum + item.totalPaid : sum + item.paidEmployer),
        0,
      );
    const totalUnpaid = companyList
      ?.filter(
        (item) =>
          item.types === 'company' && year.includes(item.year) && month.includes(item.periodMonth),
      )
      ?.reduce(
        (sum, item) => (compare === 'Amount' ? sum + item.totalUnpaid : sum + item.unPaidEmployer),
        0,
      );

    const nwTotalPaid = companyList
      ?.filter(
        (item) =>
          item.types === 'dir' && year.includes(item.year) && month.includes(item.periodMonth),
      )
      ?.reduce(
        (sum, item) => (compare === 'Amount' ? sum + item.totalPaid : sum + item.paidEmployer),
        0,
      );

    const nwTotalUnpaid = companyList
      ?.filter(
        (item) =>
          item.types === 'dir' && year.includes(item.year) && month.includes(item.periodMonth),
      )
      ?.reduce(
        (sum, item) => (compare === 'Amount' ? sum + item.totalUnpaid : sum + item.unPaidEmployer),
        0,
      );

    // Non working addon by  Anjani because not showing in list paid and unpaid 29-05-2025
    //===============================================================================Anjani code=======
    // const filteredList = companyList?.filter(
    //   (item) =>
    //     item.types === 'dir' && year.includes(item.year) && month.includes(item.periodMonth),
    // );

    // filteredList.forEach((item) => {
    //   console.log(`totalPaid: ${item.totalPaid}, paidEmployer: ${item.paidEmployer}`);
    // });

    // const nwTotalPaid = filteredList?.reduce((sum, item) => {
    //   const value = compare === 'Amount' ? item.totalPaid : item.paidEmployer;
    //   return sum + (typeof value === 'number' ? value : 0);
    // }, 0);

    // const nwTotalUnpaid = filteredList?.reduce((sum, item) => {
    //   const value = compare === 'Amount' ? item.totalUnpaid : item.unPaidEmployer;
    //   return sum + (typeof value === 'number' ? value : 0);
    // }, 0);

    //=====================================================================================

    const selfTotalPaid = selfList
      ?.filter((item) => year.includes(item.year) && month.includes(item.periodMonth))
      ?.reduce(
        (sum, item) => (compare === 'Amount' ? sum + item.paid : sum + item.paidEmployer),
        0,
      );
    const selfTotalUnpaid = selfList
      ?.filter((item) => year.includes(item.year) && month.includes(item.periodMonth))
      ?.reduce(
        (sum, item) => (compare === 'Amount' ? sum + item.unpaid : sum + item.unPaidEmployer),
        0,
      );

    setTotalUnpaidSum(totalUnpaid);
    setTotalPaidSum(totalPaid);
    setNwTotalPaidSum(nwTotalPaid);
    setNwTotalUnpaidSum(nwTotalUnpaid);
    setSelfTotalPaidSum(selfTotalPaid);
    setSelfTotalUnpaidSum(selfTotalUnpaid);
  }, [month, year, compare, companyList]);

  return (
    <>
      <style>
        {`
          .bdr-right {
            border-right: 1px solid #eaeaea;
          }
          .bdr-bottom {
            border-bottom: 1px solid #eaeaea;
          }
          .box-dash p {
            color: #000;
            padding: 8px 10px 5px;
            font-size: 16px;
          }
          .box-dash span {
            color: #000;
          }
          .color-green {
            color: green;
            font-size: 20px;
            padding-top: 5px;
            padding-bottom: 8px;
          }
          .color-red {
            color: red;
            font-size: 20px;
            padding-top: 5px;
            padding-bottom: 8px;
          }
        `}
      </style>
      <div className="row gy-4 font-b">
        {/* Company Block */}
        <div className="col-xxl-4 col-xl-4 col-sm-6 mb-4">
          <div className="shadow-sm border rounded-3 bg-white h-100 p-3 text-center">
            {/* Title */}
            <p className="fw-bold  mb-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-briefcase-fill me-2 text-success"></i> Employer
            </p>
            <hr className="my-2" />

            <div className="row">
              {/* Paid */}
              <div className="col-6 border-end">
                <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-cash-stack text-success"></i>
                  <span className="fw-semibold text-dark">Paid</span>
                </div>
                <h5 className="fw-bold text-success mb-1">
                

                        <Link
                    to={`/admin-details/paid/company/${year}/${month}`}
                    className="text-decoration-none text-success"
                    style={{ color: '#393' }}
                  >
                    {compare === 'Amount' ? '$' : ''}
                    {totalPaidSum ? compare === 'Amount' ? totalPaidSum.toFixed(2) : totalPaidSum : compare === 'Amount' ? '0.00' : 0}
                  </Link>
                </h5>

              </div>

              {/* Unpaid */}
              <div className="col-6">
                <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                  <span className="fw-semibold text-dark">Unpaid</span>
                </div>
                <h5 className="fw-bold text-danger mb-1">
               <Link
                    to={`/admin-details/unpaid/company/${year}/${month}`}
                    className="text-decoration-none text-danger"
                  >
                    {compare === 'Amount' ? '$' : ''}
                    {totalUnpaidSum ? compare === 'Amount' ? totalUnpaidSum.toFixed(2) : totalUnpaidSum : compare === 'Amount' ? '0.00' : 0}
                  </Link>

                </h5>

              </div>
            </div>
          </div>
        </div>



        {/* NW Director Block */}
        <div className="col-xxl-4 col-xl-4 col-sm-6 mb-4">
          <div className="shadow-sm border rounded-3 bg-white h-100 p-3 text-center">
            {/* Title */}
            <p className="fw-bold  mb-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-person-badge-fill me-2 text-success"></i> NW Director
            </p>
            <hr className="my-2" />

            <div className="row">
              {/* Paid */}
              <div className="col-6 border-end">
                <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-cash-stack text-success"></i>
                  <span className="fw-semibold text-dark">Paid</span>
                </div>
                <h5 className="fw-bold text-success mb-1">
                <Link
                    to={`/admin-details/paid/dir/${year}/${month}`}
                    className="text-decoration-none text-success"
                    style={{ color: '#393' }}
                  >
                    {compare === 'Amount' ? '$' : ''}
                    {nwTotalPaidSum ? compare === 'Amount' ? nwTotalPaidSum.toFixed(2) : nwTotalPaidSum : compare === 'Amount' ? '0.00' : 0}
                  </Link>
                </h5>

              </div>

              {/* Unpaid */}
              <div className="col-6">
                <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                  <span className="fw-semibold text-dark">Unpaid</span>
                </div>
                <h5 className="fw-bold text-danger mb-1">
                  <Link
                    to={`/admin-details/unpaid/dir/${year}/${month}`}
                    className="text-decoration-none text-danger"
                  >
                    {compare === 'Amount' ? '$' : ''}
                    {nwTotalUnpaidSum ? compare === 'Amount' ? nwTotalUnpaidSum.toFixed(2) : nwTotalUnpaidSum : compare === 'Amount' ? '0.00' : 0}
                  </Link>
                </h5>

              </div>
            </div>
          </div>
        </div>

        {/* Self-Employed Block */}
        <div className="col-xxl-4 col-xl-4 col-sm-6 mb-4">
          <div className="shadow-sm border rounded-3 bg-white h-100 p-3 text-center">
            {/* Title */}
            <p className="fw-bold  mb-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-person-workspace me-2 text-success"></i> Self Employed
            </p>
            <hr className="my-2" />

            <div className="row">
              {/* Paid */}
              <div className="col-6 border-end">
                <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-cash-stack text-success"></i>
                  <span className="fw-semibold text-dark">Paid</span>
                </div>
                <h5 className="fw-bold text-success mb-1">
             
    <Link
                    to={`/admin-details/paid/self/${year}/${month}`}
                    className="text-decoration-none text-success"
                    style={{ color: '#393' }}
                  >
                    {compare === 'Amount' ? '$' : ''}
                    {selfTotalPaidSum ? compare === 'Amount' ? selfTotalPaidSum.toFixed(2) : selfTotalPaidSum : compare === 'Amount' ? '0.00' : 0}
                  </Link>
                </h5>

              </div>

              {/* Unpaid */}
              <div className="col-6">
                <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                  <span className="fw-semibold text-dark">Unpaid</span>
                </div>
                <h5 className="fw-bold text-danger mb-1">
                     <Link
                    to={`/admin-details/unpaid/self/${year}/${month}`}
                    className="text-decoration-none text-danger"
                  >
                    {compare === 'Amount' ? '$' : ''}
                    {selfTotalUnpaidSum ? compare === 'Amount' ? selfTotalUnpaidSum.toFixed(2) : selfTotalUnpaidSum : compare === 'Amount' ? '0.00' : 0}
                  </Link>
                </h5>

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

PaymentDetails.propTypes = {
  companyList: PropTypes.array.isRequired,
  selfList: PropTypes.array.isRequired,
  year: PropTypes.array.isRequired,
  month: PropTypes.array.isRequired,
  compare: PropTypes.string.isRequired,
  //   paidpercentage: PropTypes.string.isRequired,
  // unpaidpercentage: PropTypes.string.isRequired,
};

export default PaymentDetails;
