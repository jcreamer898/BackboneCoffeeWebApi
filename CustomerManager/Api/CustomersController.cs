using System;
using System.Collections.Generic;
using System.Data;
using System.Json;
using System.Linq;
using System.Net;
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
        public HttpResponseMessage Post(Customer customer)
        {
            JsonArray errors = ParseErrors();
            if (errors.Count > 0)
            {
                return new HttpResponseMessage<JsonValue>(errors, HttpStatusCode.Forbidden);
            }
            _managerContext.Customers.Add(customer);
            _managerContext.SaveChanges();
            return new HttpResponseMessage<Customer>(customer);
        }

        // PUT /api/customers/5
        public HttpResponseMessage Put(int id, Customer customer)
        {
            JsonArray errors = ParseErrors();
            if(errors.Count > 0)
            {
                return new HttpResponseMessage<JsonValue>(errors, HttpStatusCode.Forbidden);
            }
            _managerContext.Entry(customer).State = EntityState.Modified;
            _managerContext.SaveChanges();
            return new HttpResponseMessage<Customer>(customer);
        }

        // DELETE /api/customers/5
        public void Delete(int id)
        {
            var customer = _managerContext.Customers.SingleOrDefault(c => c.Id == id);
            _managerContext.Customers.Remove(customer);
            _managerContext.SaveChanges();
        }

        private JsonArray ParseErrors()
        {
            var errors = new JsonArray();
            // Validate movie
            if (!ModelState.IsValid)
            {
                
                foreach (var prop in ModelState.Values)
                {
                    if (prop.Errors.Any())
                    {
                        errors.Add(prop.Errors.First().ErrorMessage);
                    }
                }
            }
            return errors;
        }
    }
}
