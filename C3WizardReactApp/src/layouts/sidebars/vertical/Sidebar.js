import { Button, Nav } from 'reactstrap';
import { useEffect, useState, useRef } from 'react';
import * as Icon from 'react-feather';

import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import SidebarData from '../sidebardata/SidebarData';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import { getRoleListSide } from '../../../store/apps/Admin/RolemanagementSlice';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';
import user1 from '../../../assets/images/users/user4.jpg';

const getIconComponent = (iconString) => {
  const match = iconString?.match(/<Icon\.(\w+)\s*\/?>/);
  if (match && match[1] && Icon[match[1]]) {
    const IconComponent = Icon[match[1]];
    return <IconComponent size={18} />;
  }
  return null;
};

const Sidebar = () => {
  const location = useLocation();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const roleId = localStorage.getItem('roleId');
  const activeBg = useSelector((state) => state.customizer.sidebarBg);
  const isFixed = useSelector((state) => state.customizer.isSidebarFixed);
  const { RoleListSide } = useSelector((state) => state.RoleSlice || {});
  const dispatch = useDispatch();

  useEffect(() => {
    if (roleId) {
      dispatch(getRoleListSide(Number(roleId)));
    }
  }, [dispatch, roleId]);

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));

  const visibleMenu = RoleListSide?.map((navi) => {
    if (navi.caption) return navi; // Always show captions

    if (navi.children && navi.children.length > 0) {
      const visibleChildren = navi.children.filter((child) => child.viewPermission !== false);

      if (visibleChildren.length > 0) {
        return {
          ...navi,
          children: visibleChildren,
        };
      }

      return null; // Hide parent if no visible children
    }

    if (navi.viewPermission === false) return null; // Hide item with no view permission

    return navi;
  }).filter(Boolean); // remove nulls

  return (
    <div className={`sidebarBox shadow bg-${activeBg} ${isFixed ? 'fixedSidebar' : ''}`}>
      <SimpleBar style={{ height: '100%' }}>
        {/********Logo*******/}
        <div className="d-flex p-3 align-items-center">
          {/* <Logo /> */}
          <Button
            close
            size="sm"
            className="ms-auto d-sm-block d-lg-none"
            onClick={() => dispatch(ToggleMobileSidebar())}
          />
        </div>
        {/********Sidebar Content*******/}
        <div className="py-0 text-center profile-area">
          <img src={user1} alt="John Deo" width={60} className="mb-2" />
        </div>
        <div>
          <Nav vertical className={activeBg === 'white' ? '' : 'lightText'}>
            {visibleMenu?.map((navi) => {
              const icon = getIconComponent(navi.icon);

              if (navi.caption) {
                return (
                  <div className="navCaption fw-bold text-uppercase mt-4" key={navi.caption}>
                    {navi.caption}
                  </div>
                );
              }

              if (navi.children && navi.children.length > 0) {
                return (
                  <NavSubMenu
                    key={navi.id}
                    icon={icon}
                    title={navi.title}
                    items={navi.children}
                    suffix={navi.suffix}
                    suffixColor={navi.suffixColor}
                    isUrl={currentURL === navi.href}
                  />
                );
              }

              return (
                <NavItemContainer
                  key={navi.id}
                  className={location.pathname === navi.href ? 'activeLink' : ''}
                  to={navi.href}
                  title={navi.title}
                  suffix={navi.suffix}
                  suffixColor={navi.suffixColor}
                  icon={icon}
                />
              );
            })}
          </Nav>
        </div>
      </SimpleBar>
    </div>
  );
};

export default Sidebar;
