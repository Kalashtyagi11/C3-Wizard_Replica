//import { Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import PaymentDetails from './components/PaymentDetails';
import PaymentChart from './components/PaymentChart';
import PaymentStatusList from './components/PaymentStatusList';
import AdminServices from '../../../service/admin-dashboard/AdminServices';
import Loader from '../../../layouts/loader/Loader';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMonth, setIsOpenMonth] = useState(false);
  const [year, setSelectedOptions] = useState([`${new Date().getFullYear()}`]);
  const [month, setMonth] = useState([new Date().toLocaleString('default', { month: 'long' })]);
  const [compare, setValue] = useState('Amount');
  const dropdownRef = useRef();

  const getDataHandler = async () => {
    try {
      setLoading(true);
      const res = await AdminServices.getDashboardData();
      setData(res.data.data);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoading(false); // 🔄 End loading
    }
  };

  // const years = [...new Set(data?.summary.map(item => item.year))];
  // const months = [...new Set(data?.summary.map(item => item.periodMonth))];

  const combined = [...(data?.summary || []), ...(data?.selfSummary || [])];
  const years = [...new Set(combined.map((item) => item.year))].sort((a, b) => a - b);
  //const combinedMonth = [...new Set(combined.map(item => item.periodMonth))];
  const months = [...new Set(combined.map((item) => item.periodMonth))];

  useEffect(() => {
    getDataHandler();
  }, []);

  const yearPopUp = () => {
    setIsOpen(!isOpen);
  };

  const yearCheckBoxChange = (e) => {
    const { value } = e.target;

    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((label) => label !== value) : [...prev, value],
    );
  };

  const yearAllChange = (e) => {
    if (e.target.checked) {
      setSelectedOptions(years);
    } else {
      setSelectedOptions([]);
    }
  };

  const yearLabelText = () => {
    if (year.length === 0) return 'Select Years';
    if (year.length === years.length) return 'All Selected';
    return year.join(', ');
  };

  const monthPopUp = () => {
    setIsOpenMonth(!isOpenMonth);
  };

  const monthCheckBoxChange = (e) => {
    const { value } = e.target;

    setMonth((prev) =>
      prev.includes(value) ? prev.filter((label) => label !== value) : [...prev, value],
    );
  };

  const monthAllChange = (e) => {
    if (e.target.checked) {
      setMonth(months);
    } else {
      setMonth([]);
    }
  };

  const monthLabelText = () => {
    if (month.length === 0) return 'Select Months';
    if (month.length === months.length) return 'All Selected';
    return month.join(', ');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsOpenMonth(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - C3Wizard </title>
      </Helmet>

      <div id="layout-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div id="layout-wrapper">
                      <div className="main-content">
                        <div className="page-content">
                          <div className="container-fluid">
                            <div className="page-content-wrapper">
                              <div className="row mb-3">
                                <div className="col-xxl-12 col-xl-12 col-sm-12">
                                  <div className="shadow-none box-dash radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative p-3">
                                    <div className="row dash">
                                      {/* Year Dropdown */}

                                      <div className="col-md-4 col-lg-4 col-xl-4">
                                        <div className="">
                                          <div
                                            className="dropdown form-select px-4 open"
                                            ref={dropdownRef}
                                          >
                                            <div className="dropdown-label" onClick={yearPopUp}>
                                              {yearLabelText()}
                                            </div>

                                            {isOpen && (
                                              <div className="dropdown-list form-select">
                                                <div className="checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="dropdown-group-all"
                                                    className="check-all checkbox-custom"
                                                    id="checkbox-main"
                                                    onChange={yearAllChange}
                                                    checked={year.length === years.length}
                                                  />
                                                  <Label
                                                    htmlFor="checkbox-main"
                                                    className="checkbox-custom-Label"
                                                  >
                                                    &nbsp; All
                                                  </Label>
                                                </div>

                                                {years.map((year0, index) => (
                                                  <div className="checkbox" key={index}>
                                                    <input
                                                      type="checkbox"
                                                      name="dropdown-group"
                                                      className="check checkbox-custom"
                                                      id={`year-${index}`}
                                                      value={year0}
                                                      onChange={yearCheckBoxChange}
                                                      checked={year.includes(year0)}
                                                    />
                                                    <Label
                                                      htmlFor={`year-${index}`}
                                                      className="checkbox-custom-Label"
                                                    >
                                                      {year0}
                                                    </Label>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-4 col-lg-4 col-xl-4">
                                        <div
                                          className="dropdown form-select px-4 open"
                                          ref={dropdownRef}
                                        >
                                          <div className="dropdown-label" onClick={monthPopUp}>
                                            {monthLabelText()}
                                          </div>

                                          {isOpenMonth && (
                                            <div className="dropdown-list form-select">
                                              <div className="checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="dropdown-group-all"
                                                  className="check-all checkbox-custom"
                                                  id="checkbox-main"
                                                  onChange={monthAllChange}
                                                  checked={month.length === months.length}
                                                />
                                                <Label
                                                  htmlFor="checkbox-main"
                                                  className="checkbox-custom-Label"
                                                >
                                                  &nbsp; All
                                                </Label>
                                              </div>

                                              {months.map((months0, index) => (
                                                <div className="checkbox" key={index}>
                                                  <input
                                                    type="checkbox"
                                                    name="dropdown-group"
                                                    className="check checkbox-custom"
                                                    id={`month-${index}`}
                                                    value={months0}
                                                    onChange={monthCheckBoxChange}
                                                    checked={month.includes(months0)}
                                                  />
                                                  <Label
                                                    htmlFor={`month-${index}`}
                                                    className="checkbox-custom-Label"
                                                  >
                                                    {months0}
                                                  </Label>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-4 col-lg-4 col-xl-4">
                                        {/* Value Dropdown */}
                                        <select
                                          className="form-select"
                                          value={compare}
                                          onChange={(e) => setValue(e.target.value)}
                                        >
                                          {/* <option value="">Select EmployerCount or Amount</option> */}
                                          <option value="Amount">By Amount</option>
                                          <option value="EmployerCount">By Employer Count</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <PaymentDetails
                                month={month}
                                year={year}
                                compare={compare}
                                selfList={data?.selfSummary || []}
                                companyList={data?.summary || []}
                              />

                              <div className="row">
                                <PaymentStatusList
                                  month={month}
                                  year={year}
                                  companyPaymentStatus={data?.companyPaymentStatus || []}
                                  selfSummary={data?.selfSummary || []}
                                />

                                <PaymentChart
                                  month={month}
                                  year={year}
                                  compare={compare}
                                  graphSummary={data?.summary || []}
                                  selfGraphSummary={data?.selfSummary || []}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <PaymentDetails  selfSummary={data?.selfSummary||[]} unpaidpercentage={unpaidpercentage} paidpercentage={paidpercentage} totalPaidSum={totalPaidSum} totalUnpaidSum={totalUnpaidSum}/> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Dashboard;
