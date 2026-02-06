using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace C3Wizard.COMMONPROP
{
   public class TransactionDAL :System.Data.Common.DbTransaction//IDbTransaction
    {
        //public IDbConnection Connection { get { return null; } }
        public override IsolationLevel IsolationLevel { get { return IsolationLevel.ReadCommitted; } }
        public override void Commit() { }
        protected override System.Data.Common.DbConnection DbConnection
        {
            get { throw new Exception("The method or operation is not implemented."); }
        }
        public override void Rollback() { }

        //public void Dispose() { }
    }
}
