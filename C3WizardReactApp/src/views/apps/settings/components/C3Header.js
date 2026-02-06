import React, { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';
import BonusSettingsServices from '../../../../service/settings/BonusSetting';
import PeriodSelector from './PeriodSelector';

const monthList = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();

// Generate a list of years (e.g., from 2000 to current year + 10)
// const yearList = Array.from({ length: 35 }, (_, index) => {
//   const year = 2000 + index; // Adjust the start year as needed
//   return { value: year, label: year.toString() };
// });

// Function to filter the "toYear" dropdown based on "fromYear"

const C3Header = ({ formik }) => {
  const [yearsList, setYearsList] = useState([]);
  const getFilteredMonths = (fromMonth) => {
    return monthList.filter((month) => month.value >= fromMonth);
  };
  
  const getFilteredYears = (fromYear) => {
    return yearsList.filter((year) => year >= Number(fromYear));
  };


  const handleGetYears = async () => {
    try {
      const res = await BonusSettingsServices.getYearsList();
      setYearsList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetYears();
  }, []);

  return (
      <PeriodSelector formik={formik}/>

  );
};

C3Header.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }).isRequired,
};

export default C3Header;


// <div className="card-body">
// <div className="row align-items-center d-flex">
//   <div className="col-xl-3 mb-3">
//     <Label>
//       From Month <span className="text-danger">*</span>
//     </Label>
//     <select
//       className={`form-select ${
//         formik.touched.fromMonth && formik.errors.fromMonth ? 'is-invalid' : ''
//       }`}
//       id="fromMonth"
//       name="fromMonth"
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       value={formik.values.fromMonth}
//     >
//       <option value="">Select Month</option>
//       {monthList.map((month) => (
//         <option key={month.value} value={month.value}>
//           {month.label}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="col-xl-3 mb-3">
//     <Label>
//       To Month <span className="text-danger">*</span>
//     </Label>
//     <select
//       className={`form-select ${
//         formik.touched.toMonth && formik.errors.toMonth ? 'is-invalid' : ''
//       }`}
//       id="toMonth"
//       name="toMonth"
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       value={formik.values.toMonth}
//     >
//       <option value="">Select Month</option>
//       {getFilteredMonths(formik.values.fromMonth).map((month) => (
//         <option key={month.value} value={month.value}>
//           {month.label}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="col-xl-3 mb-3">
//     <Label>
//       From Year <span className="text-danger">*</span>
//     </Label>
//     <select
//       className={`form-select ${
//         formik.touched.fromYear && formik.errors.fromYear ? 'is-invalid' : ''
//       }`}
//       id="fromYear"
//       name="fromYear"
//       onChange={(e) => {
//         formik.setFieldValue('fromYear', e.target.value);
//         formik.setFieldValue('toYear', '');
//       }}
//       onBlur={formik.handleBlur}
//       value={formik.values.fromYear}
//     >
//       <option value="">Select Year</option>
//       {yearsList?.map((item, index) => (
//         <option key={index} value={item}>
//           {item}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="col-xl-3 mb-3">
//     <Label>
//       To Year <span className="text-danger">*</span>
//     </Label>
//     <select
//       className={`form-select ${
//         formik.touched.toYear && formik.errors.toYear ? 'is-invalid' : ''
//       }`}
//       id="toYear"
//       name="toYear"
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       value={formik.values.toYear}
//       disabled={!formik.values.fromYear}
//     >
//       <option value="">Select Year</option>
//       {formik.values.fromYear &&
//         getFilteredYears(formik.values.fromYear).map((year) => (
//           <option key={year} value={year}>
//             {year}
//           </option>
//         ))}
//     </select>
//   </div>

// </div>
// </div>