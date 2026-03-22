import { Routes } from '@angular/router';
import { Master } from './components/master/master';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { TaskDashboard } from './features/task-dashboard/task-dashboard';

export const routes: Routes = [
    {
        path:'' , component:Master
    },
    {
        path:'login',component:Login
    },
    {
        path:'register',component:Register
    },
    {
        path: 'dashboard', component: TaskDashboard
    }
];
