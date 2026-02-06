import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from 'reactstrap';
import AdminServices from '../../../../service/admin-dashboard/AdminServices';
import company1 from '../../../../assets/images/users/Company_log.png';

const AdminDetailspage = () => {
  const { id, key, year, month } = useParams();
  const [CompanyUsersList, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMonth, setIsOpenMonth] = useState(false);
  const [isOpenCom, setIsOpenCom] = useState(false);
  const [yearF, setSelectedOptions] = useState([`${new Date().getFullYear()}`]);
  const [monthF, setMonth] = useState([new Date().toLocaleString('default', { month: 'long' })]);
  const [selectedComp, setSelectedComp] = useState('');
  const [allCompanyNames, setfilteredDataCompany] = useState();
  const [compare, setValue] = useState(id);
  const getDataHandler = async () => {
    try {
      const res = await AdminServices.getDashboardData();
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataHandler();
    setSelectedOptions(year.split(','));
    setMonth(month.split(','));
  }, []);

  useEffect(() => {
    if (id === '1Paid' || id === '1Unpaid' || id === '2Paid' || id === '2Unpaid') {
      setValue(id.replace('1', '').replace('2', '') === 'Paid' ? 'paid' : 'unpaid');
      const dataAllCompany = CompanyUsersList?.companyPaymentStatus?.filter(
        (company) =>
          company.companyName.toLowerCase().trim() === key.toLowerCase().trim() &&
          company.types === (id.includes('1') ? 'dir' : 'company') &&
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : company.paymentStatus === 'Unpaid'),
      );
      const SelectedCompData = dataAllCompany?.filter(
        (e) => yearF.includes(e.year) && monthF.includes(e.periodMonth),
      );
      setfilteredDataCompany([...new Set(dataAllCompany?.map((item) => item?.companyName) || [])]);
      setSelectedComp([
        ...new Set(SelectedCompData?.map((item) => item?.companyName || '.') || []),
      ]);
    } else if (key !== 'self' && (id === 'unpaid' || id === 'paid')) {
      const dataAllCompany = CompanyUsersList?.companyPaymentStatus?.filter(
        (company) =>
          (id === 'paid' ? company.paymentStatus === 'Paid' : company.paymentStatus === 'Unpaid') &&
          company.types === key,
      );
      //&&yearF.includes(company.year) &&
      //monthF.includes(company.periodMonth) );
      const SelectedCompData = dataAllCompany?.filter(
        (e) => yearF.includes(e.year) && monthF.includes(e.periodMonth),
      );
      setfilteredDataCompany([...new Set(dataAllCompany?.map((item) => item?.companyName) || [])]);
      setSelectedComp([
        ...new Set(SelectedCompData?.map((item) => item?.companyName || '.') || []),
      ]);
    } else if (id === '3Paid' || id === '3Unpaid') {
      setValue(id.replace('3', '') === 'Paid' ? 'paid' : 'unpaid');

      const dataAllSelf = CompanyUsersList?.selfSummary?.filter(
        (company) =>
          company.companyName.toLowerCase().trim() === key.toLowerCase().trim() &&
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : company.paymentStatus === 'Unpaid'),
      );
      const SelectedSelfCompData = dataAllSelf?.filter(
        (e) => yearF.includes(e.year) && monthF.includes(e.periodMonth),
      );
      setfilteredDataCompany([...new Set(dataAllSelf?.map((item) => item?.companyName) || [])]);
      setSelectedComp([
        ...new Set(SelectedSelfCompData?.map((item) => item?.companyName || '.') || []),
      ]);
    } else {
      const dataAllSelf = CompanyUsersList?.selfSummary?.filter(
        (company) =>
          id === 'paid' ? company.paymentStatus === 'Paid' : company.paymentStatus === 'Unpaid',
        // &&company.types === key
      );
      const SelectedSelfCompData = dataAllSelf?.filter(
        (e) => yearF.includes(e.year) && monthF.includes(e.periodMonth),
      );

      setfilteredDataCompany([...new Set(dataAllSelf?.map((item) => item?.companyName) || [])]);
      setSelectedComp([
        ...new Set(SelectedSelfCompData?.map((item) => item?.companyName || '.') || []),
      ]);
    }
  }, [CompanyUsersList]);

  useEffect(() => {
    let filteredData1 = CompanyUsersList?.companyPaymentStatus;
    if (id === '1Paid' || id === '1Unpaid' || id === '2Paid' || id === '2Unpaid') {
      filteredData1 = filteredData1?.filter(
        (company) =>
          company.companyName.toLowerCase().trim() === key.toLowerCase().trim() &&
          company.types === (id.includes('1') ? 'dir' : 'company') &&
          yearF.includes(company.year) &&
          monthF.includes(company.periodMonth) &&
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : compare === 'unpaid'
            ? company.paymentStatus === 'Unpaid'
            : true),
      );
    } else if (key !== 'self' && (id === 'unpaid' || id === 'paid')) {
      filteredData1 = filteredData1?.filter(
        (company) =>
          //(id === "paid" ? company.paymentStatus === "Paid" : company.paymentStatus === "Unpaid") &&
          company.types === key &&
          yearF.includes(company.year) &&
          monthF.includes(company.periodMonth) &&
          selectedComp.includes(company.companyName) &&
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : compare === 'unpaid'
            ? company.paymentStatus === 'Unpaid'
            : true),
      );
    } else if (id === '3Paid' || id === '3Unpaid') {
      filteredData1 = CompanyUsersList?.selfSummary;
      filteredData1 = filteredData1?.filter(
        (company) =>
          company.companyName.toLowerCase().trim() === key.toLowerCase().trim() &&
          yearF.includes(company.year) &&
          monthF.includes(company.periodMonth) &&
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : compare === 'unpaid'
            ? company.paymentStatus === 'Unpaid'
            : true),
      );
    } else {
      filteredData1 = CompanyUsersList?.selfSummary;
      filteredData1 = filteredData1?.filter(
        (company) =>
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : compare === 'unpaid'
            ? company.paymentStatus === 'Unpaid'
            : true) &&
          yearF.includes(company.year) &&
          monthF.includes(company.periodMonth) &&
          selectedComp.includes(company.companyName) &&
          (compare === 'paid'
            ? company.paymentStatus === 'Paid'
            : compare === 'unpaid'
            ? company.paymentStatus === 'Unpaid'
            : true),
      );
    }
    setFilteredData(filteredData1);
    //setfilteredDataCompany([...new Set(filteredData1?.map(item => item?.companyName) || [])]);
  }, [yearF, monthF, selectedComp, compare]);

  const combined = [...(CompanyUsersList?.summary || []), ...(CompanyUsersList?.selfSummary || [])];
  const years = [...new Set(combined.map((item) => item.year))].sort((a, b) => a - b);
  const months = [...new Set(combined.map((item) => item.periodMonth))];
  //const allCompanyNames = [...new Set(combined.map(item => item.companyName))].sort();

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
    if (yearF.length === 0) return 'Select Years';
    if (yearF.length === years.length) return 'All Selected';
    return yearF.join(', ');
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
    if (monthF.length === 0) return 'Select Months';
    if (monthF.length === months.length) return 'All Selected';
    return monthF.join(', ');
  };

  const CompanyPopUp = () => {
    setIsOpenCom(!isOpenCom);
  };

  const CompanyCheckBoxChange = (e) => {
    const { value } = e.target;

    setSelectedComp((prev) =>
      prev.includes(value) ? prev.filter((label) => label !== value) : [...prev, value],
    );
  };

  const CompanyAllChange = (e) => {
    if (e.target.checked) {
      setSelectedComp(allCompanyNames);
    } else {
      setSelectedComp([]);
    }
  };

  const CompanyLabelText = () => {
    if (selectedComp.length === 0) return 'Select EmployerNames';
    if (selectedComp.length === allCompanyNames.length) return 'All Selected';
    return selectedComp.join(', ');
  };

  return (
    <div className="col-xl-12">
      <div className="card">
        <div className="card-header py-3 bg_ligh">
          <h4 className="header-title mb-0 text-success">
            <i className="far fa-money-bill-alt f-18"></i> Payment Status
          </h4>

          <div className="row dash">
            <div className="col-md-3 col-lg-3 col-xl-3">
              <div className="">
                <div className="dropdown form-select px-4 open">
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
                          checked={yearF.length === years.length}
                        />
                        <Label htmlFor="checkbox-main" className="checkbox-custom-Label">
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
                            checked={yearF.includes(year0)}
                          />
                          <Label htmlFor={`year-${index}`} className="checkbox-custom-Label">
                            {year0}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-3 col-lg-3 col-xl-3">
              <div className="dropdown form-select px-4 open">
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
                        checked={monthF.length === months.length}
                      />
                      <Label htmlFor="checkbox-main" className="checkbox-custom-Label">
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
                          checked={monthF.includes(months0)}
                        />
                        <Label htmlFor={`month-${index}`} className="checkbox-custom-Label">
                          {months0}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-3 col-lg-3 col-xl-3">
              <div className="dropdown form-select px-4 open">
                <div className="dropdown-label" onClick={CompanyPopUp}>
                  {CompanyLabelText()}
                </div>

                {isOpenCom && (
                  <div className="dropdown-list form-select">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="dropdown-group-all"
                        className="check-all checkbox-custom"
                        id="checkbox-main"
                        onChange={CompanyAllChange}
                        checked={selectedComp.length === allCompanyNames.length}
                      />
                      <Label htmlFor="checkbox-main" className="checkbox-custom-Label">
                        &nbsp; All
                      </Label>
                    </div>

                    {allCompanyNames.map((cmp, index) => (
                      <div className="checkbox" key={index}>
                        <input
                          type="checkbox"
                          name="dropdown-group"
                          className="check checkbox-custom"
                          id={`month-${index}`}
                          value={cmp}
                          onChange={CompanyCheckBoxChange}
                          checked={selectedComp.includes(cmp)}
                        />
                        <Label htmlFor={`month-${index}`} className="checkbox-custom-Label">
                          {cmp}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-3 col-lg-3 col-xl-3">
              <select
                className="form-select"
                value={compare}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="All">ALL</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body bg-white">
          <table className="table table-bordered mt-2">
            <thead>
              <tr>
                {key !== 'self' && <th>Logo</th>}
                <th>Employer Name</th>
                {key !== 'self' && <th>Total Employees</th>}
                <th>Schedule</th>
                <th>Month\Year</th>
                <th>Total Amount</th>
                <th className="">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                ?.sort((a, b) => a.schduleNo - b.schduleNo)
                ?.map((company, index) => (
                  <tr key={index}>
                    {key !== 'self' && (
                      <td>
                        <img
                          src={company.companyLogo === '' ? company1 : company.companyLogo}
                          className="avatar-sm"
                          alt=""
                        />
                      </td>
                    )}
                    <td>
                      {company.companyName}
                      {company.types === 'dir' ? ' -NW' : ''}
                    </td>
                    {key !== 'self' && (
                      <td className="  fw-medium text-md">
                        {company.totalEmployees || company.totalNoEmp}
                      </td>
                    )}
                    <td className="fw-medium text-md">{company.schduleNo}</td>
                    <td className=" fw-medium text-md">
                      {company.periodMonth}-{company.year}
                    </td>
                    {/* <td className="text-end  fw-medium text-md">{company.paid || company.unpaid}</td> */}
                    <td className="text-end fw-medium text-md">
                      ${(company.paid || company.unpaid || 0).toFixed(2)}
                    </td>

                    {/* <td className="text-end  fw-medium text-md">{company.paymentStatus}</td> */}
                    <td className=" fw-medium text-md">
                      {company.paymentStatus === 'Paid' ? (
                        <>
                          <i className="fa fa-check-circle text-success" />
                          &nbsp;{company.paymentStatus}
                        </>
                      ) : (
                        <>
                          <i className="fa fa-times-circle text-danger" />
                          &nbsp;{company.paymentStatus || 'Unpaid'}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailspage;
