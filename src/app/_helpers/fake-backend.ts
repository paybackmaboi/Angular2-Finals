import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';

// ✅ Clear stored accounts on app/browser startup
localStorage.removeItem(accountsKey);

// Always start with an empty account list
let accounts: any[] = [];

// initial departments data
let departments = [
    { id: 1, name: 'Engineering', description: 'Software development team', employeeCount: 1 },
    { id: 2, name: 'Marketing', description: 'Marketing team', employeeCount: 1 },
    { id: 3, name: 'IT', description: 'test', employeeCount: 0 }
];

let workflows: any[] = [];
let requests: any[] = [];
let employees: any[] = [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT': 
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();

                // Department routes
                case url.endsWith('/departments') && method === 'GET':
                    return getDepartments();
                case url.match(/\/departments\/\d+$/) && method === 'GET':
                    return getDepartmentById();
                case url.endsWith('/departments') && method === 'POST':
                    return createDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'PUT':
                    return updateDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'DELETE':
                    return deleteDepartment();

                // Workflow routes
                case url.endsWith('/workflows') && method === 'GET':
                    return getWorkflows();
                case url.match(/\/workflows\/employee\/\d+$/) && method === 'GET':
                    return getWorkflowsByEmployee();
                case url.match(/\/workflows\/\d+$/) && method === 'PUT':
                    return updateWorkflow();

                // Request routes
                case url.endsWith('/requests') && method === 'GET':
                    return getRequests();
                case url.endsWith('/requests') && method === 'POST':
                    return createRequest();
                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    return updateRequest();
                case url.match(/\/requests\/\d+$/) && method === 'DELETE':
                    return deleteRequest();

                default:
                    return next.handle(request);
            }
        }

        // ===== ROUTE FUNCTIONS =====

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password);
            
            if (!account) return error('Email or password is incorrect');
        
            // ✅ Check if email is verified
            if (!account.isVerified) {
                return error('Email is not verified. Please check your inbox to verify.');
            }
        
            // ✅ Check if status is 'Inactive'
            if (account.status?.toLowerCase() === 'inactive') {
                return error('Account is InActive. Please contact system administrator!');
            }
        
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }
        

        function refreshToken() {
            const refreshToken = getRefreshToken();
            if (!refreshToken) return unauthorized();

            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            if (!account) return unauthorized();

            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();

            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function register() {
            const account = body;

            if (accounts.find(x => x.email === account.email)) {
                setTimeout(() => {
                    this.alertService.info(`
                        <h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API. A real backend would send a real email.</div>
                    `, { autoClose: false });
                }, 1000);
                return ok();
            }

            account.id = newAccountId();
            account.role = account.id === 1 ? Role.Admin : Role.User;
            account.dateCreated = new Date().toISOString();
            account.refreshTokens = [];
            delete account.confirmPassword;

            if (account.role === Role.Admin) {
                account.isVerified = true;
            } else {
                account.verificationToken = new Date().getTime().toString();
                account.isVerified = false;

                setTimeout(() => {
                    const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                    this.alertService.info(`
                        <h4>Verification Email</h4>
                        <p>Thanks for registering!</p>
                        <p>Please click the below link to verify your email address:</p>
                        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API. A real backend would send a real email.</div>
                    `, { autoClose: false });
                }, 1000);
            }

            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find(x => x.verificationToken === token);
            if (!account) return error('Verification failed');

            account.isVerified = true;
            account.status = 'Active';
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            this.alertService.info(`Account ${account.email} verified successfully`);
            return ok();
        }

        function forgotPassword() {
            const { email } = body;
            const account = accounts.find(x => x.email === email);
            if (!account) return ok();

            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                this.alertService.info(`
                    <h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password. It will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> This fake backend displayed this "email" so you can test without an API.</div>
                `, { autoClose: false });
            }, 1000);

            return ok();
        }

        function validateResetToken() {
            const { token } = body;
            const account = accounts.find(x => x.resetToken === token && new Date() < new Date(x.resetTokenExpires));
            if (!account) return error('Invalid token');
            return ok();
        }

        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find(x => x.resetToken === token && new Date() < new Date(x.resetTokenExpires));
            if (!account) return error('Invalid token');

            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map(x => basicDetails(x)));
        }

        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();
            const account = accounts.find(x => x.id === idFromUrl());
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) return unauthorized();
            return ok(basicDetails(account));
        }

        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const account = body;
            if (accounts.find(x => x.email === account.email)) return error(`Email ${account.email} is already registered`);

            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();

            const params = body;
            const account = accounts.find(x => x.id === idFromUrl());
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) return unauthorized();

            if (!params.password) delete params.password;
            delete params.confirmPassword;

            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok(basicDetails(account));
        }

        function deleteAccount() {
            if (!isAuthenticated()) return unauthorized();

            const id = idFromUrl();
            const account = accounts.find(x => x.id === id);
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) return unauthorized();

            const isDeletingAdmin = account.role === Role.Admin;

            accounts = accounts.filter(x => x.id !== id);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            if (isDeletingAdmin) {
                accounts = [];
                localStorage.setItem(accountsKey, JSON.stringify(accounts));
                setTimeout(() => location.reload(), 500);
            }

            return ok();
        }

        function getDepartments() {
            if (!isAuthenticated()) return unauthorized();
            return ok(departments);
        }

        function getDepartmentById() {
            if (!isAuthenticated()) return unauthorized();
            const department = departments.find(x => x.id === idFromUrl());
            return ok(department);
        }

        function createDepartment() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const department = body;
            department.id = departments.length ? Math.max(...departments.map(x => x.id)) + 1 : 1;
            department.employeeCount = 0;
            departments.push(department);

            return ok();
        }

        function updateDepartment() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const params = body;
            const department = departments.find(x => x.id === idFromUrl());
            
            if (!department) return error('Department not found');
            
            Object.assign(department, params);
            
            return ok();
        }

        function deleteDepartment() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const id = idFromUrl();
            const department = departments.find(x => x.id === id);
            
            if (!department) return error('Department not found');
            if (department.employeeCount > 0) return error('Cannot delete department with employees');
            
            departments = departments.filter(x => x.id !== id);
            
            return ok();
        }

        function getWorkflows() {
            if (!isAuthenticated()) return unauthorized();
            return ok(workflows);
        }

        function getWorkflowsByEmployee() {
            if (!isAuthenticated()) return unauthorized();
            
            const urlParts = url.split('/');
            const employeeId = parseInt(urlParts[urlParts.length - 1]);
            
            const employeeWorkflows = workflows.filter(x => x.employeeId === employeeId);
            return ok(employeeWorkflows);
        }

        function updateWorkflow() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const params = body;
            const workflow = workflows.find(x => x.id === idFromUrl());
            
            if (!workflow) return error('Workflow not found');
            
            Object.assign(workflow, params);
            
            return ok();
        }

        function getRequests() {
            if (!isAuthenticated()) return unauthorized();
            return ok(requests);
        }

        function createRequest() {
            if (!isAuthenticated()) return unauthorized();

            const request = body;
            request.id = requests.length ? Math.max(...requests.map(x => x.id)) + 1 : 1;
            request.status = 'Pending';
            request.employee = employees.find(x => x.id === request.employeeId);
            requests.push(request);

            return ok();
        }

        function updateRequest() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const params = body;
            const request = requests.find(x => x.id === idFromUrl());
            
            if (!request) return error('Request not found');
            
            Object.assign(request, params);
            
            return ok();
        }

        function deleteRequest() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const id = idFromUrl();
            requests = requests.filter(x => x.id !== id);
            
            return ok();
        }

        // ===== HELPER FUNCTIONS =====

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
        }

        function error(message) {
            return throwError({ error: { message } }).pipe(materialize(), delay(500), dematerialize());
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } }).pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(account) {
            const { id, title, firstName, lastName, email, role, status, dateCreated, isVerified } = account;
            return { id, title, firstName, lastName, email, role, status, dateCreated, isVerified };
        }

        function isAuthenticated() {
            return !!currentAccount();
        }

        function isAuthorized(role) {
            const account = currentAccount();
            return account && account.role === role;
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }

        function currentAccount() {
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-jwt-token')) return;

            const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
            if (Date.now() > (jwtToken.exp * 1000)) return;

            return accounts.find(x => x.id === jwtToken.id);
        }

        function generateJwtToken(account) {
            // create token that expires in 15 minutes
            const tokenPayload = {
                exp: Math.round(Date.now() / 1000) + 15 * 60,
                id: account.id
            };
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
            const token = new Date().getTime().toString();
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;
            return token;
        }

        function getRefreshToken() {
            return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
        }
    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};