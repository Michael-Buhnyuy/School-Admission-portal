<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes - Applicant Auth
$routes->get('api/applicant/programs', 'Api\ApplicantAuth::programs');
$routes->post('api/applicant/register', 'Api\ApplicantAuth::register');
$routes->post('api/applicant/login', 'Api\ApplicantAuth::login');
$routes->post('api/applicant/send-otp', 'Api\ApplicantAuth::sendOtp');
$routes->post('api/applicant/verify-otp', 'Api\ApplicantAuth::verifyOtp');
$routes->post('api/applicant/set-password', 'Api\ApplicantAuth::setPassword');
$routes->get('api/applicant/profile', 'Api\ApplicantAuth::profile');

// API Routes - Application
$routes->get('api/application/status', 'Api\Application::status');
$routes->post('api/application/submit', 'Api\Application::submit');
$routes->put('api/application/update', 'Api\Application::update');

// API Routes - Admin
$routes->post('api/admin/login', 'Api\Admin::login');
$routes->get('api/admin/admins', 'Api\Admin::getAdmins');
$routes->get('api/admin/applicants', 'Api\Admin::applicants');
$routes->get('api/admin/applicant/(:num)', 'Api\Admin::applicant/$1');
$routes->put('api/admin/applicant/(:num)/status', 'Api\Admin::updateStatus/$1');
$routes->get('api/admin/stats', 'Api\Admin::stats');
$routes->get('api/admin/activity', 'Api\Admin::activity');
$routes->get('api/admin/search', 'Api\Admin::search');
$routes->post('api/admin/review/submit', 'Api\Admin::submitReview');
$routes->get('api/admin/reviews/pending', 'Api\Admin::pendingReviews');
$routes->put('api/admin/review/(:num)', 'Api\Admin::review/$1');
$routes->get('api/admin/dashboard', 'Api\Admin::dashboard');

// API Routes - Documents
$routes->get('api/documents/applicant/(:num)', 'Api\Document::getByApplicant/$1');
$routes->get('api/documents/application/(:num)', 'Api\Document::getByApplication/$1');
$routes->get('api/documents/review', 'Api\Document::getPendingReview');
$routes->post('api/documents', 'Api\Document::upload');
$routes->put('api/documents/(:num)/status', 'Api\Document::updateStatus/$1');
$routes->get('api/documents/stats', 'Api\Document::stats');
$routes->delete('api/documents/(:num)', 'Api\Document::delete/$1');

// API Routes - Messages
$routes->post('api/messages', 'Api\Message::create');
$routes->get('api/messages/admin/inbox', 'Api\Message::adminInbox');
$routes->get('api/messages/thread/(:segment)', 'Api\Message::getThread/$1');
$routes->get('api/messages/conversation', 'Api\Message::getConversation');
$routes->put('api/messages/(:num)/read', 'Api\Message::markRead/$1');
$routes->get('api/messages/stats', 'Api\Message::stats');
$routes->get('api/messages/threads', 'Api\Message::threads');
