/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { useEffect, useState, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import './assets/css/app.min.css';
import { useRoutes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Themeroutes from './routes/Router';
import ThemeSelector from './layouts/theme/ThemeSelector';
import Loader from './layouts/loader/Loader';
import { getRoleList, getRoleById } from './store/apps/Admin/RolemanagementSlice';
// import {
//   getEmployeeList,
// } from './store/apps/employee/EmployeeSlice';

import './assets/css/icons.css';
import { getProfiles } from './store/apps/auth/AuthSlice';

const App = () => {
  const routing = useRoutes(Themeroutes);
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});
  const direction = useSelector((state) => state.customizer.isRTL);
  const isMode = useSelector((state) => state.customizer.isDark);
  const dispatch = useDispatch();
  const roleId = parseInt(localStorage.getItem('roleId'), 10);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const userId = parseInt(localStorage.getItem('userID'), 10);
  const CompanyId = localStorage.getItem('companyId');

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localStorage.setItem('timezone', userTimeZone);
  }, []);

  useEffect(() => {
    if (RoleList) {
      localStorage.setItem('roleList', JSON.stringify(RoleList));
    }
  }, [RoleList]);

  useEffect(() => {
    if (userId) {
      dispatch(getProfiles(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (roleId) {
      dispatch(getRoleList(Number(roleId)));
    }
  }, [dispatch, roleId]);

  return (
    <Suspense fallback={<Loader />}>
      <div
        className={`${direction ? 'rtl' : 'ltr'} ${isMode ? 'dark' : ''}`}
        dir={direction ? 'rtl' : 'ltr'}
      >
        <ThemeSelector />
        {routing}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          closeOnClick
          theme="light"
          style={{ zIndex: 999999 }}
        />
      </div>
    </Suspense>
  );
};

export default App;
