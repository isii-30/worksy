// Mock "current user" — prefills the profile form fields on load.
// Not persisted; refreshing the page resets these back to these defaults.
// (Profile picture is the one exception — see ProfileContext.jsx.)
export const mockCurrentUser = {
  firstName: 'Senali',
  lastName: 'Jayasundara',
  email: 'senalijay05@gmail.com',
  dob: '2005-09-04',
  contactNumber: '0771234567',
  jobTitle: 'Vice Secretary',
  bio: 'Building Worksy, one component at a time.',
};