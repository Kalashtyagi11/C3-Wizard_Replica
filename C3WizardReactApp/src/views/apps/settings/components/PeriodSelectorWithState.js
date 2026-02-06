import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';

const PeriodSelectorWithState = ({ fromPeriod, setFromPeriod, toPeriod, setToPeriod }) => {
  const handleFromPeriodChange = (date) => {
    setFromPeriod(date);
    // setToPeriod(null); // Reset "To" period when "From" changes
  };

  const handleToPeriodChange = (date) => {
    setToPeriod(date);
  };

  return (
    <>
      <div className="col-xl-3 mb-3">
        <Label className="form-label d-block mb-0">Period From:</Label>
        <DatePicker
          selected={fromPeriod}
          onChange={handleFromPeriodChange}
          dateFormat="MMM-yyyy"
          showMonthYearPicker
          placeholderText="MMM-YYYY"
          className="form-control"
          isClearable
        />
      </div>

      <div className="col-xl-3 mb-3">
        <Label className="form-label d-block mb-0">Period To:</Label>
        <DatePicker
          selected={toPeriod}
          onChange={handleToPeriodChange}
          dateFormat="MMM-yyyy"
          showMonthYearPicker
          placeholderText="MMM-YYYY"
          minDate={fromPeriod} // Ensures "To" period is after "From" period
          className="form-control"
          isClearable
          // disabled={!fromPeriod} // Disables "To" selection until "From" is selected
        />
      </div>
    </>
  );
};

PeriodSelectorWithState.propTypes = {
  fromPeriod: PropTypes.instanceOf(Date),
  setFromPeriod: PropTypes.func.isRequired,
  toPeriod: PropTypes.instanceOf(Date),
  setToPeriod: PropTypes.func.isRequired,
};

export default PeriodSelectorWithState;
