import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import React, { useEffect, useState, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Button,
  Modal,
  ModalHeader,
} from 'reactstrap';
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import Loader from '../../../layouts/loader/Loader';

const RealtionShipSetting = React.forwardRef((props, ref) => {
  const { onLoadingChange } = props || {};
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loadingSubmit, setloadingSubmit] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [dropdownCompanyList, setDropdownCompanyList] = useState([]);
  const [dropdownCompanyListChild, setDropdownCompanyListChild] = useState([]);
  const [alreadyMappedList, setAlreadyMappedList] = useState([]);
  const [showPopup, setShowPopup] = useState(false); //
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  // const [selectedChildren, setSelectedChildren] = useState([]);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [removedCompanyDetails, setRemovedCompanyDetails] = useState([]);

  const getAllCompanyDataHandler = async (companyId = 0, shouldAutoSelect = false) => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllMapingData(companyId);
      // setDropdownCompanyList(res.data.data.parentcompany);
      // setDropdownCompanyListChild(res.data.data.childcomp || []);
      const data = res?.data?.data || {};

      const uniqueChildCompanies = (data.childcomp || []).filter(
        (value, index, self) => index === self.findIndex((t) => t.companyId === value.companyId),
      );

      setDropdownCompanyList(data.parentcompany || []);
      setDropdownCompanyListChild(uniqueChildCompanies);

      // Auto-select children matching the parentId after data is fetched
      if (shouldAutoSelect && companyId) {
        const matchingChildren = uniqueChildCompanies
          .filter((child) => Number(child.parentId) === Number(companyId))
          .map((child) => child.companyId);
        setSelectedChildren(matchingChildren);
      }
    } catch (error) {
       console.error('Something went wrong:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const MappingCompaniesubmit = async () => {
    // Basic validations
    if (!selectedParent) {
      toast.error('Please select a parent company');
      return;
    }
    if (!selectedChildren || selectedChildren.length === 0) {
      toast.error('Please select at least one child company');
      return;
    }
    setloadingSubmit(true);
    if (typeof onLoadingChange === 'function') onLoadingChange(true);
    try {
      const res = await UserManagementServices.MappingCompanies({
        companyId: selectedParent,
        parentCompanyId: selectedChildren,
      });

      setModalMsg(res?.data?.msg || 'Operation completed.');

      // If company details exist, show them in modal
      if (res?.data?.data) {
        setModalData(res.data.data);
        setShowModal(true);
      } else {
        toast.success(res?.data?.msg || 'Success');
      }
      getAllCompanyDataHandler(selectedParent || 0, true);
    } catch (error) {
       console.error('Something went wrong:', error);
    } finally {
      setloadingSubmit(false);
      if (typeof onLoadingChange === 'function') onLoadingChange(false);
    }
  };

  // Expose submit() to parent (footer button)
  useImperativeHandle(ref, () => ({
    submit: () => {
      MappingCompaniesubmit();
    },
  }));

  // Prepare options for dropdown
  const options = dropdownCompanyList
    .filter((item) => item.companyName !== 'SSB')
    .sort((a, b) => a.companyName.localeCompare(b.companyName))
    .map((item) => ({
      value: item.companyId,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`,
      regNumber: item.regNumber,
    }));
  const optionsChild = dropdownCompanyListChild
    .filter((item) => item.companyName !== 'SSB')
    .sort((a, b) => a.companyName.localeCompare(b.companyName))
    .map((item) => ({
      value: item.companyId,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`,
      parentId: item.parentId,
    }));

  const handleParentChange = (option) => {
    const parentId = option?.value || null;
    setSelectedParent(parentId);

    if (!parentId) {
      setSelectedChildren([]);
      getAllCompanyDataHandler(0);
    } else {
      getAllCompanyDataHandler(parentId, true);
    }
  };

  const handleChildrenChange = (newOptions) => {
    const newValues = newOptions ? newOptions.map((opt) => opt.value) : [];

    // Detect removed options
    const removed = selectedChildren.filter((val) => !newValues.includes(val));

    if (removed.length > 0) {
      setPendingSelection(newValues);

      const details = removed
        .map((id) => dropdownCompanyListChild.find((c) => Number(c.companyId) === Number(id)))
        .filter(Boolean)
        .map((c) => ({
          companyId: c.companyId,
          companyName: c.companyName,
          userList: Array.isArray(c.userList) ? c.userList : [],
        }));
      setRemovedCompanyDetails(details);
      setShowConfirmModal(true);
    } else {
      setSelectedChildren(newValues);
    }
  };

  const confirmRemove = () => {
    setShowConfirmModal(false);

    setTimeout(async () => {
      try {
        setloadingSubmit(true);
        if (typeof onLoadingChange === 'function') onLoadingChange(true);

        setSelectedChildren(pendingSelection);

        const res = await UserManagementServices.MappingCompanies({
          companyId: selectedParent,
          parentCompanyId: pendingSelection,
        });

        setModalMsg(res?.data?.msg || 'Operation completed.');

        if (res?.data?.data) {
          setModalData(res.data.data);
          setShowModal(true);
        } else {
          toast.success(res?.data?.msg || 'Success');
        }

        await getAllCompanyDataHandler(selectedParent || 0, true);
      } catch (error) {
        
        toast.error('Error submitting mapping');
      } finally {
        setloadingSubmit(false);
        if (typeof onLoadingChange === 'function') onLoadingChange(false);
        setRemovedCompanyDetails([]);
      }
    }, 0); // small delay to allow React state update to complete
  };

  const cancelRemove = () => {
    setPendingSelection(null);
    setShowConfirmModal(false);
    setRemovedCompanyDetails([]);
  };

  useEffect(() => {
    getAllCompanyDataHandler(0);
  }, []);

  return (
    <>
      <Helmet>
        <title>RealationShip-Companies</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr />

        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="row">
                  <div className="col-xl-12 px-0">
                    <div className="card">
                      <div className="card-header py-2 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="card-body pb-5">
                            <div className="row pb-5">
                              {/* Parent Company */}
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <h6 className="fw-bold mb-2">Parent Company</h6>
                                <div className="select-wrapper">
                                  <Select
                                    options={options}
                                    value={
                                      options.find((opt) => opt.value === selectedParent) || null
                                    }
                                    onChange={handleParentChange}
                                    placeholder="Search by employer name or reg number"
                                    isSearchable
                                    isClearable
                                    classNamePrefix="custom-select"
                                    styles={{
                                      control: () => ({
                                        padding: '0px',
                                      }),
                                    }}
                                  />
                                  {loadingDropdown && (
                                    <Spinner size="sm" color="primary" className="select-spinner" />
                                  )}
                                </div>
                              </div>

                              {/* Child Companies */}
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <h6 className="fw-bold mb-2">Child Companies</h6>
                                <div className="select-wrapper">
                                  <Select
                                    options={optionsChild}
                                    value={optionsChild.filter((opt) =>
                                      selectedChildren.includes(opt.value),
                                    )}
                                    onChange={handleChildrenChange}
                                    placeholder="Select child companies"
                                    isSearchable
                                    isClearable={false}
                                    components={{ ClearIndicator: () => null }}
                                    isMulti
                                    isLoading={loadingDropdown}
                                    classNamePrefix="custom-select"
                                    styles={{
                                      control: () => ({
                                        padding: '0px',
                                      }),
                                    }}
                                  />
                                  {loadingDropdown && (
                                    <Spinner size="sm" color="primary" className="select-spinner" />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Save action moved to modal footer */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && modalData && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header ">
                <h5 className="modal-title">Mapping Result</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <h6 className="fw-bold mb-3">{modalMsg}</h6>

                <div className="row">
                  {/* ✅ Mapped */}
                  <div className="col-md-4">
                    <h6 className="text-success fw-bold">✅ Mapped</h6>
                    {modalData?.mapped?.length > 0 ? (
                      <ul className="mb-3">
                        {modalData.mapped.map((company, idx) => (
                          <li key={company.companyId || idx}>
                            {company.companyName || JSON.stringify(company)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>None</p>
                    )}
                  </div>

                  {/* ❌ Unmapped */}
                  <div className="col-md-4">
                    <h6 className="text-danger fw-bold">❌ Unmapped</h6>
                    {modalData?.unmapped?.length > 0 ? (
                      <ul className="mb-3">
                        {modalData.unmapped.map((company, idx) => (
                          <li key={company.companyId || idx}>
                            {company.companyName || JSON.stringify(company)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>None</p>
                    )}
                  </div>

                  {/* ⚠️ Already Linked */}
                  <div className="col-md-4">
                    <h6 className="text-warning fw-bold">⚠️ Already Linked</h6>
                    {modalData?.alreadyMapped?.length > 0 ? (
                      <ul className="mb-3">
                        {modalData.alreadyMapped.map((company, idx) => (
                          <li key={company.companyId || idx}>
                            {company.companyName || JSON.stringify(company)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  className="btn-light btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
             {showPopup && (
        <div
          className="custom-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            className="custom-modal bg-white p-4 rounded shadow"
            style={{ width: '450px', maxHeight: '80vh', overflowY: 'auto' }}
          >
            <h5 className="mb-3 text-danger">Already Mapped Companies</h5>
            <ul>
              {alreadyMappedList.map((c) => (
                <li key={c.companyId}>
                  <strong>{c.companyName}</strong>)
                </li>
              ))}
            </ul>

            <div className="text-end mt-3">
              <button type="submit"
                className="btn btn-secondary"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

      <Modal isOpen={showConfirmModal} toggle={cancelRemove} zIndex={110000}>
        <ModalHeader toggle={cancelRemove}>Confirm Action</ModalHeader>
        <div className="modal-body">
          <div className="mb-2">
            Are you sure you want to remove the mapping between{' '}
            <strong>
              {dropdownCompanyList.find((p) => p.companyId === selectedParent)?.companyName ||
                'Parent'}
            </strong>{' '}
            (Parent Company) and&nbsp;
            <strong>
              {removedCompanyDetails.map((c) => c.companyName).join(', ') || 'Child'}
            </strong>{' '}
            (Sub Company)?
            {/* <div> Removing this mapping will:</div> */}
            <div>Removing this mapping will revoke access for the following user(s):</div>
          </div>
          {/* {removedCompanyDetails?.length > 0 && (
            <ul className="mb-0">
              {removedCompanyDetails.map((c) => (
                <li key={c.companyId}>
                  {c.companyName}
                  {c.userList?.length > 0 && (
                    <ul className="mt-1 ms-3">
                      {c.userList.map((u, idx) => (
                        <li key={idx}>{u}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )} */}
          {/* {removedCompanyDetails?.length > 0 && (
            <ul className="mb-0 user-list">
              {removedCompanyDetails.map(
                (c) =>
                  c.userList?.length > 0 && c.userList.map((u, idx) => <li key={idx}> {u}</li>),
              )}
            </ul>
          )} */}
          {removedCompanyDetails?.length > 0 && (
            <>
              {/* <div className="mb-2 fw-semibold">Remove access for the fol/lowing acccess:</div> */}
              <ul className="mb-0 user-list">
                {removedCompanyDetails.map(
                  (c) =>
                    c.userList?.length > 0 &&
                    c.userList.map((u, idx) => (
                      <li key={idx} className="user-item">
                        <Icon.User size={16} className="me-2 text-primary" />
                        <span className="fw-bo">{u}</span>
                      </li>
                    )),
                )}
              </ul>
            </>
          )}

          <div className="mt-3">This action cannot be undone. Do you want to continue?</div>
        </div>
        <div className="modal-footer">
          <Button type="button" className="btn-light btn-secondary" onClick={cancelRemove}>
            Cancel
          </Button>
          <Button type="submit" className="btn btn-success  fw-bold" onClick={confirmRemove}>
            Yes, Remove
          </Button>
        </div>
      </Modal>
    </>
  );
});

export default RealtionShipSetting;
