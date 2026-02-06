import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownItem } from 'reactstrap';
import { User, FileText, Star, Settings, Droplet } from 'react-feather';
import user1 from '../../assets/images/users/user2.jpg';
import { getProfile } from '../../store/apps/auth/AuthSlice';
import user from '../../assets/images/users/profile.png';

const ProfileDD = () => {
  const userId = parseInt(localStorage.getItem('userID'), 10);
  const { profileData } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getProfile(userId));
  }, []);

  return (
    <div>
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
    </div>
  );
};

export default ProfileDD;
