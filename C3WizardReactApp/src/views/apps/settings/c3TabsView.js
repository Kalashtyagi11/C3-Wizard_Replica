import { useState } from 'react';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';

const C3Tabs = ({ CSettingData, tabs, setActiveTab, activeTab }) => {
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
      <div className="tab-content rounded-3 ">
       
        <div className="tab-content rounded-3 ">
          <div
            className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Severance Contribution Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="severanceRate"
                    value={CSettingData?.severanceRate || ''}
                    name="severanceRate"
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Min Age</Label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={CSettingData?.min_age}
                    id="minAge"
                    name="minAge"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Max Age</Label>
                  <input type="text" className="form-control" value={CSettingData?.max_age} disabled id="maxAge" name="maxAge" />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Additional Fine Rate (%)</Label>
                  <input type="text" className="form-control" value={CSettingData?.fine_Rate}
                  disabled name="additionalFineRate" />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Min Penalty Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="minPenaltyRate"
                    name="minPenaltyRate"
                    disabled
                    value={CSettingData?.penalty_Rate}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Employer Levy Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="employerLevyRate"
                    name="employerLevyRate"
                    disabled
                    value={CSettingData?.employerLevy}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Additional Penalty Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="additionalPenaltyRate"
                    name="additionalPenaltyRate"
                    value={CSettingData?.additional_Fine_Rate}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Min Fine Rate (%)</Label>
                  <input type="text" className="form-control" disabled
                  value={CSettingData?.fine_Rate}
                   id="minFineRate" name="minFineRate" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === 'bonus' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Employee Levy Contribution Rate On Bonus (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeLevyBonus"
                    name="employeeLevyBonus"
                    disabled
                    value={CSettingData?.bonus_Levy_EE_Rate}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === 'sser' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Employer Social Security Contribution Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="eE_dflt_rate"
                    name="eE_dflt_rate"
                    disabled
                    value={CSettingData?.eE_dflt_rate}

                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>
                    Employer Social Security Contribution Rate (%) Max Amount for Employer Social
                    Security
                  </Label>
                  <input
                    type="text"
                    className="form-control"
                    id="eE_dflt_pay_limit"
                    name="eE_dflt_pay_limit"
                    value={CSettingData?.eE_dflt_pay_limit}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Max Amount Payable for Employer Social Security</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="eE_dflt_limit"
                    name="eE_dflt_limit"
                    value={CSettingData?.eE_dflt_limit}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === 'ssee' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Employee Social Security Contribution Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="eR_dflt_rate"
                    name="eR_dflt_rate"
                    value={CSettingData?.eR_dflt_rate}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Max Amount for Employee Social Security</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="maxEmployeeSocialSecurity"
                    name="maxEmployeeSocialSecurity"
                    value={CSettingData?.er_dflt_pay_limit}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Max Amount Payable for Employee Social Security</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="maxPayableEmployee"
                    name="maxPayableEmployee"
                    disabled
                    value={CSettingData?.er_dflt_limit}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === 'eib' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <Label>EIB Contribution Rate (%)</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="eibContributionRate"
                    name="eibContributionRate"
                    value={CSettingData?.eiBdflt_rate}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Max Amount for EIB</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="maxEibAmount"
                    name="maxEibAmount"
                    disabled
                    value={CSettingData?.eiBdflt_pay_limit}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <Label>Max Amount Payable for EIB</Label>
                  <input
                    type="text"
                    className="form-control"
                    id="maxPayableEib"
                    name="maxPayableEib"
                    value={CSettingData?.eiBdflt_limit}
                    disabled
                  />
                </div>
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
      id: PropTypes.string.isRequired, // Tab ID (string)
      Label: PropTypes.string.isRequired, // Tab Label (string)
    }),
  ).isRequired,
  activeTab: PropTypes.string.isRequired, // Currently active tab (string)
  setActiveTab: PropTypes.func.isRequired, // Function to update active tab
  CSettingData: PropTypes.object,
};

export default C3Tabs;
