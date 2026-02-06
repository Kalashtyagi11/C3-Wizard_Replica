import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';

const PeriodSelector = ({formik}) => {


  return (
    <div className="card-body">
      <div className="row align-items-center d-flex">
        <div className="col-xl-4 mb-3">
          <Label className="form-label d-block mb-0">Period From:</Label>
          <DatePicker
            selected={formik.values.fromPeriod}
            onChange={(date) => formik.setFieldValue("fromPeriod", date)}
            dateFormat="MMM-yyyy"
            showMonthYearPicker
            placeholderText="MMM-YYYY"
            className={`form-control ${
              formik.touched.fromPeriod && formik.errors.fromPeriod
                ? "is-invalid"
                : ""
            }`}
          />
          {formik.touched.fromPeriod && formik.errors.fromPeriod && (
            <div className="invalid-feedback">{formik.errors.fromPeriod}</div>
          )}
        </div>

        <div className="col-xl-4 mb-3">
          {/* To Period */}
          <Label className="form-label d-block mb-0">Period To:</Label>
    
          <DatePicker
            selected={formik.values.toPeriod}
            onChange={(date) => formik.setFieldValue("toPeriod", date)}
            dateFormat="MMM-yyyy"
            showMonthYearPicker
            placeholderText="MMM-YYYY"
            minDate={formik.values.fromPeriod}
            className={`form-control ${
              formik.touched.toPeriod && formik.errors.toPeriod
                ? "is-invalid"
                : ""
            }`}
          />
          {formik.touched.toPeriod && formik.errors.toPeriod && (
            <div className="invalid-feedback">{formik.errors.toPeriod}</div>
          )}
        </div>
      </div>

    
    </div>
  );
};



PeriodSelector.propTypes = {
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

export default PeriodSelector;
