using MediatR;
using Microsoft.AspNetCore.Mvc;
using PrivilegePro.Models.Core;
using PrivilegePro.Models.ViewModels;
using PrivilegePro.Models.ViewModels.Commands;
using PrivilegePro.Models.ViewModels.DataTable;
using System.Diagnostics;

namespace PrivilegePro.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IMediator mediator;

        public HomeController(ILogger<HomeController> logger,
            IMediator mediator)
        {
            _logger = logger;
            this.mediator = mediator;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetAgents(DtParameters<AgentViewModel> dtParams)
        {
            try
            {
                var result = await mediator.Send(dtParams);

                // Return the data as JSON
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveAgent([FromForm] AgentViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var saveCmd = new SaveAgentCommand(model);
                    var result = await mediator.Send(saveCmd);

                    // Return the data as JSON
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

            }

            var errors = ModelState.SelectMany(x => x.Value.Errors)
                                   .Select(x => x.ErrorMessage)
                                   .ToArray();
            return StatusCode(500, new
            {
                success = false,
                errors
            });
            
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAgents([FromBody] int[] ids)
        {
            try
            {
                var deleteCmd = new DeleteAgentsCommand(ids);
                var result = await mediator.Send(deleteCmd);

                // Return the data as JSON
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        public IActionResult BootstrapTable()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
