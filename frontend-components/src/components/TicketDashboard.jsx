import React, { useState } from 'react';

const MOCK_TICKETS = [
  { id: 'TKT-1082', title: 'Network Outage in Library', category: 'Network', priority: 'High', status: 'OPEN', date: '2026-04-01' },
  { id: 'TKT-1083', title: 'Projector Bulb Dead (Room 2A)', category: 'Hardware', priority: 'Medium', status: 'IN_PROGRESS', date: '2026-03-31' },
  { id: 'TKT-1084', title: 'Portal Login Failure', category: 'Software', priority: 'Critical', status: 'RESOLVED', date: '2026-03-30' },
  { id: 'TKT-1085', title: 'HVAC Leak in Student Center', category: 'Facilities', priority: 'High', status: 'OPEN', date: '2026-03-29' },
  { id: 'TKT-1086', title: 'Library Printer Error', category: 'Hardware', priority: 'Low', status: 'RESOLVED', date: '2026-03-28' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved'
  };

  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const PriorityIcon = ({ priority }) => {
  const colors = {
    Low: 'text-gray-400',
    Medium: 'text-amber-500',
    High: 'text-orange-500',
    Critical: 'text-red-600'
  };

  return (
    <div className={`flex items-center gap-1 ${colors[priority]} font-semibold text-sm`}>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
      </svg>
      {priority}
    </div>
  );
};

const TicketDashboard = () => {
  const [filter, setFilter] = useState('ALL');

  const filteredTickets = filter === 'ALL' 
    ? MOCK_TICKETS 
    : MOCK_TICKETS.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Smart Campus Support</h1>
            <p className="text-gray-500 mt-2">Manage and track your operational incidents</p>
          </div>
          
          {/* Filters */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 text-sm font-medium">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === f 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transform transition duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {ticket.id}
                  </span>
                  <StatusBadge status={ticket.status} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {ticket.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-6">
                   <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
                     {ticket.category}
                   </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(ticket.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                  </div>
                  <PriorityIcon priority={ticket.priority} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
             <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
             <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TicketDashboard;
