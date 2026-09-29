WEBHUB – BUSINESS WEBSITE DIRECTORY & DRAG-AND-DROP WEBSITE BUILDER
1. PROJECT OVERVIEW
Build a full-stack web application called WebHub.
WebHub is a public platform where business owners can register their businesses, create and customize a simple business website using a drag-and-drop website builder, and publish that website on WebHub.
Visitors can browse and discover published business websites through categories, search, filters, and business information.
The application should feel like a real-world SaaS platform rather than a basic college CRUD project.
Main concept
WebHub combines:
1. Business website directory
2. Business profile management
3. Drag-and-drop website builder
4. Website templates
5. Website publishing
6. Category-based discovery
7. Business dashboard
8. Admin dashboard
9. Basic website analytics

2. PROJECT OBJECTIVES
The system should allow:
Business Owners
* Register and log in
* Create a business profile
* Select a business category
* Create a website
* Choose a template
* Use a drag-and-drop editor
* Add website sections
* Add text, images, buttons and contact information
* Preview the website
* Save the website
* Publish/unpublish the website
* Edit the website later
* View basic visitor analytics
Visitors
* Visit WebHub without logging in
* Browse business websites
* Search businesses
* Filter businesses by category
* Open a business website
* View business information
* Contact the business
* Share a business website
Admin
* Login securely
* View registered users
* View businesses
* Approve/reject businesses
* Manage categories
* Manage published websites
* Remove inappropriate content
* View platform statistics

3. TECHNOLOGY STACK
Use a beginner-friendly but professional stack.
Frontend
* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Tailwind CSS
* React Router
* Lucide React icons
Backend
* Node.js
* Express.js
Database
Use MySQL.
Use:
* MySQL
* Prisma ORM
Authentication
Use:
* JWT authentication
* bcrypt password hashing
Website Builder
Use a suitable React drag-and-drop library such as:
* dnd-kit
Do NOT build an unnecessarily complicated page-builder engine.
The builder should store website pages/components as structured JSON in the database.
Development tools
* VS Code
* Git
* GitHub
* npm

4. USER ROLES
Create three roles:
Visitor
Can:
* Browse WebHub
* Search businesses
* Filter categories
* View published websites
* View business information
* Submit contact/enquiry forms
Business Owner
Can:
* Register
* Login
* Manage profile
* Create website
* Edit website
* Use drag-and-drop builder
* Preview website
* Publish/unpublish website
* View analytics
Admin
Can:
* Login
* Manage users
* Manage businesses
* Manage categories
* Approve/reject listings
* Manage published websites
* View dashboard statistics

5. MAIN PAGES
Create the following pages.
Public Pages
1. Home Page
Create an attractive modern landing page.
Include:
* WebHub logo
* Navigation bar
* Hero section
* Search bar
* "Create Your Website" CTA
* "Explore Businesses" CTA
* Popular categories
* Featured businesses
* How WebHub works
* Benefits section
* Statistics
* Footer
Hero text:
"Discover Businesses. Build Your Presence. Grow Online."
Supporting text:
"WebHub helps businesses create their online presence and makes it easy for customers to discover them."

2. Explore Businesses
Display businesses in cards.
Each card should contain:
* Business logo
* Business name
* Category
* Short description
* Location
* Website status
* View Website button
Add:
* Search
* Category filter
* Location filter
* Sorting
* Pagination

3. Categories Page
Display categories such as:
* Restaurants
* Hotels
* Education
* Healthcare
* Technology
* Fashion
* Retail
* Finance
* Travel
* Real Estate
* Automotive
* Beauty & Salon
* Fitness
* Professional Services
* Other
Each category should show the number of businesses.

4. Business Website Page
When a visitor clicks a business, show its published website.
Example URL:
/site/business-name
The website should display the content created by the business owner using the builder.

5. About Page
Explain WebHub.

6. Contact Page
Provide a contact form.

6. AUTHENTICATION
Create:
Register Page
Fields:
* Full Name
* Email
* Phone
* Password
* Confirm Password
* Account Type
Account type:
* Business Owner
* Visitor
Business owners should be redirected to their dashboard after registration.

Login Page
Fields:
* Email
* Password
Include:
* Remember me
* Forgot password UI
* Register link

7. BUSINESS OWNER DASHBOARD
Create a professional dashboard.
Sidebar:
* Dashboard
* My Business
* My Websites
* Website Builder
* Templates
* Analytics
* Enquiries
* Settings
* Logout
Dashboard cards:
* Total Website Views
* Published Websites
* Total Enquiries
* Website Status
Show a simple analytics chart.

8. BUSINESS PROFILE
Business owners should be able to create and edit:
* Business name
* Logo
* Cover image
* Description
* Category
* Phone
* Email
* Website
* Address
* City
* State
* Pincode
* Opening hours
* Social media links
Allow profile image upload.

9. WEBSITE BUILDER
This is the main feature of WebHub.
Create a visual drag-and-drop website builder.
The builder layout should contain:
Left Sidebar
Components:
* Heading
* Paragraph
* Image
* Button
* Divider
* Spacer
* Contact section
* Services
* Products
* Gallery
* Testimonials
* Social links
* Map
* Footer
Center Canvas
Display the website being created.
Allow users to:
* Drag components
* Drop components
* Reorder components
* Select components
* Edit components
* Delete components
* Duplicate components
Right Sidebar
When a component is selected, display its properties.
For example:
Heading:
* Text
* Font size
* Alignment
* Font weight
Paragraph:
* Text
* Font size
* Alignment
Button:
* Button text
* Link
* Size
* Alignment
Image:
* Image URL/upload
* Width
* Height
* Border radius

10. WEBSITE BUILDER COMPONENT SYSTEM
Represent each component using JSON.
Example:
{
  "id": "component-001",
  "type": "heading",
  "content": {
    "text": "Welcome to Our Business"
  },
  "style": {
    "fontSize": 32,
    "textAlign": "center"
  }
}
A website can contain multiple components.
Example:
{
  "pages": [
    {
      "name": "Home",
      "slug": "home",
      "components": []
    }
  ]
}
Store this structure in the database.

11. WEBSITE BUILDER FEATURES
Implement:
Add Component
Users can select a component and add it to the canvas.
Drag and Drop
Users can reorder components.
Edit
Users can change component properties.
Delete
Users can remove components.
Duplicate
Users can duplicate components.
Undo/Redo
Implement basic:
* Undo
* Redo
Preview
Provide a full-screen preview mode.
Save
Save the current website configuration to the database.
Publish
When the user clicks Publish:
* Validate website
* Save latest changes
* Change status to Published
* Make website publicly accessible
Unpublish
Allow users to remove the website from public visibility.

12. WEBSITE TEMPLATES
Create at least 5 templates.
Template 1
Restaurant
Template 2
Business/Corporate
Template 3
Portfolio
Template 4
Salon/Beauty
Template 5
Small Retail Business
Each template should have:
* Hero
* About
* Services
* Gallery
* Contact
* Footer
Users can start with a template and customize it.

13. WEBSITE PUBLISHING
Every business website should have a unique public URL.
Example:
/site/abc-restaurant
or:
/site/xyz-fashion-store
Use a unique slug.
Prevent duplicate slugs.
Only published websites should be visible publicly.

14. BUSINESS DIRECTORY
Create a central WebHub directory.
Display:
* Business name
* Category
* Location
* Logo
* Short description
* Website preview
* View Website button
Allow visitors to search.
Example:
Search:
"restaurant"
Results:
* ABC Restaurant
* XYZ Restaurant
* City Food House

15. SEARCH SYSTEM
Implement search across:
* Business name
* Category
* Location
* Services
* Description
Search should provide useful results even when users type partial keywords.
Example:
Searching:
food
can show:
Restaurants and food-related businesses.

16. CATEGORY SYSTEM
Create a category database.
Each category should contain:
* ID
* Name
* Description
* Icon
* Status
Admin can:
* Add category
* Edit category
* Delete category
* Enable/disable category

17. ADMIN DASHBOARD
Create a separate admin dashboard.
Dashboard statistics:
* Total users
* Total businesses
* Published websites
* Pending approvals
* Total website views
* Total enquiries
Admin sidebar:
* Dashboard
* Users
* Businesses
* Websites
* Categories
* Reports
* Settings

18. BUSINESS APPROVAL SYSTEM
When a business owner registers:
Status:
Pending
Admin can:
* Approve
* Reject
Only approved businesses should appear in the public directory.
Add:
* Approval date
* Rejection reason

19. ANALYTICS
Implement basic website analytics.
Track:
* Total views
* Daily views
* Monthly views
* Unique visitors if feasible
* Contact form submissions
* Button clicks if feasible
Display analytics using charts.
Do not use advanced external analytics services.
Create a simple internal analytics system.
Example:
Website Views

Monday       20
Tuesday      35
Wednesday    42
Thursday     31
Friday       58
Display the data using charts.

20. CONTACT / ENQUIRY SYSTEM
Each published business website should have a contact form.
Fields:
* Name
* Email
* Phone
* Message
When submitted:
Store the enquiry in the database.
Business owners can view enquiries from:
Dashboard → Enquiries

21. DATABASE DESIGN
Create these main tables:
users
* id
* name
* email
* phone
* password
* role
* status
* created_at
* updated_at
businesses
* id
* user_id
* category_id
* business_name
* slug
* description
* logo
* cover_image
* phone
* email
* address
* city
* state
* pincode
* status
* created_at
* updated_at
categories
* id
* name
* description
* icon
* status
* created_at
websites
* id
* business_id
* name
* slug
* template
* content_json
* status
* created_at
* updated_at
* published_at
enquiries
* id
* business_id
* name
* email
* phone
* message
* status
* created_at
analytics
* id
* website_id
* event_type
* visitor_ip_hash
* page
* created_at
Use appropriate primary keys, foreign keys, indexes and constraints.

22. SECURITY
Implement basic security practices:
* Hash passwords using bcrypt
* JWT authentication
* Protected routes
* Role-based authorization
* Input validation
* Server-side validation
* Prevent unauthorized website editing
* Prevent unauthorized admin access
* Sanitize user-generated content
* Do not expose passwords
* Use environment variables for secrets
Create .env.example.
Never hardcode:
* Database passwords
* JWT secrets
* API keys

23. RESPONSIVE DESIGN
The entire application must work on:
* Desktop
* Laptop
* Tablet
* Mobile
The website builder should also have a responsive preview mode.
Add:
* Desktop preview
* Tablet preview
* Mobile preview

24. UI/UX DESIGN
Use a modern SaaS-style interface.
Design principles:
* Clean
* Professional
* Minimal
* Easy to understand
* Consistent spacing
* Rounded cards
* Subtle shadows
* Clear buttons
* Accessible typography
Use a consistent design system.
Do not overcrowd pages.
Use icons where useful.

25. NAVIGATION
Public navigation:
WebHub
Home
Explore
Categories
About
Contact
Login
Get Started
Business dashboard navigation:
Dashboard
My Business
My Websites
Builder
Templates
Analytics
Enquiries
Settings
Logout
Admin navigation:
Dashboard
Users
Businesses
Websites
Categories
Reports
Settings
Logout

26. API STRUCTURE
Create REST APIs.
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Businesses
GET    /api/businesses
GET    /api/businesses/:id
POST   /api/businesses
PUT    /api/businesses/:id
DELETE /api/businesses/:id
Categories
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
Websites
GET    /api/websites
GET    /api/websites/:id
POST   /api/websites
PUT    /api/websites/:id
DELETE /api/websites/:id
POST   /api/websites/:id/publish
POST   /api/websites/:id/unpublish
Analytics
GET /api/websites/:id/analytics
POST /api/websites/:id/analytics
Enquiries
GET  /api/enquiries
POST /api/enquiries
PUT  /api/enquiries/:id

27. PROJECT FOLDER STRUCTURE
Use a clean structure similar to:
webhub/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── builder/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── prisma/
│   ├── app.js
│   └── package.json
│
├── README.md
├── .env.example
└── package.json

28. DEVELOPMENT PHASES
Do NOT attempt to build everything at once.
Build the project in phases.
PHASE 1 – Project Setup
Create:
* React frontend
* Node/Express backend
* MySQL database
* Prisma
* Tailwind
* Routing
* Environment configuration
Test that frontend and backend communicate successfully.

PHASE 2 – Authentication
Implement:
* Registration
* Login
* Logout
* JWT
* Password hashing
* Protected routes
* Role-based access
Test all authentication flows.

PHASE 3 – Business Management
Implement:
* Business profile
* Categories
* Business CRUD
* Business dashboard
Test database operations.

PHASE 4 – Public Directory
Implement:
* Home page
* Explore page
* Category page
* Business cards
* Search
* Filters
* Business detail page
Test that approved businesses appear correctly.

PHASE 5 – Website Templates
Create 5 starter templates.
Ensure each template can be loaded into the builder.

PHASE 6 – Drag-and-Drop Builder
Implement:
* Component sidebar
* Canvas
* Properties panel
* Drag-and-drop
* Add
* Delete
* Duplicate
* Reorder
* Edit
* Undo
* Redo
* Save
Test each component individually.

PHASE 7 – Preview & Publishing
Implement:
* Preview mode
* Responsive preview
* Website slug
* Publish
* Unpublish
* Public website page
Test that unpublished websites cannot be accessed publicly.

PHASE 8 – Enquiry System
Implement:
* Contact form
* Database storage
* Business owner enquiry dashboard

PHASE 9 – Analytics
Implement:
* Website views
* Daily statistics
* Monthly statistics
* Charts
* Basic event tracking

PHASE 10 – Admin Panel
Implement:
* Admin login
* User management
* Business approval
* Category management
* Website management
* Statistics

PHASE 11 – UI POLISH
Improve:
* Responsive design
* Loading states
* Error messages
* Empty states
* Form validation
* Toast notifications
* Accessibility
* Mobile navigation

PHASE 12 – TESTING
Test:
Authentication
* Valid registration
* Duplicate email
* Invalid password
* Login
* Logout
Business
* Create business
* Edit business
* Delete business
* Category assignment
Builder
* Add component
* Edit component
* Delete component
* Drag/reorder
* Save
* Preview
* Publish
Directory
* Search
* Filter
* Category
* Business page
Admin
* Approve
* Reject
* Manage users
* Manage categories

29. ERROR HANDLING
Implement proper error handling.
Show user-friendly messages such as:
Something went wrong. Please try again.
For validation:
Business name is required.
Please enter a valid email address.
Password must contain at least 8 characters.
Do not expose server stack traces to users.

30. DEMO DATA
Create seed data for demonstration.
Add at least:
Categories
15 categories.
Businesses
10 sample businesses.
Example:
* Belagavi Tech Solutions
* Mysuru Food House
* Karnataka Fashion Hub
* Bengaluru Digital Works
* Heritage Travels
Websites
Create several sample published websites using different templates.
This will make the project easy to demonstrate during the BCA project presentation.

31. IMPORTANT PROJECT LIMITATIONS
Keep the first version manageable.
Do NOT implement:
* Complex AI website generation
* Online payment gateway
* Full e-commerce system
* Domain purchasing
* Real-time collaborative editing
* Advanced SEO system
* Complex animation editor
* Enterprise-level hosting infrastructure
These can be mentioned as future enhancements.

32. FUTURE ENHANCEMENTS
Mention these in the project documentation:
* AI website generation
* AI content generation
* Custom domains
* Online payments
* Premium templates
* Advanced analytics
* Email marketing
* SEO tools
* E-commerce functionality
* Appointment booking
* WhatsApp integration
* Multi-language websites
* Mobile application

33. PROJECT DOCUMENTATION
Generate a detailed README.md.
Include:
1. Project introduction
2. Problem statement
3. Proposed solution
4. Objectives
5. Features
6. Technology stack
7. System architecture
8. Database design
9. API documentation
10. Installation instructions
11. Environment variables
12. How to run frontend
13. How to run backend
14. Database setup
15. Test credentials
16. Screenshots section
17. Future enhancements

34. BCA PROJECT DOCUMENTATION
Also create documentation suitable for a 3rd-year BCA project.
Include:
Chapter 1
Introduction
Chapter 2
Problem Statement
Chapter 3
Existing System
Chapter 4
Proposed System
Chapter 5
Objectives
Chapter 6
System Requirements
Chapter 7
System Design
Chapter 8
Database Design
Chapter 9
Implementation
Chapter 10
Testing
Chapter 11
Results
Chapter 12
Future Scope
Chapter 13
Conclusion

35. FINAL QUALITY REQUIREMENTS
The final application must:
* Actually work end-to-end
* Have working authentication
* Have working database operations
* Have a functional drag-and-drop builder
* Save builder data
* Publish websites
* Display published websites
* Have working search
* Have working categories
* Have working business dashboards
* Have working admin functionality
* Have responsive UI
* Have proper validation
* Have proper error handling
* Avoid placeholder functionality wherever possible
Do not create fake buttons that do nothing.
Every major button should perform its intended action.

36. DEVELOPMENT INSTRUCTION FOR ANTIGRAVITY
Follow this development order strictly:
1. Analyze requirements
2. Create project structure
3. Configure frontend
4. Configure backend
5. Configure MySQL + Prisma
6. Create database schema
7. Run migrations
8. Create seed data
9. Implement authentication
10. Implement business management
11. Implement categories
12. Implement public directory
13. Implement templates
14. Implement drag-and-drop builder
15. Implement save/load builder data
16. Implement preview
17. Implement publishing
18. Implement public websites
19. Implement enquiries
20. Implement analytics
21. Implement admin dashboard
22. Add validation
23. Add error handling
24. Make responsive
25. Test the complete application
26. Fix all errors
27. Generate README
28. Generate project documentation
After completing each phase:
* Run the application
* Test the implemented functionality
* Fix errors before moving to the next phase
* Do not break previously completed functionality
At the end, provide:
1. Complete project
2. Database schema
3. API documentation
4. README
5. Setup instructions
6. Test credentials
7. List of implemented features
8. List of future enhancements
9. Known limitations
The goal is to create a functional, professional, demonstrable BCA 3rd-year project, not merely a UI prototype.