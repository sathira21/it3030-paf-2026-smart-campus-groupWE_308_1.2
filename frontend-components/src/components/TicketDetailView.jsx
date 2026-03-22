import React, { useState } from 'react';
import TicketComments from './TicketComments';

// MOCK DATA PAYLOADS
const MOCK_CURRENT_USER = {
  id: 'u-409',
  email: 'sathira21@campus.edu',
  role: 'TECH_ADMIN'
};

const MOCK_TICKET_DETAIL = {
  id: 1082,
  title: 'Network Outage in Library Main Wing',
  category: 'Network',
  description: 'The entire east wing of the library is unable to connect to the smart campus WiFi since this morning. Hardwired ethernet ports report no link light either.',
  priority: 'Critical',
  status: 'OPEN',
  createdBy: 'jane.doe@campus.edu',
  createdAt: '2026-04-02T08:15:00Z',
  images: [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
  ],
  comments: [
    { id: 1, authorId: 'u-101', author: 'jane.doe@campus.edu', text: 'To add, we restarted the router on floor 2 and it didn’t make a difference.', createdAt: '2026-04-02T08:30:00Z' },
    { id: 2, authorId: 'u-409', author: 'sathira21@campus.edu', text: 'Checking the central switch logs right now. I will post an update shortly.', createdAt: '2026-04-02T09:00:00Z' }
  ]
};

const StatusDropdown = ({ currentStatus, onChangeStatus }) => {
  const options = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  return (
    <select 
      value={currentStatus} 
      onChange={(e) => onChangeStatus(e.target.value)}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 outline-none font-semibold uppercase"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
      ))}
    </select>
  );
};

const TicketDetailView = () => {
  const [ticket, setTicket] = useState(MOCK_TICKET_DETAIL);

  const handleStatusChange = (newStatus) => {
    // In production, this fires a PATCH request to /api/tickets/{id}/status
    setTicket(prev => ({ ...prev, status: newStatus }));
  };

  const handleAddComment = (text) => {
    // In production, fires POST request to /api/tickets/{id}/comments
    const newCommentObj = {
      id: Date.now(),
      authorId: MOCK_CURRENT_USER.id,
      author: MOCK_CURRENT_USER.email,
      text: text,
      createdAt: new Date().toISOString()
    };
    setTicket(prev => ({ 
      ...prev, 
      comments: [...prev.comments, newCommentObj] 
    }));
  };

  const handleDeleteComment = (commentId) => {
    // In production, fires DELETE request to /api/tickets/{id}/comments/{commentId}
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setTicket(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header / Breadcrumb Simulator */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Tickets</span> 
          <span>/</span>
          <span className="text-gray-900">TKT-{ticket.id}</span>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                  {ticket.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700 px-3 py-1 bg-gray-100 rounded-full">{ticket.category}</span>
                  <span>•</span>
                  <span>Reported by <span className="font-medium text-gray-800">{ticket.createdBy}</span></span>
                  <span>•</span>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                  {ticket.priority} Priority
                </span>
                <StatusDropdown currentStatus={ticket.status} onChangeStatus={handleStatusChange} />
              </div>
            </div>

            {/* Description Boundary */}
            <div className="prose prose-blue max-w-none mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Incident Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Evidence Image Gallery Component */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Attached Evidence ({ticket.images.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ticket.images.map((imgUrl, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-video ring-1 ring-gray-200 shadow-sm cursor-zoom-in">
                       <img src={imgUrl} alt={`Evidence ${i}`} className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Nested Comments Module */}
        <TicketComments 
          comments={ticket.comments} 
          currentUser={MOCK_CURRENT_USER}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />

      </div>
    </div>
  );
};

export default TicketDetailView;
