// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   TabPane,
// } from 'reactstrap';

// import HolidayPayForm from './HolidayPayForm';
// import BonusPayForm from './BonusPayForm';

// const EmployeePayTabsModal = ({
//   isOpen,
//   toggle,
//   loading,
//   selectedRow,
//   onSaveHoliday,
//   onSaveBonus,
//   monthFromState,
//   yearFromState,
// }) => {
//   const [activeTab, setActiveTab] = useState(null);
//   const [availableTabs, setAvailableTabs] = useState([]);

//   useEffect(() => {
//     if (selectedRow) {
//       const tabs = [];
//       if (selectedRow.bonus && parseFloat(selectedRow.bonus) > 0) tabs.push('bonus');
//       if (
//         (selectedRow.holidayPayId && selectedRow.holidayPayId > 0) ||
//         (selectedRow.hpay && parseFloat(selectedRow.hpay) > 0)
//       ) {
//         tabs.push('holiday');
//       }
//       setAvailableTabs(tabs);
//       setActiveTab(tabs[0] || null);
//     }
//   }, [selectedRow]);

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} size="lg">
//       <ModalHeader toggle={toggle}>Employee Pay</ModalHeader>

//       <ModalBody>
//         {/* ===== Tabs Header ===== */}
//         <Nav tabs>
//           {availableTabs.includes('holiday') && ( // ✅ check for holiday
//             <NavItem>
//               <NavLink
//                 className={`custom-tab ${activeTab === 'holiday' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('holiday')}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Holiday / Other Pay
//               </NavLink>
//             </NavItem>
//           )}

//           {availableTabs.includes('bonus') && ( // ✅ check for bonus
//             <NavItem>
//               <NavLink
//                 className={`custom-tab ${activeTab === 'bonus' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('bonus')}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Bonus
//               </NavLink>
//             </NavItem>
//           )}
//         </Nav>

//         {/* ===== Tabs Content ===== */}
//         <TabContent activeTab={activeTab} className="mt-4">
//           <TabPane tabId="holiday">
//             <HolidayPayForm
//               type="button"
//               loading={loading}
//               rowData={selectedRow}
//               onSave={onSaveHoliday}
//               monthFromState={monthFromState}
//               yearFromState={yearFromState}
//             />
//           </TabPane>

//           <TabPane tabId="bonus">
//             <BonusPayForm
//               type="button"
//               loading={loading}
//               rowData={selectedRow}
//               onSave={onSaveBonus}
//               monthFromState={monthFromState}
//               yearFromState={yearFromState}
//             />
//           </TabPane>
//         </TabContent>
//       </ModalBody>
//     </Modal>
//   );
// };

// // ===== PropTypes =====
// EmployeePayTabsModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggle: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
//   selectedRow: PropTypes.object.isRequired, // ✅ fixed
//   onSaveHoliday: PropTypes.func.isRequired,
//   onSaveBonus: PropTypes.func.isRequired,
//   monthFromState: PropTypes.number.isRequired,
//   yearFromState: PropTypes.number.isRequired,
// };

// // ===== Default Props =====
// EmployeePayTabsModal.defaultProps = {
//   loading: false,
// };

// export default EmployeePayTabsModal;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import HolidayPayForm from './HolidayPayForm';
import BonusPayForm from './BonusPayForm';

const EmployeePayTabsModal = ({
  isOpen,
  toggle,
  loading,
  selectedRow,
  onSaveHoliday,
  onSaveBonus,
  monthFromState,
  yearFromState,
  setPayModalOpen,
}) => {
  const [activeTab, setActiveTab] = useState(null);
  const [availableTabs, setAvailableTabs] = useState([]);
  const [savedTabs, setSavedTabs] = useState({ holiday: false, bonus: false });

  // Setup tabs and reset saved state
  useEffect(() => {
    if (!selectedRow) return;

    const tabs = [];
    if (selectedRow.bonus && parseFloat(selectedRow.bonus) > 0) tabs.push('bonus');
    if (
      (selectedRow.holidayPayId && selectedRow.holidayPayId > 0) ||
      (selectedRow.hpay && parseFloat(selectedRow.hpay) > 0)
    )
      tabs.push('holiday');

    setAvailableTabs(tabs);
    setActiveTab(tabs[0] || null);
    setSavedTabs({ holiday: false, bonus: false });
  }, [selectedRow]);

  // Auto-close modal when all tabs saved
  useEffect(() => {
    const allSaved = availableTabs.every((t) => savedTabs[t]);
    if (allSaved && availableTabs.length > 0) toggle();
  }, [savedTabs, availableTabs, toggle]);

  // Save handlers with NEXT TAB logic
  const handleHolidaySave = (data) => {
    onSaveHoliday(data);

    // Mark holiday as saved
    setSavedTabs((prev) => ({ ...prev, holiday: true }));

    // Switch to bonus if it exists and not saved
    if (availableTabs.includes('bonus') && !savedTabs.bonus) {
      setActiveTab('bonus');
    }
  };

  const handleBonusSave = (data) => {
    onSaveBonus(data);

    // Mark bonus as saved
    setSavedTabs((prev) => ({ ...prev, bonus: true }));

    // Switch to holiday if it exists and not saved
    if (availableTabs.includes('holiday') && !savedTabs.holiday) {
      setActiveTab('holiday');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static" keyboard={false}>
      <ModalHeader toggle={toggle}>Employee Pay</ModalHeader>

      <ModalBody>
        <Nav tabs>
          {availableTabs.includes('holiday') && (
            <NavItem>
              <NavLink
                className={activeTab === 'holiday' ? 'active' : ''}
                onClick={() => setActiveTab('holiday')}
                style={{ cursor: 'pointer' }}
              >
                Holiday / Other Pay
              </NavLink>
            </NavItem>
          )}
          {availableTabs.includes('bonus') && (
            <NavItem>
              <NavLink
                className={activeTab === 'bonus' ? 'active' : ''}
                onClick={() => setActiveTab('bonus')}
                style={{ cursor: 'pointer' }}
              >
                Bonus
              </NavLink>
            </NavItem>
          )}
        </Nav>

        <TabContent activeTab={activeTab} className="mt-4">
          <TabPane tabId="holiday">
            <HolidayPayForm
              loading={loading}
              rowData={selectedRow}
              onSave={handleHolidaySave}
              monthFromState={monthFromState}
              yearFromState={yearFromState}
              setPayModalOpen={setPayModalOpen}
            />
          </TabPane>

          <TabPane tabId="bonus">
            <BonusPayForm
              loading={loading}
              rowData={selectedRow}
              onSave={handleBonusSave}
              monthFromState={monthFromState}
              yearFromState={yearFromState}
              setPayModalOpen={setPayModalOpen}
            />
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  );
};

EmployeePayTabsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  selectedRow: PropTypes.object.isRequired,
  onSaveHoliday: PropTypes.func.isRequired,
  onSaveBonus: PropTypes.func.isRequired,
  monthFromState: PropTypes.number.isRequired,
  yearFromState: PropTypes.number.isRequired,
  setPayModalOpen: PropTypes.bool.isRequired,
};

EmployeePayTabsModal.defaultProps = { loading: false };

export default EmployeePayTabsModal;
