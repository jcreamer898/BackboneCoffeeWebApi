using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using CustomerManager.Models;

namespace CustomerManager.Controllers
{
    public class CustomersController : ApiController
    {
        private ManagerContext _managerContext;

        public CustomersController()
        {
            _managerContext = new ManagerContext();
        }

        // GET /api/customers
        public IEnumerable<Customer> Get()
        {
            return _managerContext.Customers;
        }

        // GET /api/customers/5
        public Customer Get(int id)
        {
            return _managerContext.Customers.SingleOrDefault(c => c.Id == id);
        }

        // POST /api/customers
        public void Post(Customer customer)
        {
            _managerContext.Customers.Add(customer);
            _managerContext.SaveChanges();
        }

        // PUT /api/customers/5
        public void Put(int id, Customer customer)
        {
            _managerContext.Entry(customer).State = EntityState.Modified;
            _managerContext.SaveChanges();
        }

        // DELETE /api/customers/5
        public void Delete(int id)
        {
            var customer = _managerContext.Customers.SingleOrDefault(c => c.Id == id);
            _managerContext.Customers.Remove(customer);
            _managerContext.SaveChanges();
        }
    }
}
