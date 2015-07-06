using MessageBoard.Controllers;
using MessageBoard.Data;
using MessageBoard.Services;
using MessageBoard.Tests.Fakes;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace MessageBoard.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTests
    {
        private FakeMessageBoardRepository _repo;
        private HomeController _ctrl;

        [TestInitialize]
        public void Init()
        {
            _repo = new FakeMessageBoardRepository();
            _ctrl = new HomeController(new MockMailService(), _repo);
        }

        [TestMethod]
        public void IndexCanRender()
        {
            var result = _ctrl.Index();
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void IndexHasData()
        {
            var result = _ctrl.Index() as ViewResult;
            var topics = result.Model as IEnumerable<Topic>;

            Assert.IsNotNull(result.Model);
            Assert.IsNotNull(topics);
            Assert.IsTrue(topics.Count() > 0);
        }
    }
}
