import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getLevySettings = (year) => {
  return http.get(`/Settings/Get_Deductions_Tax_Table_Details_Settings?year=${year}`, {
    headers: authHeader(),
  });
};

const getLevySettingsDate = (year) => {
  return http.get(`/Settings/editHeadersDeductionsTaxTable?id=${year}`, {
    headers: authHeader(),
  });
};

const carryForwardSettings = (data) => {
  return http.get(
    `/Settings/carryforwardDeductionsTaxTableDetailDataNew?Fromyear=${data.yearFrom}&Toyear=${data.toYear}`,

    {
      headers: authHeader(),
    },
  );
};

const getLevySettingsById = (taxId) => {
  return http.get(`/Settings/GetDeductionsTaxTableDetail?TaxTabID=${taxId}`, {
    headers: authHeader(),
  });
};

const addUpdateLevySettings = (data) => {
  return http.post(`/Settings/AddOrUpdateDeductionsTaxTableDetailNew`, data, {
    headers: authHeader(),
  });
};

const deleteLevySettings = (id) => {
  return http.get(`/Settings/DeleteDeductionsTaxTableDetail?TaxTabID=${id}`, {
    headers: authHeader(),
  });
};

// const saveDataLevy = ({ leavyName, fromDate, ToDate }) => {
//
//   return http.post(
//     '/Settings/setHeadersDeductionsTaxTable', // ✅ No query params
//     {
//       leavyName,
//       fromDate,
//       ToDate,
//     },
//     {
//       headers: authHeader(),
//     },
//   );
// };

const saveDataLevy = ({ id = 0, mode = 0, leavyName, fromDate, ToDate }) => {
  return http.post(
    '/Settings/setHeadersDeductionsTaxTable',
    {
      id,
      mode,
      leavyName,
      fromDate,
      ToDate,
    },
    {
      headers: authHeader(),
    },
  );
};

const LevySettingsServices = {
  getLevySettings,
  deleteLevySettings,
  addUpdateLevySettings,
  getLevySettingsById,
  carryForwardSettings,
  saveDataLevy,
  getLevySettingsDate,
};

export default LevySettingsServices;
