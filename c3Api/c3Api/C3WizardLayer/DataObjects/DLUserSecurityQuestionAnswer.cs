using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Data.SqlClient;
using System.Collections.Generic;
using C3WizardLayer.DataObjects.Interfaces;
namespace C3WizardLayer.DataObjects
{
    public partial class DLUserSecurityQuestionAnswer : C3WizardLayerConn_BaseData
    {
        #region member variables
        protected Int32? _securityId;
        protected Int32 _userId;
        protected Int32 _companyId;
        protected string _username;
        protected Int32 _registrationNo;
        protected string _companyName;
        protected string _question1;
        protected string _question2;
        protected string _answer1;
        protected string _answer2;
        protected Int32? _insertedBy;
        protected DateTime? _insertedOn;
        protected string _insertedMachineInfo;
        protected Int32? _updatedBy;
        protected DateTime? _updatedOn;
        protected string _updatedMachineInfo;
        protected bool? _isActive;
        #endregion

        #region class methods
        public DLUserSecurityQuestionAnswer()
        {
        }
        ///<Summary>
        ///Select one row by primary key(s)
        ///This method returns one row from the table MasterCompany based on the primary key(s)
        ///</Summary>
        ///<returns>
        ///DLMasterCompany
        ///</returns>
        ///<parameters>
        ///Int32? companyId
        ///</parameters>
        public static int SelectOne(int regno, string username, string ques1, string ques2, string ans1, string ans2)
        {
            int userId=0;
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_SelectOne]";
            command.CommandType = CommandType.StoredProcedure;
            SqlConnection staticConnection = StaticSqlConnection;
            command.Connection = staticConnection;
            DataTable dt = new DataTable("SecurityQuestionAnswer");
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(command);
            try
            {
                command.Parameters.Add(new SqlParameter("@RegistrationNo", SqlDbType.Int, 6, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)regno ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UserName", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)username ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Question1", SqlDbType.VarChar, 100, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)ques1 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Question2", SqlDbType.VarChar, 100, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)ques2 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Answer1", SqlDbType.VarChar, 100, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)ans1 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Answer2", SqlDbType.VarChar, 100, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)ans2 ?? (object)DBNull.Value));
                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                sqlAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    userId = Convert.IsDBNull(dt.Rows[0]["UserId"]) ? 0 : (Int32)dt.Rows[0]["UserId"];                   
                }
                return userId;
            }
            catch
            {
                throw;
            }
            finally
            {
                staticConnection.Close();
                command.Dispose();
            }
        }
        ///<Summary>
        ///Delete one row by primary key(s)
        ///this method allows the object to delete itself from the table MasterEmpType based on its primary key
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public virtual void Delete()
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_DeleteOne]";
            command.CommandType = CommandType.StoredProcedure;
            command.Connection = _connectionProvider.Connection;
            command.Transaction = _connectionProvider.CurrentTransaction;
            try
            {
                command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int, 4, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)_userId ?? (object)DBNull.Value));
                command.ExecuteNonQuery();
            }
            catch
            {
                throw;
            }
            finally
            {
                command.Dispose();
            }
        }

        ///<Summary>
        ///Insert a new row
        ///This method saves a new object to the table MasterEmpType
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public virtual void Insert()
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_InsertOne]";
            command.CommandType = CommandType.StoredProcedure;
            command.Connection = _connectionProvider.Connection;
            command.Transaction = _connectionProvider.CurrentTransaction;
            try
            {
                command.Parameters.Add(new SqlParameter("@Security_Id", SqlDbType.Int, 4, ParameterDirection.Output, false, 10, 0, "", DataRowVersion.Proposed, _securityId));
                command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int, 4, ParameterDirection.InputOutput, true, 10, 0, "", DataRowVersion.Proposed, _userId));
                command.Parameters.Add(new SqlParameter("@CompanyId", SqlDbType.Int, 4, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_companyId ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UserName", SqlDbType.NVarChar, 50, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_username ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@RegistrationNo", SqlDbType.Int, 6, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_registrationNo ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@CompanyName", SqlDbType.NVarChar, 50, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_companyName ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Question1", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_question1 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Answer1", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_answer1 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Question2", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_question2 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Answer2", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_answer2 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@InsertedBy", SqlDbType.Int, 4, ParameterDirection.InputOutput, true, 10, 0, "", DataRowVersion.Proposed, (object)_insertedBy ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@InsertedOn", SqlDbType.DateTime, 8, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_insertedOn ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@InsertedMachineInfo", SqlDbType.NVarChar, 50, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_insertedMachineInfo ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UpdatedBy", SqlDbType.Int, 4, ParameterDirection.InputOutput, true, 10, 0, "", DataRowVersion.Proposed, (object)_updatedBy ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UpdatedOn", SqlDbType.DateTime, 8, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_updatedOn ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UpdatedMachineInfo", SqlDbType.NVarChar, 50, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_updatedMachineInfo ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@IsActive", SqlDbType.Bit, 1, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_isActive ?? (object)DBNull.Value));

                command.ExecuteNonQuery();
                _securityId = Convert.IsDBNull(command.Parameters["@Security_Id"].Value) ? 0 : (Int32?)command.Parameters["@Security_Id"].Value;               
                _userId = Convert.IsDBNull(command.Parameters["@UserId"].Value) ? 0 : (Int32)command.Parameters["@UserId"].Value;
                _companyId = Convert.IsDBNull(command.Parameters["@CompanyId"].Value) ? 0 : (Int32)command.Parameters["@CompanyId"].Value;
                _username = Convert.IsDBNull(command.Parameters["@UserName"].Value) ? null : (string)command.Parameters["@UserName"].Value;
                _registrationNo = Convert.IsDBNull(command.Parameters["@RegistrationNo"].Value) ? 0 : (Int32)command.Parameters["@RegistrationNo"].Value;
                _companyName = Convert.IsDBNull(command.Parameters["@CompanyName"].Value) ? null : (string)command.Parameters["@CompanyName"].Value;
                _question1 = Convert.IsDBNull(command.Parameters["@Question1"].Value) ? null : (string)command.Parameters["@Question1"].Value;
                _answer1 = Convert.IsDBNull(command.Parameters["@Answer1"].Value) ? null : (string)command.Parameters["@Answer1"].Value;
                _question2 = Convert.IsDBNull(command.Parameters["@Question2"].Value) ? null : (string)command.Parameters["@Question2"].Value;
                _answer2 = Convert.IsDBNull(command.Parameters["@Answer2"].Value) ? null : (string)command.Parameters["@Answer2"].Value;
                _insertedBy = Convert.IsDBNull(command.Parameters["@InsertedBy"].Value) ? (Int32?)null : (Int32?)command.Parameters["@InsertedBy"].Value;
                _insertedOn = Convert.IsDBNull(command.Parameters["@InsertedOn"].Value) ? (DateTime?)null : (DateTime?)command.Parameters["@InsertedOn"].Value;
                _insertedMachineInfo = Convert.IsDBNull(command.Parameters["@InsertedMachineInfo"].Value) ? null : (string)command.Parameters["@InsertedMachineInfo"].Value;
                _updatedBy = Convert.IsDBNull(command.Parameters["@UpdatedBy"].Value) ? (Int32?)null : (Int32?)command.Parameters["@UpdatedBy"].Value;
                _updatedOn = Convert.IsDBNull(command.Parameters["@UpdatedOn"].Value) ? (DateTime?)null : (DateTime?)command.Parameters["@UpdatedOn"].Value;
                _updatedMachineInfo = Convert.IsDBNull(command.Parameters["@UpdatedMachineInfo"].Value) ? null : (string)command.Parameters["@UpdatedMachineInfo"].Value;
                _isActive = Convert.IsDBNull(command.Parameters["@IsActive"].Value) ? (bool?)null : (bool?)command.Parameters["@IsActive"].Value;

            }
            catch
            {
                throw;
            }
            finally
            {
                command.Dispose();
            }
        }

        ///<Summary>
        ///Select all rows
        ///This method returns all data rows in the table MasterEmpType
        ///</Summary>
        ///<returns>
        ///IList-DLMasterEmpType.
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public static IList<DLUserSecurityQuestionAnswer> SelectAll()
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_SelectAll]";
            command.CommandType = CommandType.StoredProcedure;
            SqlConnection staticConnection = StaticSqlConnection;
            command.Connection = staticConnection;
            DataTable dt = new DataTable("SecurityQuestionAnswer");
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(command);
            try
            {
                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                sqlAdapter.Fill(dt);
                List<DLUserSecurityQuestionAnswer> objList = new List<DLUserSecurityQuestionAnswer>();
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        DLUserSecurityQuestionAnswer retObj = new DLUserSecurityQuestionAnswer();
                        retObj._userId = Convert.IsDBNull(row["UserId"]) ? 0 : (Int32)row["UserId"];
                        retObj._companyId = Convert.IsDBNull(row["CompanyId"]) ? 0 : (Int32)row["CompanyId"];
                        retObj._registrationNo = Convert.IsDBNull(row["RegistrationNo"]) ? 0 : (Int32)row["RegistrationNo"];
                        retObj._question1 = Convert.IsDBNull(row["Question1"]) ? null : (string)row["Question1"];
                        retObj._answer1 = Convert.IsDBNull(row["Answer1"]) ? null : (string)row["Answer1"];
                        retObj._question2 = Convert.IsDBNull(row["Question2"]) ? null : (string)row["Question2"];
                        retObj._answer2 = Convert.IsDBNull(row["Answer2"]) ? null : (string)row["Answer2"];
                        retObj._insertedBy = Convert.IsDBNull(row["InsertedBy"]) ? (Int32?)null : (Int32?)row["InsertedBy"];
                        retObj._insertedOn = Convert.IsDBNull(row["InsertedOn"]) ? (DateTime?)null : (DateTime?)row["InsertedOn"];
                        retObj._insertedMachineInfo = Convert.IsDBNull(row["InsertedMachineInfo"]) ? null : (string)row["InsertedMachineInfo"];
                        retObj._updatedBy = Convert.IsDBNull(row["UpdatedBy"]) ? (Int32?)null : (Int32?)row["UpdatedBy"];
                        retObj._updatedOn = Convert.IsDBNull(row["UpdatedOn"]) ? (DateTime?)null : (DateTime?)row["UpdatedOn"];
                        retObj._updatedMachineInfo = Convert.IsDBNull(row["UpdatedMachineInfo"]) ? null : (string)row["UpdatedMachineInfo"];
                        retObj._isActive = Convert.IsDBNull(row["IsActive"]) ? (bool?)null : (bool?)row["IsActive"];
                        objList.Add(retObj);
                    }
                }
                return objList;
            }
            catch(Exception ex)
            {
                throw;
            }
            finally
            {
                staticConnection.Close();
                command.Dispose();
            }
        }   
        public virtual void Update()
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_UpdateOneNew]";
            command.CommandType = CommandType.StoredProcedure;
            command.Connection = _connectionProvider.Connection;
            command.Transaction = _connectionProvider.CurrentTransaction;
            try
            {
                command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int, 4, ParameterDirection.InputOutput, false, 10, 0, "", DataRowVersion.Proposed, (object)_userId ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Question1", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_question1 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Answer1", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_answer1 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Question2", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_question2 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Answer2", SqlDbType.NVarChar, 100, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_answer2 ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@InsertedBy", SqlDbType.Int, 4, ParameterDirection.InputOutput, true, 10, 0, "", DataRowVersion.Proposed, (object)_insertedBy ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@InsertedOn", SqlDbType.DateTime, 8, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_insertedOn ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@InsertedMachineInfo", SqlDbType.NVarChar, 50, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_insertedMachineInfo ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UpdatedBy", SqlDbType.Int, 4, ParameterDirection.InputOutput, true, 10, 0, "", DataRowVersion.Proposed, (object)_updatedBy ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UpdatedOn", SqlDbType.DateTime, 8, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_updatedOn ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@UpdatedMachineInfo", SqlDbType.NVarChar, 50, ParameterDirection.InputOutput, true, 0, 0, "", DataRowVersion.Proposed, (object)_updatedMachineInfo ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@IsActive", SqlDbType.Bit, 1, ParameterDirection.InputOutput, false, 0, 0, "", DataRowVersion.Proposed, (object)_isActive ?? (object)DBNull.Value));

                command.ExecuteNonQuery();

                _userId = Convert.IsDBNull(command.Parameters["@UserId"].Value) ? 0 : (Int32)command.Parameters["@UserId"].Value;
                _question1 = Convert.IsDBNull(command.Parameters["@Question1"].Value) ? null : (string)command.Parameters["@Question1"].Value;
                _answer1 = Convert.IsDBNull(command.Parameters["@Answer1"].Value) ? null : (string)command.Parameters["@Answer1"].Value;
                _question2 = Convert.IsDBNull(command.Parameters["@Question2"].Value) ? null : (string)command.Parameters["@Question2"].Value;
                _answer2 = Convert.IsDBNull(command.Parameters["@Answer2"].Value) ? null : (string)command.Parameters["@Answer2"].Value;
                //_insertedBy = Convert.IsDBNull(command.Parameters["@InsertedBy"].Value) ? (Int32?)null : (Int32?)command.Parameters["@InsertedBy"].Value;
                //_insertedOn = Convert.IsDBNull(command.Parameters["@InsertedOn"].Value) ? (DateTime?)null : (DateTime?)command.Parameters["@InsertedOn"].Value;
                //_insertedMachineInfo = Convert.IsDBNull(command.Parameters["@InsertedMachineInfo"].Value) ? null : (string)command.Parameters["@InsertedMachineInfo"].Value;
                _updatedBy = Convert.IsDBNull(command.Parameters["@UpdatedBy"].Value) ? (Int32?)null : (Int32?)command.Parameters["@UpdatedBy"].Value;
                _updatedOn = Convert.IsDBNull(command.Parameters["@UpdatedOn"].Value) ? (DateTime?)null : (DateTime?)command.Parameters["@UpdatedOn"].Value;
                //_updatedMachineInfo = Convert.IsDBNull(command.Parameters["@UpdatedMachineInfo"].Value) ? null : (string)command.Parameters["@UpdatedMachineInfo"].Value;
                _isActive = Convert.IsDBNull(command.Parameters["@IsActive"].Value) ? (bool?)null : (bool?)command.Parameters["@IsActive"].Value;

            }
            catch
            {
                throw;
            }
            finally
            {
                command.Dispose();
            }
        }

        public static Int32 SelectAllCount()
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_SelectAllCount]";
            command.CommandType = CommandType.StoredProcedure;
            SqlConnection staticConnection = StaticSqlConnection;
            command.Connection = staticConnection;

            try
            {

                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                Int32 retCount = (Int32)command.ExecuteScalar();

                return retCount;
            }
            catch
            {
                throw;
            }
            finally
            {
                staticConnection.Close();
                command.Dispose();
            }
        }

        ///<Summary>
        ///Select specific fields of all rows using criteriaquery api
        ///This method returns specific fields of all data rows in the table using criteriaquery apiMasterEmpType
        ///</Summary>
        ///<returns>
        ///IDictionary-string, IList-object..
        ///</returns>
        ///<parameters>
        ///IList<IDataProjection> listProjection, IList<IDataCriterion> listCriterion, IList<IDataOrderBy> listOrder, IDataSkip dataSkip, IDataTake dataTake
        ///</parameters>
        public static IDictionary<string, IList<object>> SelectAllByCriteriaProjection(IList<IDataProjection> listProjection, IList<IDataCriterion> listCriterion, IList<IDataOrderBy> listOrder, IDataSkip dataSkip, IDataTake dataTake)
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_SelectAllByCriteriaProjection]";
            command.CommandType = CommandType.StoredProcedure;
            SqlConnection staticConnection = StaticSqlConnection;
            command.Connection = staticConnection;

            DataTable dt = new DataTable("SecurityQuestionAnswer");
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(command);
            try
            {
                string fieldsField = GetProjections(listProjection);
                string whereClause = GetSelectionCriteria(listCriterion);
                string orderClause = GetSelectionOrder(listOrder);
                string skipClause = GetSelectionSkip(dataSkip);
                string takeClause = GetSelectionTake(dataTake);

                if ((orderClause == "") && ((skipClause != "") || (takeClause != "")))
                    throw new Exception("Invalid query: Using 'Take' or 'Skip' requires an OrderBy clause");

                command.Parameters.Add(new SqlParameter("@FieldsField", SqlDbType.VarChar, 500, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)fieldsField ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@WhereClause", SqlDbType.VarChar, 500, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)whereClause ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@OrderClause", SqlDbType.VarChar, 500, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)orderClause ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@SkipClause", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)skipClause ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@TakeClause", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)takeClause ?? (object)DBNull.Value));

                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                sqlAdapter.Fill(dt);

                IDictionary<string, IList<object>> dict = new Dictionary<string, IList<object>>();
                foreach (IDataProjection projection in listProjection)
                {
                    IList<object> lst = new List<object>();
                    dict.Add(projection.Member, lst);
                    foreach (DataRow row in dt.Rows)
                    {
                        if (string.Compare(projection.Member, "UserId", true) == 0) lst.Add(Convert.IsDBNull(row["UserId"]) ? 0 : (Int32)row["UserId"]);
                        if (string.Compare(projection.Member, "Question1", true) == 0) lst.Add(Convert.IsDBNull(row["Question1"]) ? null : (string)row["Question1"]);
                        if (string.Compare(projection.Member, "Answer1", true) == 0) lst.Add(Convert.IsDBNull(row["Answer1"]) ? null : (string)row["Answer1"]);
                        if (string.Compare(projection.Member, "Question2", true) == 0) lst.Add(Convert.IsDBNull(row["Question2"]) ? null : (string)row["Question2"]);
                        if (string.Compare(projection.Member, "Answer2", true) == 0) lst.Add(Convert.IsDBNull(row["Answer2"]) ? null : (string)row["Answer2"]);
                        if (string.Compare(projection.Member, "InsertedBy", true) == 0) lst.Add(Convert.IsDBNull(row["InsertedBy"]) ? (Int32?)null : (Int32?)row["InsertedBy"]);
                        if (string.Compare(projection.Member, "InsertedOn", true) == 0) lst.Add(Convert.IsDBNull(row["InsertedOn"]) ? (DateTime?)null : (DateTime?)row["InsertedOn"]);
                        if (string.Compare(projection.Member, "InsertedMachineInfo", true) == 0) lst.Add(Convert.IsDBNull(row["InsertedMachineInfo"]) ? null : (string)row["InsertedMachineInfo"]);
                        if (string.Compare(projection.Member, "UpdatedBy", true) == 0) lst.Add(Convert.IsDBNull(row["UpdatedBy"]) ? (Int32?)null : (Int32?)row["UpdatedBy"]);
                        if (string.Compare(projection.Member, "UpdatedOn", true) == 0) lst.Add(Convert.IsDBNull(row["UpdatedOn"]) ? (DateTime?)null : (DateTime?)row["UpdatedOn"]);
                        if (string.Compare(projection.Member, "UpdatedMachineInfo", true) == 0) lst.Add(Convert.IsDBNull(row["UpdatedMachineInfo"]) ? null : (string)row["UpdatedMachineInfo"]);
                        if (string.Compare(projection.Member, "IsActive", true) == 0) lst.Add(Convert.IsDBNull(row["IsActive"]) ? (bool?)null : (bool?)row["IsActive"]);
                    }
                }
                return dict;
            }
            catch
            {
                throw;
            }
            finally
            {
                staticConnection.Close();
                command.Dispose();
            }
        }

        ///<Summary>
        ///Select all rows by filter criteria
        ///This method returns all data rows in the table using criteriaquery api MasterEmpType
        ///</Summary>
        ///<returns>
        ///IList-DLMasterEmpType.
        ///</returns>
        ///<parameters>
        ///IList<IDataCriterion> listCriterion, IList<IDataOrderBy> listOrder, IDataSkip dataSkip, IDataTake dataTake
        ///</parameters>
        public static IList<DLUserSecurityQuestionAnswer> SelectAllByCriteria(IList<IDataCriterion> listCriterion, IList<IDataOrderBy> listOrder, IDataSkip dataSkip, IDataTake dataTake)
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_SelectAllByCriteria]";
            command.CommandType = CommandType.StoredProcedure;
            SqlConnection staticConnection = StaticSqlConnection;
            command.Connection = staticConnection;

            DataTable dt = new DataTable("SecurityQuestionAnswer");
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(command);
            try
            {
                string whereClause = GetSelectionCriteria(listCriterion);
                string orderClause = GetSelectionOrder(listOrder);
                string skipClause = GetSelectionSkip(dataSkip);
                string takeClause = GetSelectionTake(dataTake);

                if ((orderClause == "") && ((skipClause != "") || (takeClause != "")))
                    throw new Exception("Invalid query: Using 'Take' or 'Skip' requires an OrderBy clause");

                command.Parameters.Add(new SqlParameter("@WhereClause", SqlDbType.VarChar, 500, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)whereClause ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@OrderClause", SqlDbType.VarChar, 500, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)orderClause ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@SkipClause", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)skipClause ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@TakeClause", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)takeClause ?? (object)DBNull.Value));

                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                sqlAdapter.Fill(dt);

                List<DLUserSecurityQuestionAnswer> objList = new List<DLUserSecurityQuestionAnswer>();
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        DLUserSecurityQuestionAnswer retObj = new DLUserSecurityQuestionAnswer();
                        retObj._userId = Convert.IsDBNull(row["UserId"]) ? 0 : (Int32)row["UserId"];
                        retObj._question1 = Convert.IsDBNull(row["Question1"]) ? null : (string)row["Question1"];
                        retObj._answer1 = Convert.IsDBNull(row["Answer1"]) ? null : (string)row["Answer1"];
                        retObj._question1 = Convert.IsDBNull(row["Question2"]) ? null : (string)row["Question2"];
                        retObj._answer1 = Convert.IsDBNull(row["Answer2"]) ? null : (string)row["Answer2"];
                        retObj._insertedBy = Convert.IsDBNull(row["InsertedBy"]) ? (Int32?)null : (Int32?)row["InsertedBy"];
                        retObj._insertedOn = Convert.IsDBNull(row["InsertedOn"]) ? (DateTime?)null : (DateTime?)row["InsertedOn"];
                        retObj._insertedMachineInfo = Convert.IsDBNull(row["InsertedMachineInfo"]) ? null : (string)row["InsertedMachineInfo"];
                        retObj._updatedBy = Convert.IsDBNull(row["UpdatedBy"]) ? (Int32?)null : (Int32?)row["UpdatedBy"];
                        retObj._updatedOn = Convert.IsDBNull(row["UpdatedOn"]) ? (DateTime?)null : (DateTime?)row["UpdatedOn"];
                        retObj._updatedMachineInfo = Convert.IsDBNull(row["UpdatedMachineInfo"]) ? null : (string)row["UpdatedMachineInfo"];
                        retObj._isActive = Convert.IsDBNull(row["IsActive"]) ? (bool?)null : (bool?)row["IsActive"];
                        objList.Add(retObj);
                    }
                }
                return objList;
            }
            catch
            {
                throw;
            }
            finally
            {
                staticConnection.Close();
                command.Dispose();
            }
        }

        ///<Summary>
        ///Select count of all rows using criteriaquery api
        ///This method returns all data rows in the table using criteriaquery api MasterEmpType
        ///</Summary>
        ///<returns>
        ///Int32
        ///</returns>
        ///<parameters>
        ///IList<IDataCriterion> listCriterion
        ///</parameters>
        public static Int32 SelectAllByCriteriaCount(IList<IDataCriterion> listCriterion)
        {
            SqlCommand command = new SqlCommand();
            command.CommandText = "[dbo].[ctprSecurityQuestionAnswer_SelectAllByCriteriaCount]";
            command.CommandType = CommandType.StoredProcedure;
            SqlConnection staticConnection = StaticSqlConnection;
            command.Connection = staticConnection;

            try
            {
                string whereClause = GetSelectionCriteria(listCriterion);
                command.Parameters.Add(new SqlParameter("@WhereClause", SqlDbType.VarChar, 500, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)whereClause ?? (object)DBNull.Value));

                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                Int32 retCount = (Int32)command.ExecuteScalar();

                return retCount;
            }
            catch
            {
                throw;
            }
            finally
            {
                staticConnection.Close();
                command.Dispose();
            }
        }
        #endregion

        #region member properties
        public Int32? Security_Id
        {
            get
            {
                return _securityId;
            }
            set
            {
                _securityId = value;
            }
        }
        public Int32 UserId
        {
            get
            {
                return _userId;
            }
            set
            {
                _userId = value;
            }
        }
        public Int32 CompanyId
        {
            get
            {
                return _companyId;
            }
            set
            {
                _companyId = value;
            }
        }

        public string UserName
        {
            get
            {
                return _username;
            }
            set
            {
                _username = value;
            }
        }
      
        public Int32 RegistrationNo
        {
            get
            {
                return _registrationNo;
            }
            set
            {
                _registrationNo = value;
            }
        }
        public string CompanyName
        {
            get
            {
                return _companyName;
            }
            set
            {
                _companyName = value;
            }
        }
        public string Question1
        {
            get
            {
                return _question1;
            }
            set
            {
                _question1 = value;
            }
        }
        public string Question2
        {
            get
            {
                return _question2;
            }
            set
            {
                _question2 = value;
            }
        }
        public string Answer1
        {
            get
            {
                return _answer1;
            }
            set
            {
                _answer1 = value;
            }
        }
        public string Answer2
        {
            get
            {
                return _answer2;
            }
            set
            {
                _answer2 = value;
            }
        }
        public Int32? InsertedBy
        {
            get
            {
                return _insertedBy;
            }
            set
            {
                _insertedBy = value;
            }
        }

        public DateTime? InsertedOn
        {
            get
            {
                return _insertedOn;
            }
            set
            {
                _insertedOn = value;
            }
        }

        public string InsertedMachineInfo
        {
            get
            {
                return _insertedMachineInfo;
            }
            set
            {
                _insertedMachineInfo = value;
            }
        }

        public Int32? UpdatedBy
        {
            get
            {
                return _updatedBy;
            }
            set
            {
                _updatedBy = value;
            }
        }

        public DateTime? UpdatedOn
        {
            get
            {
                return _updatedOn;
            }
            set
            {
                _updatedOn = value;
            }
        }

        public string UpdatedMachineInfo
        {
            get
            {
                return _updatedMachineInfo;
            }
            set
            {
                _updatedMachineInfo = value;
            }
        }

        public bool? IsActive
        {
            get
            {
                return _isActive;
            }
            set
            {
                _isActive = value;
            }
        }

        #endregion
    }
}
