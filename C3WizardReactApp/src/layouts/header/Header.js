import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import Select from 'react-select';
import { useEffect, useState, useRef } from 'react';

import {
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Label,
} from 'reactstrap';
import { MessageSquare, User } from 'react-feather';
import * as Icon from 'react-feather';
import MessageDD from './MessageDD';
import MegaDD from './MegaDD';
import NotificationDD from './NotificationDD';
import logo1 from '../../assets/images/c3-logo1.png';

import { ToggleMiniSidebar, ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';
import LogoDarkText from '../../assets/images/logos/logo-text.png';
import user from '../../assets/images/users/profile.png';
import { getCompanyDropdown, getContribution } from '../../store/apps/dashboard/DashboardSlice';
import { logout, getProfile } from '../../store/apps/auth/AuthSlice';
import { EmployersGetByHeader, EmployersGetById } from '../../store/apps/employer/EmployerSlice';

const Header = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [name, setName] = useState('');
  const companyId = localStorage.getItem('companyId');
  const userId = parseInt(localStorage.getItem('userID'), 10);
  const UserId = parseInt(localStorage.getItem('userID'), 10);

  const { CompanyDropdown } = useSelector((state) => state.dashboardSlice || {});
  const { EmployersHeader } = useSelector((state) => state.employerSlice);
  const logId = localStorage.getItem('logId');
  const roleId = parseInt(localStorage.getItem('roleId'), 10);
  const CategoryType = localStorage.getItem('roleCategory');
  const { profileData } = useSelector((state) => state.authSlice);
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    () => JSON.parse(localStorage.getItem('selectedCompanyId')) || '',
  );
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (CompanyDropdown?.length > 0) {
      const parentCompany = CompanyDropdown.find((c) => c.parent_Id === 0);
      const savedCompanyId = localStorage.getItem('companyId');
      const savedCompany = savedCompanyId
        ? CompanyDropdown.find((c) => c.company_Id === parseInt(savedCompanyId, 10))
        : null;

      if (parentCompany) {
        setSelectedOption({
          value: parentCompany.company_Id,
          label: parentCompany.company_Name,
        });
        localStorage.setItem('companyName', parentCompany.company_Name);
        if (parentCompany.companyLogo) {
          localStorage.setItem('companyLogo', parentCompany.companyLogo);
        }
      } else if (savedCompany) {
        setSelectedOption({
          value: savedCompany.company_Id,
          label: savedCompany.company_Name,
        });
        localStorage.setItem('companyName', savedCompany.company_Name);
        if (savedCompany.companyLogo) {
          localStorage.setItem('companyLogo', savedCompany.companyLogo);
        }
      }
    }
  }, [CompanyDropdown]);

  const options = CompanyDropdown?.map((item) => ({
    value: item.company_Id,
    label: item.company_Name,
  }));

  const handleChange = (selected) => {
    setSelectedOption(selected);

    const selectedCompany = CompanyDropdown.find((item) => item.company_Id === selected.value);

    if (selectedCompany) {
      // Save companyId and regNumber
      localStorage.setItem('companyId', selectedCompany.company_Id);
      localStorage.setItem('reG_NUMBER', selectedCompany.reG_NUMBER);
      dispatch(EmployersGetByHeader({ companyId: selectedCompany.company_Id, UserId }));

      // Determine parent or self
      const parentCompany =
        selectedCompany.parent_Id > 0
          ? CompanyDropdown.find((c) => c.company_Id === selectedCompany.parent_Id)
          : selectedCompany;

      // Save name and logo
      localStorage.setItem('companyName', parentCompany.company_Name);
      if (parentCompany.companyLogo) {
        localStorage.setItem('companyLogo', parentCompany.companyLogo);
      } else {
        localStorage.removeItem('companyLogo'); // fallback if no logo
      }
    }

    navigate('/apps/dashboard');
  };

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch]);

  const handleSubmit = () => {
    dispatch(logout({ logId })).unwrap();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const dropDownload = {
    ParentId: localStorage.getItem('mainDropDownId'),
    UserID: localStorage.getItem('userID'),
    roleId: localStorage.getItem('roleId'),
  };

  useEffect(() => {
    dispatch(getCompanyDropdown(dropDownload));
  }, []);

  useEffect(() => {
    if (CompanyDropdown[0]?.company_Name !== undefined) {
      setName(CompanyDropdown[0].company_Name);
    }
    //
  }, [CompanyDropdown]);

  const handleSelect = (company) => {
    setName(company.company_Name);
    setSelectedCompanyId(company.company_Id);
    setIsOpen(false);
    localStorage.setItem('companyId', company.company_Id);
  };

  useEffect(() => {
    if (companyId) {
      dispatch(
        getContribution({ companyId, ResultArea: 'D', FromMonth: '', ToMonth: '', Year: '' }),
      );
    }
  }, [companyId]);

  useEffect(() => {
    dispatch(EmployersGetById({ companyId, UserId }));
  }, [dispatch]);

  return (
    <Navbar
      // color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="topbar"
      style={{ backgroundColor: '#ededed' }}
    >
      {/**********Toggle Buttons**********/}
      {/******************************/}
      <div className="d-flex align-items-center">
        <Button
          // color={topbarColor}
          className="d-none d-lg-block"
          onClick={() => dispatch(ToggleMiniSidebar())}
          style={{ backgroundColor: 'inherit', border: '0px' }}
        >
          <Icon.Menu size={22} />
        </Button>
        <div href="/" className="d-sm-flex d-lg-none d-none">
          <img src={profileData?.profileImage || LogoDarkText} alt="Company" />
        </div>
        <Button
          color={topbarColor}
          className="d-sm-block d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          <Icon.Menu size={22} />
        </Button>
      </div>

      {/******************************/}
      {/**********Left Nav Bar**********/}
      {/******************************/}

      <Nav className="me-auto d-none d-lg-flex" navbar>
        <NavItem className="app-search ps-3">
          {CategoryType === 'Company' && (
            <img
              // src={EmployersHeader?.companyLogo || logo1}

              src={localStorage.getItem('companyLogo') || logo1}
              alt="Default"
              className="image-preview1"
              onError={(e) => {
                e.target.src = logo1;
              }}
              style={{ height: '46px' }}
            />
          )}
        </NavItem>
      </Nav>

      <div className="d-flex align-items-center">
        {/******************************/}
        {/**********Message DD**********/}
        {/******************************/}
        {CategoryType !== 'SSB' && CategoryType !== 'SelfEmployee' && (
          <div className="adjustment_logo">
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={options}
              placeholder="Select Company"
              // isClearable
            />
          </div>
        )}
        {/******************************/}
        {CategoryType !== 'SSB' && CategoryType !== 'Company' && (
          <div className="Company_name">
            {`${profileData?.firstName || ''} ${profileData?.lastName || ''} `}&nbsp;(
            {profileData?.regNumber})
          </div>
        )}

        <UncontrolledDropdown>
          <DropdownToggle style={{ backgroundColor: 'inherit', border: 'inherit' }}>
            <img
              src={profileData?.profileImage ? profileData.profileImage : user}
              onError={(e) => {
                e.target.src = user;
              }} // Fallback if image
              alt="profile"
              className="rounded-circle"
              width="38"
              height="38"
            />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            {/* <ProfileDD /> */}
            <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
              <img
                src={profileData?.profileImage ? profileData.profileImage : user}
                onError={(e) => {
                  e.target.src = user;
                }} // Fallback if image fails to load
                alt="profile"
                className="rounded-circle"
                width="50"
                height="50"
              />
              <span>
                <h5 className="mb-0 fw-medium">{profileData?.firstName}</h5>
                <small className="text-muted">{profileData?.emailId}</small>
              </span>
            </div>
            <Link
              to="/apps/profile"
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <DropdownItem className="px-4 py-3" style={{ cursor: 'pointer' }}>
                <User size={20} className="text-muted" /> <span>My Profile</span>
              </DropdownItem>
            </Link>
            <DropdownItem divider />
            <Link
              to="/apps/changepassword"
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <DropdownItem className="px-4 py-3" style={{ cursor: 'pointer' }}>
                <Icon.Lock size={20} className="text-muted" />
                &nbsp; Change Password
              </DropdownItem>
            </Link>

            {CategoryType !== 'SSB' && (
              <>
                <DropdownItem divider />
                <Link
                  to="/apps/cardDetail"
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <DropdownItem className="px-4 py-3" style={{ cursor: 'pointer' }}>
                    <Icon.Settings size={20} className="text-muted" />
                    &nbsp; Card Detail
                  </DropdownItem>
                </Link>
              </>
            )}
            <DropdownItem divider />
            {CategoryType !== 'SSB' && roleId !== 4 && !(EmployersHeader?.parentCompanyId > 0) && (
              <>
                <Link
                  to="/apps/questionAnswer"
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <DropdownItem className="px-4 py-3" style={{ cursor: 'pointer' }}>
                    <Icon.HelpCircle size={20} className="text-muted" />
                    &nbsp; Question & Answer
                  </DropdownItem>
                </Link>
                <DropdownItem divider />
              </>
            )}

            <div className="p-2 px-3">
              <Button onClick={handleSubmit} className="btn-light" size="sm">
                Logout
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Navbar>
  );
};

export default Header;
