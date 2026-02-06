import React, { useEffect, useState } from 'react';
import { Label, Input } from 'reactstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getRoleById } from '../../../store/apps/dashboard/DashboardSlice';
import DashboardService from '../../../service/dashboard/Dashboard';

const validationSchema = Yup.object({
  roleName: Yup.string().required('Role Name is required'),
  //  descreption: Yup.string().required('Description is required'),
  createdBy: Yup.number().required('Created By is required'),
  roleCategory: Yup.string().required('Role Category is required'),
});

const UpdateRole = () => {
  const { id } = useParams();
  const numericId = parseInt(id, 10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [roleCategoryList, setRoleCategoryList] = React.useState([]);
  const [loading, setLoading] = useState(false);

  const { RoleById } = useSelector((state) => state.dashboardSlice);

  const formik = useFormik({
    initialValues: {
      roleId: 0,
      // roleName: 'gdgyew',
      // descreption: 'jdjewed',
      roleName: RoleById?.role || '',
      descreption: RoleById?.description || '',
      createdBy: parseInt(localStorage.getItem('roleId'), 10) || 0,
      roleCategory: RoleById?.roleCategory || '',
    },
    enableReinitialize: true, // ✅ Important to allow form to update when data changes
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = { ...values };
        const res = await DashboardService.updateRole(payload);

        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong while saving role.');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getRoleById(numericId));
      console.log('RoleByIddddddddd', RoleById);
    }
  }, [dispatch, numericId]);

  useEffect(() => {
    const fetchRoleCategories = async () => {
      const res = await DashboardService.getAllRoles();

      setRoleCategoryList(res.data.data.roleCategories);
    };
    fetchRoleCategories();
  }, []);

  useEffect(() => {
    if (RoleById) {
      formik.setValues({
        //roleId: RoleById.roleId,
        roleId: parseInt(RoleById.roleId, 10) || 0,
        roleName: RoleById.role || '',
        descreption: RoleById.description || '',
        createdBy: RoleById.createdBy || parseInt(localStorage.getItem('roleId'), 10) || 0,
        roleCategory: RoleById.roleCategory || '',
      });
    }
  }, [RoleById]);

  return (
    <div id="layout-wrapper">
      <my-header />
      <sidebar-barrrrrr />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                {/* <h5 className="fw-semibold mb-0">Update Role</h5> */}
                {/* <ul className="d-flex align-items-center gap-2 list-unstyled">
                  <li className="fw-medium">
                    <Link to="#" className="d-flex align-items-center gap-1 text-muted">
                      <i className="ti-home" /> Dashboard
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">Update Role</li>
                </ul> */}
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <h4 className="header-title mb-0 text-success">
                        <i className="far fa-user text-success pe-2" /> Update Role
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
                                className="form-control"
                                name="roleCategory"
                                // className={`form-select ${formik.touched.roleCategory && formik.errors.roleCategory ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.roleCategory}
                                disabled
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
                              {/* {formik.touched.roleCategory && formik.errors.roleCategory && (
                                <div className="invalid-feedback">{formik.errors.roleCategory}</div>
                              )} */}
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
                            <button
                              type="submit"
                              className="btn btn-success px-4 me-3"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="far fa-save pe-1"></i> Save
                                </>
                              )}
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

export default UpdateRole;
