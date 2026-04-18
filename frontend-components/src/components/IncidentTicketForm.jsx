import React, { useState } from 'react';

const IncidentTicketForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    priority: 'Low',
    preferredContact: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Visually restrict to max 3 files natively on selection
    if (selectedFiles.length > 3) {
      setError('You can only upload a maximum of 3 images.');
      // Truncate to first 3 if they selected more to enforce it cleanly
      setFiles(selectedFiles.slice(0, 3));
      return;
    }
    
    const validImages = selectedFiles.filter(file => file.type.startsWith('image/'));
    if (validImages.length !== selectedFiles.length) {
      setError('Only image files (JPEG, PNG) are allowed.');
      setFiles(validImages.slice(0, 3));
      return;
    }

    setError('');
    setFiles(validImages);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Prepare standard JSON properties
      const ticketPayload = {
        title: formData.category + ' Issue: ' + formData.description.substring(0, 20) + '...',
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        createdBy: formData.preferredContact, // Example mapping
      };

      // 2. Assemble Multipart FormData mapping JSON stringified parts along with binary Files
      const submitData = new FormData();
      
      // Append JSON payload explicitly specifying the application/json MIME type
      submitData.append(
        'ticket', 
        new Blob([JSON.stringify(ticketPayload)], { type: 'application/json' })
      );

      // Append binary file iteration
      files.forEach(file => {
        submitData.append('files', file);
      });

      // 3. Simulated/Real Request Dispatch
      /* 
       * EXAMPLE API CALL:
       * await fetch('http://localhost:8081/api/tickets/create-with-files', {
       *    method: 'POST',
       *    body: submitData, // Browser automates Content-Type multipart/form-data boundary!
       *    headers: { 'Authorization': `Bearer ${localStorage.getItem('oauth2_token')}` }
       * });
       */
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Ticket submitted successfully with attachments!');
      setFormData({ category: '', description: '', priority: 'Low', preferredContact: '' });
      setFiles([]);
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">Submit Incident Ticket</h2>
          <p className="text-blue-100 text-sm mt-1">Provide details to help our dispatch resolve your issue rapidly.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="" disabled>Select category</option>
              <option value="Hardware">Hardware/Device Issue</option>
              <option value="Software">Software/Access Issue</option>
              <option value="Network">Network/WiFi</option>
              <option value="Facilities">Campus Facilities</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Describe the incident in detail..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Preferred Contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Contact</label>
              <input
                type="text"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleInputChange}
                placeholder="Email or Phone"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Evidence (Images)</label>
            <p className="text-xs text-gray-500 mb-3">Attach up to 3 images to help diagnose the issue.</p>
            
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-white transition-colors hover:border-blue-400 group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG (MAX. 3 files)</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      disabled={files.length >= 3}
                    />
                </label>
            </div>
            
            {error && <p className="text-sm text-red-500 mt-2 font-medium">{error}</p>}

            {/* Image Preview Tags */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="text-blue-400 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length === 3 && (
               <p className="text-xs text-amber-500 mt-2">Maximum file limit reached.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`relative w-full flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-lg px-5 py-3.5 shadow-lg transform transition-all duration-200 ${isLoading ? 'cursor-wait opacity-90' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Upload...
              </span>
            ) : (
              'Submit Ticket'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentTicketForm;
