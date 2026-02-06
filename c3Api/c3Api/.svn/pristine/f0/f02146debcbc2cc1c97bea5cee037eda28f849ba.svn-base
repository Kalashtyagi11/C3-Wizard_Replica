using System;
using System.Collections.Generic;
using C3WizardLayer.DataObjects;
using C3WizardLayer.DataObjects.Interfaces;
using C3WizardLayer.BusinessObjects.Interfaces;
using C3WizardLayer.BusinessObjects;

namespace C3WizardLayer.BusinessObjects
{
    public partial class BLUserSecurityQuestionAnswer : C3WizardLayerConn_BaseBusiness, IQueryableCollection
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
        protected bool _isDirty = false;
        /*collection member objects*******************/
        /*********************************************/
        #endregion

        #region class methods
        ///<Summary>
        ///Constructor
        ///This is the default constructor
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public BLUserSecurityQuestionAnswer()
        {
        }


        ///<Summary>
        ///Constructor
        ///This constructor initializes the business object from its respective data object
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///DLMasterEmpType
        ///</parameters>
        protected internal BLUserSecurityQuestionAnswer(DLUserSecurityQuestionAnswer dlSecurityQuestionAnswer)
        {
            try
            {
                _userId = dlSecurityQuestionAnswer.UserId;
                _registrationNo = dlSecurityQuestionAnswer.RegistrationNo;
                _companyId = dlSecurityQuestionAnswer.CompanyId;
                _question1 = dlSecurityQuestionAnswer.Question1;
                _answer1 = dlSecurityQuestionAnswer.Answer1;
                _question2 = dlSecurityQuestionAnswer.Question2;
                _answer2 = dlSecurityQuestionAnswer.Answer2;
                _insertedBy = dlSecurityQuestionAnswer.InsertedBy;
                _insertedOn = dlSecurityQuestionAnswer.InsertedOn;
                _insertedMachineInfo = dlSecurityQuestionAnswer.InsertedMachineInfo;
                _updatedBy = dlSecurityQuestionAnswer.UpdatedBy;
                _updatedOn = dlSecurityQuestionAnswer.UpdatedOn;
                _updatedMachineInfo = dlSecurityQuestionAnswer.UpdatedMachineInfo;
                _isActive = dlSecurityQuestionAnswer.IsActive;
            }
            catch
            {
                throw;
            }
        }

        ///<Summary>
        ///SaveNew
        ///This method persists a new MasterEmpType record to the store
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public virtual void SaveNew()
        {
            DLUserSecurityQuestionAnswer dlSecurityQuestionAnswer = new DLUserSecurityQuestionAnswer();
            RegisterDataObject(dlSecurityQuestionAnswer);
            BeginTransaction("savenewBLSecurityQuestionAnswer");
            try
            {
                dlSecurityQuestionAnswer.Security_Id = 0;
                dlSecurityQuestionAnswer.UserId = _userId;
                dlSecurityQuestionAnswer.CompanyId = _companyId;
                dlSecurityQuestionAnswer.UserName = _username;
                dlSecurityQuestionAnswer.RegistrationNo = _registrationNo;
                dlSecurityQuestionAnswer.CompanyName = _companyName;
                dlSecurityQuestionAnswer.Question1 = _question1;
                dlSecurityQuestionAnswer.Answer1 = _answer1;
                dlSecurityQuestionAnswer.Question2 = _question2;
                dlSecurityQuestionAnswer.Answer2 = _answer2;
                dlSecurityQuestionAnswer.InsertedBy = _insertedBy;
                dlSecurityQuestionAnswer.InsertedOn = _insertedOn;
                dlSecurityQuestionAnswer.InsertedMachineInfo = _insertedMachineInfo;
                dlSecurityQuestionAnswer.UpdatedBy = _updatedBy;
                dlSecurityQuestionAnswer.UpdatedOn = _updatedOn;
                dlSecurityQuestionAnswer.UpdatedMachineInfo = _updatedMachineInfo;
                dlSecurityQuestionAnswer.IsActive = _isActive;
                dlSecurityQuestionAnswer.Insert();
                CommitTransaction();

                _userId = dlSecurityQuestionAnswer.UserId;
                _question1 = dlSecurityQuestionAnswer.Question1;
                _answer1 = dlSecurityQuestionAnswer.Answer1;
                _insertedBy = dlSecurityQuestionAnswer.InsertedBy;
                _insertedOn = dlSecurityQuestionAnswer.InsertedOn;
                _insertedMachineInfo = dlSecurityQuestionAnswer.InsertedMachineInfo;
                _updatedBy = dlSecurityQuestionAnswer.UpdatedBy;
                _updatedOn = dlSecurityQuestionAnswer.UpdatedOn;
                _updatedMachineInfo = dlSecurityQuestionAnswer.UpdatedMachineInfo;
                _isActive = dlSecurityQuestionAnswer.IsActive;
                _isDirty = false;
            }
            catch
            {
                RollbackTransaction("savenewBLSecurityQuestionAnswer");
                throw;
            }
        }

        ///<Summary>
        ///Update
        ///This method updates one MasterEmpType record in the store
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///BLMasterEmpType
        ///</parameters>
        public virtual void Update()
        {
            DLUserSecurityQuestionAnswer dlSecurityQuestionAnswer = new DLUserSecurityQuestionAnswer();
            RegisterDataObject(dlSecurityQuestionAnswer);
            BeginTransaction("updateBLSecurityQuestionAnswer");
            try
            {
                dlSecurityQuestionAnswer.UserId = _userId;
                dlSecurityQuestionAnswer.Question1 = _question1;
                dlSecurityQuestionAnswer.Answer1 = _answer1;
                dlSecurityQuestionAnswer.Question2 = _question2;
                dlSecurityQuestionAnswer.Answer2 = _answer2;
                dlSecurityQuestionAnswer.InsertedBy = _insertedBy;
                dlSecurityQuestionAnswer.InsertedOn = _insertedOn;
                dlSecurityQuestionAnswer.InsertedMachineInfo = _insertedMachineInfo;
                dlSecurityQuestionAnswer.UpdatedBy = _updatedBy;
                dlSecurityQuestionAnswer.UpdatedOn = _updatedOn;
                dlSecurityQuestionAnswer.UpdatedMachineInfo = _updatedMachineInfo;
                dlSecurityQuestionAnswer.IsActive = _isActive;
                dlSecurityQuestionAnswer.Update();
                CommitTransaction();

                _userId = dlSecurityQuestionAnswer.UserId;
                _question1 = dlSecurityQuestionAnswer.Question1;
                _answer1 = dlSecurityQuestionAnswer.Answer1;
                _insertedBy = dlSecurityQuestionAnswer.InsertedBy;
                _insertedOn = dlSecurityQuestionAnswer.InsertedOn;
                _insertedMachineInfo = dlSecurityQuestionAnswer.InsertedMachineInfo;
                _updatedBy = dlSecurityQuestionAnswer.UpdatedBy;
                _updatedOn = dlSecurityQuestionAnswer.UpdatedOn;
                _updatedMachineInfo = dlSecurityQuestionAnswer.UpdatedMachineInfo;
                _isActive = dlSecurityQuestionAnswer.IsActive;
                _isDirty = false;
            }
            catch
            {
                RollbackTransaction("updateBLSecurityQuestionAnswer");
                throw;
            }
        }
        ///<Summary>
        ///Delete
        ///This method deletes one MasterEmpType record from the store
        ///</Summary>
        ///<returns>
        ///void
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public virtual void Delete()
        {
            DLUserSecurityQuestionAnswer dlSecurityQuestionAnswer = new DLUserSecurityQuestionAnswer();
            RegisterDataObject(dlSecurityQuestionAnswer);
            BeginTransaction("deleteBLSecurityQuestionAnswer");
            try
            {
                dlSecurityQuestionAnswer.UserId = _userId;
                dlSecurityQuestionAnswer.Delete();
                CommitTransaction();
            }
            catch
            {
                RollbackTransaction("deleteBLSecurityQuestionAnswer");
                throw;
            }
        }
        ///<Summary>
        ///MasterEmpTypeCollection
        ///This method returns the collection of BLMasterEmpType objects
        ///</Summary>
        ///<returns>
        ///List[BLMasterEmpType]
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public static IList<BLUserSecurityQuestionAnswer> SecurityQuestionAnswerCollection()
        {
            try
            {
                IList<BLUserSecurityQuestionAnswer> blSecurityQuestionAnswerCollection = new List<BLUserSecurityQuestionAnswer>();
                IList<DLUserSecurityQuestionAnswer> dlSecurityQuestionAnswerCollection = DLUserSecurityQuestionAnswer.SelectAll();

                foreach (DLUserSecurityQuestionAnswer dlSecurityQuestionAnswer in dlSecurityQuestionAnswerCollection)
                    blSecurityQuestionAnswerCollection.Add(new BLUserSecurityQuestionAnswer(dlSecurityQuestionAnswer));

                return blSecurityQuestionAnswerCollection;
            }
            catch
            {
                throw;
            }
        }
        ///<Summary>
        ///MasterEmpTypeCollectionCount
        ///This method returns the collection count of BLMasterEmpType objects
        ///</Summary>
        ///<returns>
        ///Int32
        ///</returns>
        ///<parameters>
        ///
        ///</parameters>
        public static Int32 SecurityQuestionAnswerCollectionCount()
        {
            try
            {
                Int32 objCount = DLUserSecurityQuestionAnswer.SelectAllCount();
                return objCount;
            }
            catch
            {
                throw;
            }
        }


        ///<Summary>
        ///Projections
        ///This method returns the collection of projections, ordered and filtered by optional criteria
        ///</Summary>
        ///<returns>
        ///List<BLMasterEmpType>
        ///</returns>
        ///<parameters>
        ///ICriteria icriteria
        ///</parameters>
        public virtual IDictionary<string, IList<object>> Projections(object o)
        {
            try
            {
                ICriteria icriteria = (ICriteria)o;
                IList<IDataProjection> lstDataProjection = (icriteria == null) ? null : icriteria.ListDataProjection();
                IList<IDataCriterion> lstDataCriteria = (icriteria == null) ? null : icriteria.ListDataCriteria();
                IList<IDataOrderBy> lstDataOrder = (icriteria == null) ? null : icriteria.ListDataOrder();
                IDataTake dataTake = (icriteria == null) ? null : icriteria.DataTake();
                IDataSkip dataSkip = (icriteria == null) ? null : icriteria.DataSkip();
                IDictionary<string, IList<object>> retObj = DLUserSecurityQuestionAnswer.SelectAllByCriteriaProjection(lstDataProjection, lstDataCriteria, lstDataOrder, dataSkip, dataTake);
                return retObj;
            }
            catch
            {
                throw;
            }
        }


        ///<Summary>
        ///MasterEmpTypeCollection<T>
        ///This method implements the IQueryable Collection<T> method, returning a collection of BLMasterEmpType objects, filtered by optional criteria
        ///</Summary>
        ///<returns>
        ///IList<T>
        ///</returns>
        ///<parameters>
        ///object o
        ///</parameters>
        public virtual IList<T> Collection<T>(object o)
        {
            try
            {
                ICriteria icriteria = (ICriteria)o;
                IList<T> blSecurityQuestionAnswerCollection = new List<T>();
                IList<IDataCriterion> lstDataCriteria = (icriteria == null) ? null : icriteria.ListDataCriteria();
                IList<IDataOrderBy> lstDataOrder = (icriteria == null) ? null : icriteria.ListDataOrder();
                IDataTake dataTake = (icriteria == null) ? null : icriteria.DataTake();
                IDataSkip dataSkip = (icriteria == null) ? null : icriteria.DataSkip();
                IList<DLUserSecurityQuestionAnswer> dlSecurityQuestionAnswerCollection = DLUserSecurityQuestionAnswer.SelectAllByCriteria(lstDataCriteria, lstDataOrder, dataSkip, dataTake);

                foreach (DLUserSecurityQuestionAnswer resdlSecurityQuestionAnswer in dlSecurityQuestionAnswerCollection)
                    blSecurityQuestionAnswerCollection.Add((T)(object)new BLUserSecurityQuestionAnswer(resdlSecurityQuestionAnswer));

                return blSecurityQuestionAnswerCollection;
            }
            catch
            {
                throw;
            }
        }


        ///<Summary>
        ///MasterEmpTypeCollectionCount
        ///This method implements the IQueryable CollectionCount method, returning a collection count of BLMasterEmpType objects, filtered by optional criteria
        ///</Summary>
        ///<returns>
        ///Int32
        ///</returns>
        ///<parameters>
        ///object o
        ///</parameters>
        public virtual Int32 CollectionCount(object o)
        {
            try
            {
                ICriteria icriteria = (ICriteria)o;
                IList<IDataCriterion> lstDataCriteria = (icriteria == null) ? null : icriteria.ListDataCriteria();
                Int32 objCount = DLUserSecurityQuestionAnswer.SelectAllByCriteriaCount(lstDataCriteria);
                return objCount;
            }
            catch
            {
                throw;
            }
        }
        #endregion
        #region member properties
        public virtual Int32? Security_Id
        {
            get
            {
                return _securityId;
            }
            set
            {
                _securityId = value;
                _isDirty = true;
            }
        }
        public virtual Int32 UserId
        {
            get
            {
                return _userId;
            }
            set
            {
                _userId = value;
                _isDirty = true;
            }
        }
        public virtual Int32 CompanyId
        {
            get
            {
                return _companyId;
            }
            set
            {
                _companyId = value;
                _isDirty = true;
            }
        }
        public virtual string UserName
        {
            get
            {
                return _username;
            }
            set
            {
                _username = value;
                _isDirty = true;
            }
        }
        public virtual Int32 RegistrationNo
        {
            get
            {
                return _registrationNo;
            }
            set
            {
                _registrationNo = value;
                _isDirty = true;
            }
        }
        public virtual string CompanyName
        {
            get
            {
                return _companyName;
            }
            set
            {
                _companyName = value;
                _isDirty = true;
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
        public virtual Int32? InsertedBy
        {
            get
            {
                return _insertedBy;
            }
            set
            {
                _insertedBy = value;
                _isDirty = true;
            }
        }

        public virtual DateTime? InsertedOn
        {
            get
            {
                return _insertedOn;
            }
            set
            {
                _insertedOn = value;
                _isDirty = true;
            }
        }

        public virtual string InsertedMachineInfo
        {
            get
            {
                return _insertedMachineInfo;
            }
            set
            {
                _insertedMachineInfo = value;
                _isDirty = true;
            }
        }

        public virtual Int32? UpdatedBy
        {
            get
            {
                return _updatedBy;
            }
            set
            {
                _updatedBy = value;
                _isDirty = true;
            }
        }

        public virtual DateTime? UpdatedOn
        {
            get
            {
                return _updatedOn;
            }
            set
            {
                _updatedOn = value;
                _isDirty = true;
            }
        }

        public virtual string UpdatedMachineInfo
        {
            get
            {
                return _updatedMachineInfo;
            }
            set
            {
                _updatedMachineInfo = value;
                _isDirty = true;
            }
        }

        public virtual bool? IsActive
        {
            get
            {
                return _isActive;
            }
            set
            {
                _isActive = value;
                _isDirty = true;
            }
        }

        public virtual object Repository
        {
            get { return null; }
            set { }
        }

        public virtual bool IsDirty
        {
            get
            {
                return _isDirty;
            }
            set
            {
                _isDirty = value;
            }
        }
        #endregion
    }
}
