import React, { useEffect, useState } from 'react';
import { Label, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import DashboardService from '../../../service/dashboard/Dashboard';

const validationSchema = Yup.object({
  roleCategory: Yup.string().required('Role selection is required'),
  roleName: Yup.string().required('Role Name is required'),
  // descreption: Yup.string().required('Description is required'),
  createdBy: Yup.number().required('Created By is required'),
});

const AddRole = () => {
  const navigate = useNavigate();
  const [roleCategoryList, setRoleCategoryList] = useState([]);

  const formik = useFormik({
    initialValues: {
      roleId: 0,
      roleName: '',
      descreption: '',
      roleCategory: '',
      createdBy: parseInt(localStorage.getItem('roleId'), 10) || 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await DashboardService.postSaveRole(values);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong while saving role.');
      }
    },
  });

  const getAllRoles = async () => {
    try {
      const res = await DashboardService.getAllRoles();
      console.log('resulttttttt', res.data.data.roleCategories);
      setRoleCategoryList(res.data.data.roleCategories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <div id="layout-wrapper">
      <my-header />
      <sidebar-barrrrrr />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                <h5 className="fw-semibold mb-0">Add Role</h5>
                <ul className="d-flex align-items-center gap-2 list-unstyled">
                  <li className="fw-medium">
                    <Link
                      to="/admin-dashboard"
                      className="d-flex align-items-center gap-1 text-muted"
                    >
                      <i className="ti-home" /> Dashboard
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">
                    <Link
                      to="/admin/manage-users/my-users"
                      className="d-flex align-items-center gap-1 text-muted"
                    >
                      My Users
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">Add Role</li>
                </ul>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <h4 className="header-title mb-0 text-success">
                        <i className="far fa-user text-success pe-2" /> Add Role
                      </h4>
                    </div>

                    <div className="card-body profile">
                      <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Label>
                                Select Role Category <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                ///className="form-control"
                                name="roleCategory"
                                className={`form-control ${
                                  formik.touched.roleCategory && formik.errors.roleCategory
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.roleCategory}
                              >
                                <option value="" disabled>
                                  Select Role
                                </option>
                                {roleCategoryList.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.roleCategory && formik.errors.roleCategory && (
                                <div className="invalid-feedback">{formik.errors.roleCategory}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Label>
                                Role Name <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="text"
                                className={`form-control ${
                                  formik.touched.roleName && formik.errors.roleName
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                name="roleName"
                                placeholder="Enter Role Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.roleName}
                              />
                              {formik.touched.roleName && formik.errors.roleName && (
                                <div className="invalid-feedback">{formik.errors.roleName}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <Label>Description</Label>
                              <input
                                type="text"
                                className={`form-control ${
                                  formik.touched.descreption && formik.errors.descreption
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                name="descreption"
                                placeholder="Enter Description"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.descreption}
                              />
                              {/* {formik.touched.descreption && formik.errors.descreption && (
                                <div className="invalid-feedback">{formik.errors.descreption}</div>
                              )} */}
                            </div>
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-md-4">
                            <button type="submit" className="btn btn-success px-4 me-3">
                              <i className="far fa-save pe-1" /> Save
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(-1)}
                              className="btn btn-light border px-4"
                            >
                              <i className="fas fa-times" /> Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <sidebar-barrrrr />
      </div>
    </div>
  );
};

export default AddRole;
