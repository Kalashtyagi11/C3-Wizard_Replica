import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const roleId = localStorage.getItem('roleId');
  const roleName = localStorage.getItem('roleCategory');

  if (!roleId && !roleName) {
    return <Navigate to="/unauthorized" />;
  }

  const hasAccess = allowedRoles.includes(roleId) || allowedRoles.includes(roleName);

  return hasAccess ? children : <Navigate to="/unauthorized" />;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleBasedRoute;
