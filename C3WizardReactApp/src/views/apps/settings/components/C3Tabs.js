import { useState } from 'react';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';

const C3Tabs = ({ formik,tabs,setActiveTab,activeTab }) => {
  // State to manage the active tab
 



  return (
    <div>
      {/* Tab Navigation */}
      <ul className="nav nav-pills mb-3 border-bottom border-2" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link text-dark fw-semibold position-relative ${
                activeTab === tab.id ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.Label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content rounded-3 p-3">
        <div
          key="general"
          className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}
          role="tabpanel"
          aria-labelledby="general-tab"
        >
          <div className="row">
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Severance Contribution Rate (%) <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.severanceContributionRate &&
                    formik.errors.severanceContributionRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="severanceContributionRate"
                  name="severanceContributionRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.severanceContributionRate}
                />
                {formik.touched.severanceContributionRate &&
                formik.errors.severanceContributionRate ? (
                  <div className="invalid-feedback">{formik.errors.severanceContributionRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Min Age <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.minAge && formik.errors.minAge ? 'is-invalid' : ''
                  }`}
                  id="minAge"
                  name="minAge"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.minAge}
                />
                {formik.touched.minAge && formik.errors.minAge ? (
                  <div className="invalid-feedback">{formik.errors.minAge}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Max Age <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxAge && formik.errors.maxAge ? 'is-invalid' : ''
                  }`}
                  id="maxAge"
                  name="maxAge"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxAge}
                />
                {formik.touched.maxAge && formik.errors.maxAge ? (
                  <div className="invalid-feedback">{formik.errors.maxAge}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Additional Fine Rate (%) <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.additionalFineRate && formik.errors.additionalFineRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="additionalFineRate"
                  name="additionalFineRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.additionalFineRate}
                />
                {formik.touched.additionalFineRate && formik.errors.additionalFineRate ? (
                  <div className="invalid-feedback">{formik.errors.additionalFineRate}</div>
                ) : null}
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Min Penalty Rate (%) <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.minPenaltyRate && formik.errors.minPenaltyRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="minPenaltyRate"
                  name="minPenaltyRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.minPenaltyRate}
                />
                {formik.touched.minPenaltyRate && formik.errors.minPenaltyRate ? (
                  <div className="invalid-feedback">{formik.errors.minPenaltyRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Employer Levy Rate (%) <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.employerLevyRate && formik.errors.employerLevyRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="employerLevyRate"
                  name="employerLevyRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.employerLevyRate}
                />
                {formik.touched.employerLevyRate && formik.errors.employerLevyRate ? (
                  <div className="invalid-feedback">{formik.errors.employerLevyRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Additional Penalty Rate (%)<span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.additionalPenaltyRate && formik.errors.additionalPenaltyRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="additionalPenaltyRate"
                  name="additionalPenaltyRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.additionalPenaltyRate}
                />
                {formik.touched.additionalPenaltyRate && formik.errors.additionalPenaltyRate ? (
                  <div className="invalid-feedback">{formik.errors.additionalPenaltyRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Min Fine Rate (%)<span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.minFineRate && formik.errors.minFineRate ? 'is-invalid' : ''
                  }`}
                  id="minFineRate"
                  name="minFineRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.minFineRate}
                />
                {formik.touched.minFineRate && formik.errors.minFineRate ? (
                  <div className="invalid-feedback">{formik.errors.minFineRate}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div
          key="bonus"
          className={`tab-pane fade ${activeTab === 'bonus' ? 'show active' : ''}`}
          role="tabpanel"
          aria-labelledby="bonus-tab"
        >
          <div className="row">
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Employee Levy Contribution Rate On Bonus (%){' '}
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.employeeLevyBonus && formik.errors.employeeLevyBonus
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="employeeLevyBonus"
                  name="employeeLevyBonus"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.employeeLevyBonus}
                />
                {formik.touched.employeeLevyBonus && formik.errors.employeeLevyBonus ? (
                  <div className="invalid-feedback">{formik.errors.employeeLevyBonus}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div
          key="sser"
          className={`tab-pane fade ${activeTab === 'sser' ? 'show active' : ''}`}
          role="tabpanel"
          aria-labelledby="sser-tab"
        >
          <div className="row">
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Employer Social Security Contribution Rate (%)
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.employerSocialSecurityRate &&
                    formik.errors.employerSocialSecurityRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="employerSocialSecurityRate"
                  name="employerSocialSecurityRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.employerSocialSecurityRate}
                />
                {formik.touched.employerSocialSecurityRate &&
                formik.errors.employerSocialSecurityRate ? (
                  <div className="invalid-feedback">{formik.errors.employerSocialSecurityRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Employer Social Security Contribution Rate (%) Max Amount for Employer Social
                  Security
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxEmployerSocialSecurity &&
                    formik.errors.maxEmployerSocialSecurity
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="maxEmployerSocialSecurity"
                  name="maxEmployerSocialSecurity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxEmployerSocialSecurity}
                />
                {formik.touched.maxEmployerSocialSecurity &&
                formik.errors.maxEmployerSocialSecurity ? (
                  <div className="invalid-feedback">{formik.errors.maxEmployerSocialSecurity}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Max Amount Payable for Employer Social Security
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxPayableEmployer && formik.errors.maxPayableEmployer
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="maxPayableEmployer"
                  name="maxPayableEmployer"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxPayableEmployer}
                />
                {formik.touched.maxPayableEmployer && formik.errors.maxPayableEmployer ? (
                  <div className="invalid-feedback">{formik.errors.maxPayableEmployer}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div
          key="ssee"
          className={`tab-pane fade ${activeTab === 'ssee' ? 'show active' : ''}`}
          role="tabpanel"
          aria-labelledby="ssee-tab"
        >
          <div className="row">
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Employee Social Security Contribution Rate (%)
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.employeeSocialSecurityRate &&
                    formik.errors.employeeSocialSecurityRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="employeeSocialSecurityRate"
                  name="employeeSocialSecurityRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.employeeSocialSecurityRate}
                />
                {formik.touched.employeeSocialSecurityRate &&
                formik.errors.employeeSocialSecurityRate ? (
                  <div className="invalid-feedback">{formik.errors.employeeSocialSecurityRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Max Amount for Employee Social Security<span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxEmployeeSocialSecurity &&
                    formik.errors.maxEmployeeSocialSecurity
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="maxEmployeeSocialSecurity"
                  name="maxEmployeeSocialSecurity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxEmployeeSocialSecurity}
                />
                {formik.touched.maxEmployeeSocialSecurity &&
                formik.errors.maxEmployeeSocialSecurity ? (
                  <div className="invalid-feedback">{formik.errors.maxEmployeeSocialSecurity}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Max Amount Payable for Employee Social Security
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxPayableEmployee && formik.errors.maxPayableEmployee
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="maxPayableEmployee"
                  name="maxPayableEmployee"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxPayableEmployee}
                />
                {formik.touched.maxPayableEmployee && formik.errors.maxPayableEmployee ? (
                  <div className="invalid-feedback">{formik.errors.maxPayableEmployee}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div
          key="eib"
          className={`tab-pane fade ${activeTab === 'eib' ? 'show active' : ''}`}
          role="tabpanel"
          aria-labelledby="eib-tab"
        >
          <div className="row">
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  EIB Contribution Rate (%)<span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.eibContributionRate && formik.errors.eibContributionRate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="eibContributionRate"
                  name="eibContributionRate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.eibContributionRate}
                />
                {formik.touched.eibContributionRate && formik.errors.eibContributionRate ? (
                  <div className="invalid-feedback">{formik.errors.eibContributionRate}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  Max Amount for EIB<span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxEibAmount && formik.errors.maxEibAmount ? 'is-invalid' : ''
                  }`}
                  id="maxEibAmount"
                  name="maxEibAmount"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxEibAmount}
                />
                {formik.touched.maxEibAmount && formik.errors.maxEibAmount ? (
                  <div className="invalid-feedback">{formik.errors.maxEibAmount}</div>
                ) : null}
              </div>
            </div>

            <div className="col-md-4 col-lg-4 col-xl-4">
              <div className="mb-3">
                <Label>
                  {' '}
                  Max Amount Payable for EIB<span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.maxPayableEib && formik.errors.maxPayableEib ? 'is-invalid' : ''
                  }`}
                  id="maxPayableEib"
                  name="maxPayableEib"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxPayableEib}
                />
                {formik.touched.maxPayableEib && formik.errors.maxPayableEib ? (
                  <div className="invalid-feedback">{formik.errors.maxPayableEmployer}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

C3Tabs.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }).isRequired,

  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,   // Tab ID (string)
      Label: PropTypes.string.isRequired, // Tab Label (string)
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired, // Currently active tab (string)
  setActiveTab: PropTypes.func.isRequired, // Function to update active tab

};

export default C3Tabs;
