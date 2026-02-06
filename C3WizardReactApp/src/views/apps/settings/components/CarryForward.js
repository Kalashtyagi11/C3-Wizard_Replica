// import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
// import PropTypes from 'prop-types';
// import Select from 'react-select';
// import { Button } from 'reactstrap';
// import * as Yup from 'yup';
// import * as Icon from 'react-feather';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import LevySettingsServices from '../../../../service/settings/LevySetting';

// // Year list for dropdown
// // const yearsList = Array.from({ length: 2040 - 2018 + 1 }, (_, i) => 2018 + i);

// const CarryForward = ({
//   yearsList,
//   setYear,
//   setShow,
//   setEditData,
//   setSelectedEditYear,
//   refreshList,
// }) => {
//   const formik = useFormik({
//     initialValues: {
//       yearFrom: '',
//       toYear: '',
//     },
//     // validationSchema:Yup.object({
//     //     yearFrom: Yup.string()
//     //       .required('From year is required'),
//     //     toYear: Yup.string()
//     //       .required('To year is required')
//     //       .notOneOf([Yup.ref('yearFrom')], 'From and To year cannot be the same'),
//     //   }),
//     onSubmit: async (values, { resetForm }) => {
//       if (!values.yearFrom) {
//         toast.warn('Select from year for carry forward the data.');
//         return;
//       }

//       if (!values.toYear) {
//         toast.warn('Select to year for carry forward the data.');
//         return;
//       }
//       try {
//         const res = await LevySettingsServices.carryForwardSettings(values);
//         if (res.data) {
//           toast.success('Data has been successfully carried forward.');
//           setYear(values.toYear);
//           resetForm();
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     },
//   });

//   // const yearOptions = yearsList?.map((item) => ({
//   //   value: item,
//   //   label: item.toString(),
//   // }));
//   const yearOptions = yearsList?.map((item) => ({
//     value: item.value,
//     label: item.key,
//     showToYear: item.showToYear,
//   }));

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <div className="row px-3">
//         <div
//           className="col-lg-3
//         "
//         ></div>
//         <div className="col-lg-12 align-items-center ">
//           <div className="p-2 bg_ligh  row ">
//             <div className="col-xl-3 col-3 my-1">
//               <Select
//                 id="yearFrom"
//                 name="yearFrom"
//                 options={yearOptions}
//                 value={
//                   yearOptions.find((option) => option.value === formik.values.yearFrom) || null
//                 }
//                 onChange={(selectedOption) =>
//                   formik.setFieldValue('yearFrom', selectedOption ? selectedOption.value : '')
//                 }
//                 onBlur={() => formik.setFieldTouched('yearFrom', true)}
//                 isClearable
//                 isSearchable
//                 placeholder="Select From Year"
//               />
//             </div>
//             <div className="col-xl-1 col-1 my-0">
//               <span
//                 style={{
//                   color: 'red',
//                   fontWeight: 'bold',
//                   paddingBottom: '6px',
//                   marginTop: '10px',
//                   display: 'block',
//                   textAlign: 'center',
//                 }}
//               >
//                 ==&gt;
//               </span>{' '}
//             </div>
//             <div className="col-xl-4 col-4 my-1">
//               <div className="d-flex">
//                 <div style={{ width: '73%' }}>
//                   <Select
//                     id="toYear"
//                     name="toYear"
//                     options={yearOptions.filter((r) => r.showToYear === false)}
//                     value={
//                       yearOptions.find((option) => option.value === formik.values.toYear) || null
//                     }
//                     onChange={(selectedOption) =>
//                       formik.setFieldValue('toYear', selectedOption ? selectedOption.value : '')
//                     }
//                     onBlur={() => formik.setFieldTouched('toYear', true)}
//                     isClearable
//                     isSearchable
//                     placeholder="Select To Year"
//                   />
//                 </div>

//                 <OverlayTrigger
//                   placement="top"
//                   overlay={<Tooltip id="tooltip-add-levy">Configure New Tax Levy Year</Tooltip>}
//                 >
//                   <Button
//                     className="btn btn-success "
//                     // onClick={() => setShow(true)}
//                     onClick={() => {
//                       setEditData(null); // ✅ Clear any existing edit data
//                       setSelectedEditYear(null); // (Optional) clear selected year
//                       setShow(true); // ✅ Open modal in Add mode
//                     }}
//                   >
//                     <Icon.Plus size={16} className="me-1" /> Add
//                   </Button>
//                 </OverlayTrigger>
//               </div>
//             </div>
//             <div className="col-xl-4 d-flex justify-content-end my-1">
//               <button className="btn btn-success waves-effect waves-light h-45" type="submit">
//                 <i className="fas fa-paper-plane pe-1"></i> Carry Forward
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// CarryForward.propTypes = {
//   yearsList: PropTypes.arrayOf(PropTypes.number).isRequired,
//   setYear: PropTypes.func.isRequired,
//   setShow: PropTypes.func.isRequired,
//   setEditData: PropTypes.func.isRequired,
//   setSelectedEditYear: PropTypes.func.isRequired,
//   refreshList: PropTypes.func,
// };

// export default CarryForward;

import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button, Modal, Spinner } from 'reactstrap';
import * as Icon from 'react-feather';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import LevySettingsServices from '../../../../service/settings/LevySetting';

const CarryForward = ({
  yearsList,
  setYear,
  setShow,
  setEditData,
  setSelectedEditYear,
  refreshList,
  refreshYears,
}) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const [isCarryingForward, setIsCarryingForward] = useState(false);

  const formik = useFormik({
    initialValues: {
      yearFrom: '',
      toYear: '',
    },
    onSubmit: (values) => {
      if (!values.yearFrom) {
        toast.error('Select from year for carry forward the data.');
        return;
      }
      if (!values.toYear) {
        toast.error('Select to year for carry forward the data.');
        return;
      }

      if (values.yearFrom > values.toYear) {
        toast.error('From year cannot be greater than To year.');
        return;
      }

      // Store the values and show the confirmation modal
      setPendingValues(values);
      setConfirmModal(true);
    },
  });

  const confirmCarryForward = async () => {
    setIsCarryingForward(true);
    try {
      const res = await LevySettingsServices.carryForwardSettings(pendingValues);
      if (res.data) {
        toast.success('Data has been successfully carried forward.');
        setYear(pendingValues.toYear);
        formik.resetForm();
        if (refreshYears) await refreshYears();
        if (refreshList) refreshList();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to carry forward data.');
    } finally {
      setConfirmModal(false);
      setPendingValues(null);
      setIsCarryingForward(false);
    }
  };

  const yearOptions = yearsList?.map((item) => ({
    value: item.value,
    label: item.key,
    showToYear: item.showToYear,
  }));

  const getYearLabel = (value) => {
    return yearsList?.find((item) => item.value === value)?.key || value || '—';
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="row px-3">
          <div className="col-lg-3"></div>
          <div className="col-lg-12 align-items-center ">
            <div className="p-2 bg_ligh row">
              <div className="col-xl-3 col-3 my-1">
                <Select
                  id="yearFrom"
                  name="yearFrom"
                  options={yearOptions}
                  value={
                    yearOptions.find((option) => option.value === formik.values.yearFrom) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue('yearFrom', selectedOption ? selectedOption.value : '')
                  }
                  onBlur={() => formik.setFieldTouched('yearFrom', true)}
                  isClearable
                  isSearchable
                  placeholder="Select From Year"
                />
              </div>
              <div className="col-xl-1 col-1 my-0">
                <span
                  style={{
                    color: 'red',
                    fontWeight: 'bold',
                    marginTop: '10px',
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  ==&gt;
                </span>
              </div>
              <div className="col-xl-4 col-4 my-1">
                <div className="d-flex">
                  <div style={{ width: '73%' }}>
                    <Select
                      id="toYear"
                      name="toYear"
                      options={yearOptions.filter((r) => r.showToYear === false)}
                      value={
                        yearOptions.find((option) => option.value === formik.values.toYear) || null
                      }
                      onChange={(selectedOption) =>
                        formik.setFieldValue('toYear', selectedOption ? selectedOption.value : '')
                      }
                      onBlur={() => formik.setFieldTouched('toYear', true)}
                      isClearable
                      isSearchable
                      placeholder="Select To Year"
                    />
                  </div>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-add-levy">Configure New Tax Levy Year</Tooltip>}
                  >
                    <Button
                      className="btn btn-success ms-2"
                      onClick={() => {
                        setEditData(null);
                        setSelectedEditYear(null);
                        setShow(true);
                      }}
                    >
                      <Icon.Plus size={16} className="me-1" /> Add
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
              <div className="col-xl-4 d-flex justify-content-end my-1">
                <button className="btn btn-success waves-effect waves-light h-45" type="submit">
                  <i className="fas fa-paper-plane pe-1"></i> Carry Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
        <div className="modal-header">
          <h5 className="modal-title">Confirm Carry Forward</h5>
          <button type="button" className="btn-close" onClick={() => setConfirmModal(false)} />
        </div>
        <div className="modal-body">
          Are you sure you want to carry forward levy setting details from period&nbsp;
          {getYearLabel(pendingValues?.yearFrom)} to period&nbsp;
          {getYearLabel(pendingValues?.toYear)}
        </div>
        <div className="modal-footer">
          <Button color="secondary" className="btn-light" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={confirmCarryForward} disabled={isCarryingForward}>
            {isCarryingForward ? (
              <>
                <Spinner size="sm" className="me-1" /> Forwarding...
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

CarryForward.propTypes = {
  yearsList: PropTypes.array.isRequired,
  setYear: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
  setEditData: PropTypes.func.isRequired,
  setSelectedEditYear: PropTypes.func.isRequired,
  refreshList: PropTypes.func,
  refreshYears: PropTypes.func,
};

export default CarryForward;
