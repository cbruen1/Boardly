using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBoard.Services
{
    public class MockMailService : IMailService
    {
        public bool SendMail(string from, string to, string subject, string body)
        {
            Debug.WriteLine(string.Format("Subject: {0}", subject));

            return true;
        }
    }
}
