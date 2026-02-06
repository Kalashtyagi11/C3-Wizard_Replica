import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { Label, Spinner, Input } from 'reactstrap';
import HttpCommon from '../../../../baseUrl/HttpCommon';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import { getPersonalDetail } from '../../../../store/apps/selfEmployee/PersonalDetails';

const AddSelfEmployeeSetting = () => {
  const location = useLocation();
  const CompanyId = localStorage.getItem('companyId');

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { PersonalData } = useSelector((state) => state.personalDetails);
  const navigate = useNavigate();
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);

  const [formData, setFormData] = useState({
    wcid: 0,
    userMessage: true,
    param: 0,
    fromYear: '2025',
    toYear: '2027',
    fromMonth: 4,
    toMonth: 6,
    a: '1000',
    awc: '100',
    b: '1000',
    bwc: '1000',
    c: '1000',
    cwc: '1000',
    d: '1000',
    dwc: '1000',
    e: '1000',
    ewc: '1000',
    f: '1000',
    fwc: '1000',
    g: '1000',
    gwc: '1000',
    h: '1000',
    hwc: '1000',
    i: '1000',
    iwc: '1000',
    j: '1000',
    jwc: '1000',
    k: '1000',
    kwc: '1000',
    l: '1000',
    lwc: '1000',
    m: '1000',
    mwc: '1000',
    special: '1000',
    specialWC: '1000',
    s: '1000',
    swc: '1000',
    //companyId:0
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the state with the new selected value
    }));
  };

  useEffect(() => {
    dispatch(getPersonalDetail());
  });

  useEffect(() => {
    if (message) {
      if (messageType === 'success') {
        toast.success(message);
      } else if (messageType === 'error') {
        toast.error(message);
      }

      dispatch(setMessage({ message: '', messageType: '' }));
    }
  }, [message, messageType, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="page-content-wrapper">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center gap-2 list-unstyled">
                <li className="fw-medium">
                  <a href="index.html" className="d-flex align-items-center gap-1 text-muted">
                    <i className="ti-home" /> Dashboard{' '}
                  </a>
                </li>
                <li>-</li>
                <li className="fw-medium">Self Employed Settings </li>
              </ul>
            </div>
            <div className="row">
              <div className="col-md-12 py-0">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center d-flex">
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <div className="mb-3">
                          <Label>
                            From Month <span className="text-danger">*</span>
                          </Label>

                          <Input
                            type="select"
                            id="year"
                            name="year"
                            className="form-control"
                            value={formData.fromMonth}
                            onChange={handleInput} // Handle year change
                          >
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </Input>
                        </div>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <div className="mb-3">
                          <Label>
                            To Month <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="year"
                            name="fromYear"
                            className="form-control"
                            value={formData.fromYear}
                            onChange={handleInput} // Handle year change
                          >
                            <option value="2008">2008</option>
                            <option value="2009">2009</option>
                            <option value="2010">2010</option>
                            <option value="2011">2011</option>
                            <option value="2012">2012</option>
                            <option value="2013">2013</option>
                            <option value="2014">2014</option>
                            <option value="2015">2015</option>
                            <option value="2016">2016</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
                            <option value="2032">2032</option>
                            <option value="2033">2033</option>
                            <option value="2034">2034</option>
                          </Input>
                        </div>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <div className="mb-3">
                          <Label>
                            From Year <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="toMonth"
                            name="toMonth"
                            className="form-control"
                            value={formData.toMonth}
                            onChange={handleInput} // Handle year change
                          >
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </Input>
                        </div>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <div className="mb-3">
                          <Label>
                            To Year <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="year"
                            name="toYear"
                            className="form-control"
                            value={formData.toYear}
                            onChange={handleInput}
                          >
                            <option value="2008">2008</option>
                            <option value="2009">2009</option>
                            <option value="2010">2010</option>
                            <option value="2011">2011</option>
                            <option value="2012">2012</option>
                            <option value="2013">2013</option>
                            <option value="2014">2014</option>
                            <option value="2015">2015</option>
                            <option value="2016">2016</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
                            <option value="2032">2032</option>
                            <option value="2033">2033</option>
                            <option value="2034">2034</option>
                          </Input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header py-3 bg_ligh">
                    <div className="row align-items-center d-flex">
                      <div className="col-xl-8">
                        <h4 className="header-title mb-0 text-success">
                          <i className="far fa-user text-success pe-2" />
                          Self Employed Settings
                        </h4>
                      </div>
                      <div className="col-xl-4 text-end"></div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 w-50">
                        <thead>
                          <tr className="border-b">
                            <th scope="row">Wage Categories</th>
                            <th>Weekly Income</th>
                            <th>Weekly Contribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {' '}
                              A <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                name="a"
                                value={formData.a} // Bind the value to formData
                                onChange={handleInput} // Handle the change
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                name="awc" // Updated name to match the field in formData
                                value={formData.awc} // Bind the value to formData
                                onChange={handleInput} // Handle the change
                                placeholder=""
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              B <span className="text-danger">*</span>
                            </td>
                            <td>
                            <input
                                type="number"
                                className="form-control"
                                name="b" // Updated name to match the field in formData
                                value={formData.b} // Bind the value to formData
                                onChange={handleInput} // Handle the change
                                placeholder=""
                              />
                            </td>
                            <td>
                            <input
                                type="number"
                                className="form-control"
                                name="bwc" // Updated name to match the field in formData
                                value={formData.bwc} // Bind the value to formData
                                onChange={handleInput} // Handle the change
                                placeholder=""
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              C <span className="text-danger">*</span>
                            </td>
                            <td>
                            <input
                                type="number"
                                className="form-control"
                                name="c"
                                value={formData.c} 
                                onChange={handleInput} 
                                placeholder=""
                              />
                            </td>
                            <td>
                            <input
                                type="number"
                                className="form-control"
                                name="cwc" 
                                value={formData.cwc}
                                onChange={handleInput} 
                                placeholder=""
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              D <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              E <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              F <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              G <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              H <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              I <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              J <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              K <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              L <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              M <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {' '}
                              Special <span className="text-danger">*</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder=""
                              />{' '}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-6 col-lg-6 col-xl-6 text-end">
                        <button type="button" className="btn btn-success px-4 me-3">
                          <i className="far fa-save pe-1" /> Save
                        </button>
                        <a
                          href="self-employed-settings.html"
                          type="button"
                          className="btn btn-light border px-4"
                        >
                          <i className="fas fa-times" /> Cancel
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{' '}
          {/* container-fluid */}
        </div>
        {/* End Page-content */}
        <sidebar-barrrrr></sidebar-barrrrr>
      </div>
      {/* end main content*/}
    </div>
  );
};
export default AddSelfEmployeeSetting;
