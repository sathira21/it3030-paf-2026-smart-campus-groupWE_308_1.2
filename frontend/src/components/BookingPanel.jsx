// ModernResourceBooking.js - Category Wise Resources with Modern UI
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, GraduationCap, Building2, Laptop, Wrench, MapPin,
  CheckCircle, XCircle, AlertCircle, Mail, User, Phone, ChevronDown,
  ChevronUp, Search, SlidersHorizontal, X, Sparkles, Star, TrendingUp,
  LayoutGrid, ArrowRight, Loader2, RefreshCw, Heart, Wifi, Wind, Maximize,
  Coffee, Tv, Mic, Video, BookOpen, Award, Target, Globe
} from 'lucide-react';

const API_BASE_URL = '/api';

// Category configuration
const categories = [
  { 
    id: 'LECTURE_HALL', 
    name: 'Lecture Halls', 
    icon: Building2, 
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Spacious auditoriums for lectures and presentations'
  },
  { 
    id: 'LAB', 
    name: 'Laboratories', 
    icon: Laptop, 
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Fully equipped labs for practical sessions'
  },
  { 
    id: 'MEETING_ROOM', 
    name: 'Meeting Rooms', 
    icon: Users, 
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    description: 'Perfect for group discussions and meetings'
  },
  { 
    id: 'EQUIPMENT', 
    name: 'Equipment', 
    icon: Wrench, 
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    description: 'Professional equipment for your projects'
  }
];

const ModernResourceBooking = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', phone: '' });
  
  const [bookingForm, setBookingForm] = useState({
    date: '', purpose: '', attendees: 1,
    studentName: '', studentEmail: '', studentPhone: '',
    specialRequests: '', agreeTerms: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Default images for different resource types
  const getDefaultImage = (type) => {
    const defaultImages = {
      LECTURE_HALL: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop',
      LAB: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop',
      MEETING_ROOM: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=500&fit=crop',
      EQUIPMENT: 'https://images.unsplash.com/photo-1581092335871-4c2c9b6b4d7a?w=800&h=500&fit=crop'
    };
    return defaultImages[type] || defaultImages.LECTURE_HALL;
  };

  // Get image URL with fallback
  const getImageUrl = (resource) => {
    if (resource.images && resource.images.length > 0 && resource.images[0]) {
      const img = resource.images[0];
      if (img.startsWith('http')) return img;
      return `${API_BASE_URL}${img}`;
    }
    return getDefaultImage(resource.type);
  };

  // Generate 2-hour time slots
  const generateTimeSlots = () => {
    const slots = [];
    const timeSlots = [
      { start: 8, end: 10, label: '8:00 AM - 10:00 AM' },
      { start: 10, end: 12, label: '10:00 AM - 12:00 PM' },
      { start: 12, end: 14, label: '12:00 PM - 2:00 PM' },
      { start: 14, end: 16, label: '2:00 PM - 4:00 PM' },
      { start: 16, end: 18, label: '4:00 PM - 6:00 PM' }
    ];
    
    timeSlots.forEach(slot => {
      slots.push({
        id: `${slot.start}-${slot.end}`,
        startTime: `${slot.start.toString().padStart(2, '0')}:00`,
        endTime: `${slot.end.toString().padStart(2, '0')}:00`,
        displayTime: slot.label,
        startHour: slot.start,
        endHour: slot.end
      });
    });
    return slots;
  };

  // Load resources
  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resources`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setResources(data.data);
          setFilteredResources(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Filter resources based on category and search
  useEffect(() => {
    let filtered = [...resources];
    
    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(r => r.type === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredResources(filtered);
  }, [selectedCategory, searchQuery, resources]);

  const handleBooking = (resource) => {
    setSelectedResource(resource);
    setSelectedDate('');
    setSelectedSlot(null);
    setExistingBookings([]);
    setBookingForm({
      date: '', purpose: '', attendees: 1,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone,
      specialRequests: '', agreeTerms: false
    });
    setFormErrors({});
    setTouched({});
    setShowBookingModal(true);
  };

  // Load existing bookings
  const loadExistingBookings = async (resourceId, date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          const resourceBookings = data.data.filter(b => 
            b.resourceId === resourceId && b.bookingDate === date
          );
          setExistingBookings(resourceBookings);
          return resourceBookings;
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading existing bookings:', error);
      return [];
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookingForm(prev => ({ ...prev, date }));
    
    const existing = await loadExistingBookings(selectedResource.id, date);
    const allSlots = generateTimeSlots();
    
    // Mark slots as unavailable if already booked
    const bookedTimes = existing.map(b => b.startTime);
    const availableSlots = allSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.startTime),
      bookingStatus: existing.find(b => b.startTime === slot.startTime)?.status
    }));
    
    setAvailableTimeSlots(availableSlots);
  };

  const getSlotStatus = (slot) => {
    if (!slot.available) {
      const status = slot.bookingStatus;
      if (status === 'APPROVED') {
        return { disabled: true, className: 'bg-red-500 text-white cursor-not-allowed line-through', message: 'Already Booked' };
      }
      if (status === 'PENDING') {
        return { disabled: true, className: 'bg-amber-500 text-white cursor-not-allowed', message: 'Pending Approval' };
      }
      return { disabled: true, className: 'bg-gray-400 text-white cursor-not-allowed', message: 'Not Available' };
    }
    
    if (selectedSlot && selectedSlot.id === slot.id) {
      return { disabled: false, className: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg', message: 'Selected' };
    }
    
    return { disabled: false, className: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50', message: 'Available' };
  };

  const toggleTimeSlot = (slot) => {
    if (!slot.available) {
      alert(getSlotStatus(slot).message);
      return;
    }
    
    if (selectedSlot && selectedSlot.id === slot.id) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch(name) {
      case 'studentName':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'studentEmail':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(value)) error = 'Valid email required';
        break;
      case 'studentPhone':
        if (!value.trim()) error = 'Phone number is required';
        break;
      case 'date':
        if (!value) error = 'Please select a date';
        break;
      case 'purpose':
        if (!value.trim()) error = 'Purpose is required';
        else if (value.trim().length < 15) error = 'Minimum 15 characters';
        break;
      case 'attendees':
        if (!value) error = 'Number of attendees required';
        else if (value < 1) error = 'At least 1 attendee';
        else if (value > selectedResource?.capacity) error = `Max capacity ${selectedResource?.capacity}`;
        break;
      case 'agreeTerms':
        if (!value) error = 'You must agree to terms';
        break;
    }
    return error;
  };

  const handleFieldChange = (name, value) => {
    setBookingForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
    if (name === 'studentName') setCurrentUser(prev => ({ ...prev, name: value }));
    if (name === 'studentEmail') setCurrentUser(prev => ({ ...prev, email: value }));
    if (name === 'studentPhone') setCurrentUser(prev => ({ ...prev, phone: value }));
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, bookingForm[name]);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    const fields = ['studentName', 'studentEmail', 'studentPhone', 'date', 'purpose', 'attendees', 'agreeTerms'];
    fields.forEach(field => {
      const error = validateField(field, bookingForm[field]);
      if (error) errors[field] = error;
    });
    if (!selectedSlot) errors.timeSlot = 'Please select a time slot';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitBooking = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const bookingData = {
      resourceId: selectedResource.id,
      bookingDate: bookingForm.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      purpose: bookingForm.purpose,
      attendees: parseInt(bookingForm.attendees),
      specialRequests: bookingForm.specialRequests || "",
      studentName: bookingForm.studentName,
      studentEmail: bookingForm.studentEmail,
      studentPhone: bookingForm.studentPhone
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert(`Γ£à Booking submitted successfully!\n\nReference: ${result.data.bookingReference}\nTime: ${selectedSlot.displayTime}`);
        setShowBookingModal(false);
        setSelectedSlot(null);
        setSelectedDate('');
      } else {
        alert(`Γ¥î Failed to book: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Γ¥î Network error. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Group resources by category for display
  const resourcesByCategory = categories.map(cat => ({
    ...cat,
    resources: filteredResources.filter(r => r.type === cat.id)
  })).filter(cat => cat.resources.length > 0);

  const allResourcesCount = filteredResources.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Smart Campus Hub</h1>
              <p className="text-white/80">Book your perfect study and meeting space</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by resource name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2">
                <span className="text-sm font-medium">{allResourcesCount} Resources Available</span>
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2 hover:bg-white/30 transition-all"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === 'ALL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <LayoutGrid size={18} />
              All Resources
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{allResourcesCount}</span>
            </button>
            
            {categories.map(cat => {
              const Icon = cat.icon;
              const count = resources.filter(r => r.type === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  {cat.name}
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 size={48} className="text-blue-600 animate-spin" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        ) : (
          // Display resources by category
          (selectedCategory === 'ALL' ? resourcesByCategory : categories.filter(c => c.id === selectedCategory)).map((category) => {
            const CategoryIcon = category.icon;
            const categoryResources = selectedCategory === 'ALL' 
              ? category.resources 
              : filteredResources.filter(r => r.type === category.id);
            
            if (categoryResources.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${category.bgColor} rounded-2xl flex items-center justify-center`}>
                      <CategoryIcon size={24} className={category.textColor} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {categoryResources.length} resource{categoryResources.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryResources.map((resource) => (
                    <div key={resource.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                      <div className="relative h-52 overflow-hidden bg-gray-100">
                        <img 
                          src={getImageUrl(resource)} 
                          alt={resource.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = getDefaultImage(resource.type);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-lg px-2 py-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold text-gray-900">{resource.rating || 4.5}</span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md">
                            Available
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{resource.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 flex items-center">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{resource.location}</span>
                        </p>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {resource.amenities?.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {amenity.length > 15 ? amenity.substring(0, 12) + '...' : amenity}
                            </span>
                          ))}
                          {resource.amenities?.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              +{resource.amenities.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-blue-500" />
                              <span>{resource.capacity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-blue-500" />
                              <span>2h slots</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                            <Sparkles size={14} />
                            <span>Free</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleBooking(resource)}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                          <Calendar size={16} />
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Book {selectedResource.name}</h2>
                <p className="text-sm text-gray-500">Select a 2-hour time slot (8AM - 6PM)</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" placeholder="Full Name *" value={bookingForm.studentName}
                      onChange={(e) => handleFieldChange('studentName', e.target.value)}
                      onBlur={() => handleFieldBlur('studentName')}
                      className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        formErrors.studentName && touched.studentName ? 'border-red-500' : 'border-gray-200'
                      }`} />
                    {formErrors.studentName && touched.studentName && <p className="text-red-500 text-xs mt-1">{formErrors.studentName}</p>}
                  </div>
                  <div>
                    <input type="email" placeholder="Email Address *" value={bookingForm.studentEmail}
                      onChange={(e) => handleFieldChange('studentEmail', e.target.value)}
                      onBlur={() => handleFieldBlur('studentEmail')}
                      className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        formErrors.studentEmail && touched.studentEmail ? 'border-red-500' : 'border-gray-200'
                      }`} />
                    {formErrors.studentEmail && touched.studentEmail && <p className="text-red-500 text-xs mt-1">{formErrors.studentEmail}</p>}
                  </div>
                  <div>
                    <input type="tel" placeholder="Phone Number *" value={bookingForm.studentPhone}
                      onChange={(e) => handleFieldChange('studentPhone', e.target.value)}
                      onBlur={() => handleFieldBlur('studentPhone')}
                      className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        formErrors.studentPhone && touched.studentPhone ? 'border-red-500' : 'border-gray-200'
                      }`} />
                    {formErrors.studentPhone && touched.studentPhone && <p className="text-red-500 text-xs mt-1">{formErrors.studentPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Date *</label>
                <input type="date" value={bookingForm.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    formErrors.date && touched.date ? 'border-red-500' : 'border-gray-200'
                  }`} />
                {formErrors.date && touched.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium">Select 2-Hour Time Slot *</label>
                    <span className="text-sm font-semibold text-blue-600">
                      {selectedSlot ? '1 slot selected' : 'No slot selected'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-white border rounded"></div><span>Available</span></div>
                    <div className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-blue-600 rounded"></div><span>Selected</span></div>
                    <div className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-amber-500 rounded"></div><span>Pending</span></div>
                    <div className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-red-500 rounded"></div><span>Booked</span></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableTimeSlots.map((slot) => {
                      const { disabled, className, message } = getSlotStatus(slot);
                      return (
                        <button
                          key={slot.id}
                          onClick={() => toggleTimeSlot(slot)}
                          disabled={disabled}
                          title={message}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${className}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot.displayTime}</span>
                            {selectedSlot && selectedSlot.id === slot.id && <CheckCircle size={16} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {formErrors.timeSlot && <p className="text-red-500 text-xs mt-2">{formErrors.timeSlot}</p>}
                </div>
              )}

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-emerald-600" />
                      <span className="font-medium text-emerald-800">{selectedSlot.displayTime}</span>
                      <span className="text-xs text-emerald-600">(2 hours)</span>
                    </div>
                    <button onClick={() => setSelectedSlot(null)} className="text-red-500 hover:text-red-600 text-sm">
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Purpose */}
              <div>
                <textarea placeholder="Purpose of Booking * (min 15 characters)" rows="3"
                  value={bookingForm.purpose}
                  onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  onBlur={() => handleFieldBlur('purpose')}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    formErrors.purpose && touched.purpose ? 'border-red-500' : 'border-gray-200'
                  }`} />
                {formErrors.purpose && touched.purpose && <p className="text-red-500 text-xs">{formErrors.purpose}</p>}
              </div>

              {/* Attendees */}
              <div>
                <input type="number" placeholder="Number of Attendees *" min="1" max={selectedResource.capacity}
                  value={bookingForm.attendees}
                  onChange={(e) => handleFieldChange('attendees', parseInt(e.target.value))}
                  onBlur={() => handleFieldBlur('attendees')}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    formErrors.attendees && touched.attendees ? 'border-red-500' : 'border-gray-200'
                  }`} />
                {formErrors.attendees && touched.attendees && <p className="text-red-500 text-xs">{formErrors.attendees}</p>}
                <p className="text-xs text-gray-400 mt-1">Maximum capacity: {selectedResource.capacity}</p>
              </div>

              {/* Special Requests */}
              <textarea placeholder="Special Requests (Optional)" rows="2"
                value={bookingForm.specialRequests}
                onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input type="checkbox" checked={bookingForm.agreeTerms}
                  onChange={(e) => handleFieldChange('agreeTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">I agree to the terms and conditions</span>
              </div>
              {formErrors.agreeTerms && touched.agreeTerms && <p className="text-red-500 text-xs">{formErrors.agreeTerms}</p>}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowBookingModal(false)} className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium">
                  Cancel
                </button>
                <button onClick={submitBooking} disabled={isLoading || !selectedSlot}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {isLoading ? 'Submitting...' : 'Book 2-Hour Slot'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ModernResourceBooking;
